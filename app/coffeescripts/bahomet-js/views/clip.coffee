$( () ->
  window.ClipView = Backbone.View.extend

    tagName         :  "li"
    className       :  "clip"
    template        :  _.template($('#clip-template').html())
    
    events: 
      "resizestop"  :  "updateDuration"
      "resize"      :  "updateClipInfo"
      "dragstop"    :  "updatePosition"
      "click"       :  "getClipInfo"    

    initialize: ->
      _.bindAll this, 'render'
      this.model.bind 'change', this.render
      this.model.view = this
    

    updatePosition: ->
      offset = $("#clip-"+this.model.get("_id")).position()
      $.post('/api/clips/set_position.json', {
        clip_id: this.model.get("_id")
        position: offset.left
      }
      (data) ->
        if data.clip[0].success
          console.log "Position changed in db!"
      )
    
    updateClipInfo: ->
      $(this.el).find('.clip-duration').text($(this.el).width()/10)
      $(this.el).append '<div class="clip-marker clip-marker-right" />'

    updateDuration: ->
      $.post('/api/clips/set_duration.json', {
        clip_id: this.model.get("_id")
        duration: parseInt(($("#clip-"+this.model.get("_id")).width()/10)*1000)
      },
      (data) ->
        if data.clip[0].success
          console.log "Duration changed in db!"
          $(this.el).find('.clip-marker').remove();
      )
    
    getClipInfo: ->
      $('#clip-preview').html '<img class="clip-waveform" src="'+this.model.get("waveform_url")+'" width="100%" height="100px" />'
      
    render: ->
      track = this
    
      $(this.el).attr id: "clip-" + this.model.get("_id")
    
      $(this.el).css
        width       : this.model.get('duration')/100
        left        : this.model.get('position')
        top         : 5
      
      $(this.el).html this.template(this.model.toJSON())
    
      $(this.el).draggable
        axis        : "x"
        containment : '.track'
        stack       : ".clip"
        distance    : PIXEL_SECOND
      
      $(this.el).resizable
        handles     : 'e'
        maxWidth    : this.model.get("asset_duration")/100,
        minWidth    : PIXEL_SECOND
      
      return this
)