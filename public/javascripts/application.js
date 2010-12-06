$(document).ready(function(){
  
  $('.asset').draggable({
    revert: "invalid",
    appendTo: 'body',
    helper: "clone"
  });
  
  $('#add-track').click(function(e){
    e.preventDefault();
    $.post($(this).attr("href"), function(data){
      if(data.track[0].success == true){
        new Track({
          id: data.track[0].track_id,
          type: "audio",
          user: data.track[0].user_id
        })
      }
    })
  });
  
  $.getJSON('/api/assets.json', function(data){
    $.each(data.assets, function(i, item){
      new Asset({
        id: item.id,
        type: "audio",
        filepath: item.stream_url,
        duration: item.duration,
        filename: item.title,
        waveform_url: item.waveform_url
      }) 
    })
  });
  
  $.getJSON('/api/session/tracks.json', {session_id: location.pathname.split('/')[2]}, function(data){
    $.each(data.tracks, function(i, item){
      new Track({
        id: item._id
      }) 
    })
  });
  
  $.getJSON('/api/session/clips.json', {session_id: location.pathname.split('/')[2]}, function(data){
    $.each(data.clips, function(i, item){
      new Clip({
        user: item.user_ids[0],
        track: $("#track-" + item.track_ids[0]),
        id: item._id,
        duration: item.duration,
        asset_duration: item.asset_duration,
        position: item.position,
        title: item.title,
        waveform_url: item.waveform_url,
        filepath: item.filepath
      }) 
    })
  });
  
})

