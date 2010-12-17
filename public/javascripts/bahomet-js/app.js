$(function(){

  soundManager.url = '/flash/';
  soundManager.flashVersion = 9;

  $('#add-track').click(function(e){
    e.preventDefault();
    $.ajax({
      type          :  "POST",
      url           :  '/api/tracks/new.json',
      data          :  {
                          session_id      :  location.pathname.split('/')[2]
                       },
      success       :  function(data){
                         console.log(data[0]);
                         var track = new Track(data[0]);
                         console.log(track);
                         Tracks.add([
                           track
                         ]);
                       }
    });
  });

  $(".clip").each(function(){
    $(this).find('clip-info').click(function(){
      var clip = Clips.get($(this).attr("id").split("-")[1]);
      var clipKeys = _.keys(clip);
      var clipValues = _.values(clip);
      console.log(clipKeys);
      console.log(clipValues);
      //$("#app-clips-controls")
    })
  })
  
  

});