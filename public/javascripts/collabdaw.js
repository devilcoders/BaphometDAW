PIXEL_SECOND = 10;

function Clip(options) {

  this.id = options.id;
  this.duration = options.duration;
  this.title = options.title;
  this.user = options.user;
  this.position = options.position;
  this.track = options.track;
  this.selected = true;

  var clipObject = this;

  var clip = $(
    "<div class='clip' style='width: "+(this.duration*PIXEL_SECOND)+"px; left: "+(this.position*PIXEL_SECOND)+"px;top:5px;'>"
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
     clipObject.update_duration(ui.size.width)
     clipObject.update_position(ui.position.left, 5)
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

  shortcut.add("Delete",function() {
    if(clipObject.selected){
      clipObject.remove();
    }
  })

  this.track.append(clip);

  this.remove = function(){
    clip.remove();
  };

  this.update_duration = function(duration) {
    this.duration = duration/PIXEL_SECOND;
    clip.find('.clip-duration').text(this.duration)
  };

  this.update_position = function(left, top) {
    this.position = left/PIXEL_SECOND;
    clip.css("top", top+"px")
  };

}



function Track(options) {

  this.id = options.id;
  this.type = options.type;
  this.title = options.title;
  this.user = options.user;



}




function Asset(options) {

  this.id = options.id;
  this.type = options.type;
  this.user = options.user;
  this.filename = options.filename;
  this.filepath = options.filepath;

  var asset = $("<li class='asset'><a href='"+this.filepath+"'>"+this.filename+"</li>");

  asset.draggable({
    revert: "invalid",
    appendTo: 'body',
    helper: "clone"
  });

  $('.track').each(function(){
    $(this).droppable({
      accept: '.asset',
      drop: function(event, ui){
        new Clip({
          track: $(this),
          position: (ui.offset.left - 330)/PIXEL_SECOND
        });
      }
    })
  })

  $("#app-assets .assets-block ul").append(asset);


}

