PIXEL_SECOND = 10;

soundManager.url = '/flash/';
soundManager.flashVersion = 9; 

/*------------------------------------------ 
  CLIP
------------------------------------------*/
function Clip(options) {

  this.id = options.id;
  this.duration = (options.duration/1000)*PIXEL_SECOND;
  this.title = options.title;
  this.user = options.user;
  this.position = options.position/PIXEL_SECOND;
  this.track = options.track;
  this.selected = true;
  this.asset_duration = (options.asset_duration/1000)*PIXEL_SECOND;
  this.filepath = options.filepath;
  this.waveform_url = options.waveform_url;

  var clipObject = this;

  var clip = $(
    "<div class='clip' id='clip-"+this.id+"' style='width: "+this.duration+"px; left: "+(this.position*PIXEL_SECOND)+"px;top:5px;'>"
      + "<div class='clip-info'>"
        + "<div class='clip-waveform'><img width='"+this.duration+"px' height='60px' src='"+this.waveform_url+"' /></div>"
        + "<div class='clip-title'>"+this.title+"</div>"        
        + "<div class='clip-duration'>"+(this.duration/PIXEL_SECOND)+"</div>"
        + "<!--<div class='clip-user'>"+this.user+"</div>-->"
      + "</div>"
    + "</div>"
  );

  clip.resizable({
    handles: 'e',
    grid: [0, 10],
    maxWidth: clipObject.asset_duration,
    minWidth: PIXEL_SECOND,
    resize: function(event, ui){
     clipObject.update_duration(ui.size.width/PIXEL_SECOND)
    },
    stop: function(event, ui){
      $.post('/api/clips/set_duration.json', {
        clip_id: clipObject.id,
        duration: parseInt((ui.size.width/PIXEL_SECOND)*1000)
      }, 
      function(data){
        if(data.clip[0].success == true){
          console.log("Duration changed in db!")
        }
      })
    }
  });

  clip.draggable({
    axis: "x",
    containment: 'parent',
    grid: [5, 0],
    stack: ".clip",
    drag: function(event, ui) {
      clipObject.update_position(ui.position.left)
    },
    stop: function(event, ui) {
      $.post('/api/clips/set_position.json', {
        clip_id: clipObject.id,
        position: (ui.offset.left - 330)
      }, 
      function(data){
        if(data.clip[0].success == true){
          console.log("Position changed in db!")
        }
      })
    }
  });

  this.track.append(clip);

  this.remove = function(){
    clip.remove();
  };

  this.update_duration = function(duration) {
    clip.css("width", duration*PIXEL_SECOND);
    this.duration = duration*PIXEL_SECOND;
    clip.find('.clip-duration').text(this.duration/PIXEL_SECOND)
  };

  this.update_position = function(left, top) {
    this.position = left/PIXEL_SECOND;
    clip.css("top", top+"px")
  };

}


/*------------------------------------------ 
  TRACK
------------------------------------------*/
function Track(options) {

  this.id = options.id;
  this.type = options.type;
  this.title = options.title;
  this.user = options.user;
  
  var trackObject = this;

  var track = $('<div class="track" id="track-'+this.id+'"/>');

  $('#app-timeline .tracks-block').append(track);

  track.droppable({
    accept: '.asset',
    drop: function(event, ui){
      console.log(event)
      console.log(ui)
      $.post('/api/clips/new.json', { 
        session_id: location.pathname.split('/')[2], 
        title: ui.draggable.context.innerText,
        track_id: event.target.id.split('-')[1],
        position: (ui.offset.left - 330),
        duration: ui.draggable.context.firstChild.dataset.duration,        
        filepath: ui.draggable.context.firstChild.href,
        waveform_url: ui.draggable.context.firstChild.dataset.waveform
      }, function(data){
        if(data.clip[0].success == true){
          new Clip({    
            id: data.clip[0].clip_id,
            track: $("#app-timeline .tracks-block").find("#track-"+data.clip[0].track_id),
            duration: data.clip[0].duration,
            asset_duration: data.clip[0].asset_duration,
            position: data.clip[0].position,
            title: data.clip[0].title,
            user: data.clip[0].user_id,
            filepath: data.clip[0].filepath,
            waveform_url: data.clip[0].waveform_url
          })       
        }
      });
    }
  });

}


/*------------------------------------------ 
  ASSET
------------------------------------------*/
function Asset(options) {

  this.id = options.id;
  this.type = options.type;
  this.user = options.user;
  this.filename = options.filename;
  this.filepath = options.filepath;
  this.duration = options.duration;
  this.waveform_url = options.waveform_url;

  var assetObject = this;

  var asset = $("<li class='asset'><a id='asset-"+this.id+"' href='"+this.filepath+"' data-duration='"+this.duration+"' data-waveform='"+this.waveform_url+"'>"+this.filename+"</li>");

  asset.draggable({
    revert: "invalid",
    appendTo: 'body',
    helper: "clone"
  });

  $("#app-assets .assets-block ul").append(asset);


}

