$( () ->
  window.SessionView = Backbone.View.extend
    
    el                      :  $("#container")

    events: 
      "click #play"         :  "playSession"
      "click #stop"         :  "stopSession"
      "click #add-track"    :  "addTrack"

    initialize: ->
      _.bindAll(this, 
        'addOneAsset'       , 'addAllAssets', 
        'addOneTrack'       , 'addAllTracks',
        'addOneClip'        , 'addAllClips' ,
        'addTimeline'       ,
        'render'
      )
      
      $(".tracks-block").jScrollPane()
      
      Assets.bind('add'     , this.addOneAsset)
      Assets.bind('refresh' , this.addAllAssets)
      Assets.bind('all'     , this.render)
      Assets.fetch()
      
      Tracks.bind('add'     , this.addOneTrack)
      Tracks.bind('refresh' , this.addAllTracks)
      Tracks.bind('all'     , this.render)
      Tracks.fetch()
      
      Clips.bind('add'      , this.addOneClip)
      Clips.bind('refresh'  , this.addAllClips)
      Clips.bind('all'      , this.render)
      
      # --------------------------------------------------
      # Load clips only after soundmanager has initialized
      # --------------------------------------------------
      soundManager.onload = ->
        Clips.fetch()
      
        window.SessionTimeline = new Timeline
          id: 0
          playhead_position: 0
          session_state: "stop"
          timeline_width: $(".tracks-block").width()
      
      # --------------------------------------------------
      # Make all clips on timeline selectable
      # --------------------------------------------------
      $(".tracks-list").selectable
        filter: '.clip'
    
    # --------------------------------------------------
    # Start playing clips from 0 position
    # --------------------------------------------------
    playSession: ->
      SessionTimeline.set
        session_state: "play"
      
      window.playInterval = setInterval ->
        left = parseInt($("#playhead").css("left"))
        $("#playhead").css("left", left+1+"px")
        SessionTimeline.set
          playhead_position: left
      ,100
      
      Clips.each (clip) ->
        window.Timeout.set(clip.cid, ->
          soundClip = soundManager.getSoundById clip.cid
          soundClip.onposition(parseInt(clip.get("duration")), -> this.stop())
          soundManager.play clip.cid
        parseInt(clip.get("position"))*100)
      
      
    addTrack: ->
      $.ajax
        type : "POST"
        url  : '/api/tracks/new.json'
        data : 
          session_id : location.pathname.split('/')[2]          
        success : (data) ->
          Tracks.add([new Track(data[0])])
          
    stopSession: ->
      SessionTimeline.set
        session_state     : "stop"
        playhead_position : 0
      soundManager.stopAll()
      
      Clips.each (clip) ->
        window.Timeout.clear(clip.cid)
      
      clearInterval window.playInterval
          
      $('#playhead').css("left", 0)
    
    addOneAsset: (asset) ->
      view = new AssetView model: asset
      this.$("#app-assets ul").append view.render().el
      
    addAllAssets: ->
      Assets.each(this.addOneAsset)
      
    addOneTrack: (track) ->
      view = new TrackView model: track
      this.$("#app-timeline ul.tracks-list").append view.render().el
      $("#playhead").height $(".tracks-list").height()
      
    addAllTracks: ->
      Tracks.each this.addOneTrack
      
    addOneClip: (clip) ->
      view = new ClipView model: clip
      duration = clip.get("duration")/100
      position = clip.get("position")
      timelineWidth = SessionTimeline.get("timeline_width")
      
      if (duration+position) > timelineWidth 
        $('.tracks-block').width(timelineWidth + duration+position)
        SessionTimeline.set
          "timeline_width": timelineWidth + duration+position
          
      clip.get("track_ids").forEach (track_id) ->
        this.$("#app-timeline ul.tracks-list li #track-"+track_id+" ul.clips-list").append(view.render().el)        
        
        asset = Assets.get clip.get("asset_id")
          
        soundManager.createSound
          id: clip.cid
          autoLoad: true
          url: clip.get("filepath")+"?secret_token="+asset.get("secret_token")+"&consumer_key=HPVSlSWvz2eoFt5jGGB8A"
          whileloading: ->
            $('#clip-'+clip.get('_id') + ' .clip-loader').css
              width: (this.bytesLoaded/this.bytesTotal)*100 + '%'
          onload: ->
            $('#clip-'+clip.get('_id')).css
              opacity: 1
            $('#clip-'+clip.get('_id') + ' .clip-loader').fadeOut()
          
          
    addAllClips: ->
      Clips.each this.addOneClip
  
  window.Session = new SessionView
)