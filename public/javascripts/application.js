$(document).ready(function(){
  
  $('.asset').draggable({
    revert: "invalid",
    appendTo: 'body',
    helper: "clone"
  });
  
  $('#add-track').click(function(e){
    e.preventDefault();
    var track = new Track({id: 1})
  })
  
})

