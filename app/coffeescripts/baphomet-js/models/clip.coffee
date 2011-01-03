$( () ->
  window.Clip = Backbone.Model.extend
  
    set: (attributes, options) ->
      Backbone.Model.prototype.set.call(this, attributes, options)

    clear: ->
      this.destroy()
      this.view.remove()
)