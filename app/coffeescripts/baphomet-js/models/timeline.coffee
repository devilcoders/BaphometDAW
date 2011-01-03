$( () ->
  window.Timeline = Backbone.Model.extend  
  
    set: (attributes, options) ->
      Backbone.Model.prototype.set.call(this, attributes, options)

)