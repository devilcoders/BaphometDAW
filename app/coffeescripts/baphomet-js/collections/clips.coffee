$( () ->
  window.ClipList = Backbone.Collection.extend    
    
      model       :  Clip
      url         :  "/api/session/clips.json"
    
      comparator:  (model) ->
        return model.get "position"

  window.Clips = new ClipList
)