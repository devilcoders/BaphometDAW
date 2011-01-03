$( () ->
  window.TrackView = Backbone.View.extend
    
    tagName       :  "li"
    className     :  "track"
    template      :  _.template($('#track-template').html())

    events: {
      "drop"      :  "drop"      
    }

    initialize: ->
      _.bindAll this, 'render', 'drop'
      this.model.bind 'change', this.render
      this.model.view = this
    
    render: ->
      $(this.el).html this.template(this.model.toJSON())
    
      $(this.el).droppable
        accept: '.asset'    
    
      return this
    

    drop: (event, ui) ->
      asset = Assets.get ui.draggable.context.children[0].id.split('-')[1]
      
      $.ajax
        type: "POST"
        url:  '/api/clips/new.json'
        data: 
          session_id      :  location.pathname.split('/')[2]
          title           :  asset.get('title')
          track_id        :  this.model.get('_id')
          asset_id        :  asset.get('id')
          position        :  JSON.stringify(ui.offset.left - 330)
          duration        :  asset.get('duration')
          filepath        :  asset.get('stream_url')
          waveform_url    :  asset.get('waveform_url')          
        success: (data) ->          
          Clips.add([
            new Clip(data[0])
          ]);
)