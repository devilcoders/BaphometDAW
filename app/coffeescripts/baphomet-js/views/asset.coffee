$( () ->
  window.AssetView = Backbone.View.extend
  
    tagName     :  "li"
    className   :  "asset"
    template    :  _.template($('#asset-template').html())
    
    initialize: ->
      _.bindAll this, 'render'
      this.model.bind 'change', this.render
      this.model.view = this
    
    
    render: ->
      $(this.el).html(this.template(this.model.toJSON()));
      $(this.el).draggable
        revert    :  "invalid"
        appendTo  :  'body'
        helper    :  "clone"    
      
      return this
      
)   