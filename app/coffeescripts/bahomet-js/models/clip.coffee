$( () ->
  window.Clip = Backbone.Model.extend
  
    set: (attributes, options) ->
      Backbone.Model.prototype.set.call(this, attributes, options)    
  
    setDuration: (duration) ->
      this.set("duration", duration)
  
    setPosition: (position) ->
      this.set("position", position)

    clear: ->
      this.destroy()
      this.view.remove()
)