PIXEL_SECOND = 10;

/*------------------------------------------ 
  CLIP
------------------------------------------*/
function Clip(options) {

  this.id = options.id;
  this.duration = options.duration;
  this.title = options.title;
  this.user = options.user;
  this.position = options.position;
  this.track = options.track;
  this.selected = true;
  this.filepath = options.filepath;

  var clipObject = this;

  var clip = $(
    "<div class='clip' id='clip-"+this.id+"' style='width: "+(this.duration*PIXEL_SECOND)+"px; left: "+(this.position*PIXEL_SECOND)+"px;top:5px;'>"
      + "<div class='clip-info'>"
        + "<div class='clip-title'>"+this.title+"</div>"
        + "<div class='clip-duration'>"+this.duration+"</div>"
        + "<div class='clip-user'>"+this.user+"</div>"
      + "</div>"
    + "</div>"
  );

  clip.resizable({
    containment: 'parent',
    handles: 'w, e',
    grid: [5, 0],
    maxWidth: this.track.width(),
    minWidth: PIXEL_SECOND,
    resize: function(event, ui){
     clipObject.update_duration(ui.size.width/PIXEL_SECOND)
    }
  });

  clip.draggable({
    axis: "x",
    containment: 'parent',
    grid: [5, 0],
    stack: ".clip",
    drag: function(event, ui) {
      clipObject.update_position(ui.position.left)
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
      new Clip({
        id: ui.draggable.context.firstElementChild.id.split('-')[1],
        track: $('#app-timeline .tracks-block').find("#track-" + trackObject.id),
        position: (ui.offset.left - 330)/PIXEL_SECOND,
        filepath: ui.draggable.context.firstChild.href
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

  var assetObject = this;

  var asset = $("<li class='asset'><a id='asset-"+this.id+"' href='"+this.filepath+"'>"+this.filename+"</li>");

  asset.draggable({
    revert: "invalid",
    appendTo: 'body',
    helper: "clone"
  });

  $("#app-assets .assets-block ul").append(asset);


}

