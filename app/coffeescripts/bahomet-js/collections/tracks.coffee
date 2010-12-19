$( () ->
  window.TrackList = Backbone.Collection.extend
  
    model : Track
    url   : "/api/session/tracks.json"
  
  window.Tracks = new TrackList
)