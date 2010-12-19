$( () ->
  window.SessionView = Backbone.View.extend
    
    el        :  $("#container")

    events: 
      "click #play"       :  "playSession"
      "click #stop"       :  "stopSession"
      "click #add-track"  :  "addTrack"

    initialize: ->
      _.bindAll(this, 
        'addOneAsset', 'addAllAssets', 
        'addOneTrack', 'addAllTracks',
        'addOneClip' , 'addAllClips' ,
        'render'
      )
      
      Assets.bind('add',     this.addOneAsset)
      Assets.bind('refresh', this.addAllAssets)
      Assets.bind('all',     this.render)
      Assets.fetch()
      
      Tracks.bind('add',     this.addOneTrack)
      Tracks.bind('refresh', this.addAllTracks)
      Tracks.bind('all',     this.render)
      Tracks.fetch()
      
      Clips.bind('add',     this.addOneClip)
      Clips.bind('refresh', this.addAllClips)
      Clips.bind('all',     this.render)
      
      soundManager.onload = ->
        Clips.fetch()
      
      $(".tracks-list").selectable
        filter: '.clip'
    
    playSession: ->
      window.playInterval = setInterval('$("#playhead").css("left", parseInt($("#playhead").css("left"))+1)', 100)
      Clips.each((clip) ->
        window.playTimeout = setTimeout('soundManager.play("'+clip.cid+'")', parseInt(clip.get("position"))*100)
      )
      
    addTrack: ->
      $.ajax
        type : "POST"
        url  : '/api/tracks/new.json'
        data : 
          session_id : location.pathname.split('/')[2]          
        success : (data) ->
          Tracks.add([new Track(data[0])])      
    
    stopSession: ->
      soundManager.stopAll()
      window.clearInterval(playInterval)
      window.clearTimeout(playTimeout)
      $('#playhead').css("left", 0)
    
    addOneAsset: (asset) ->
      view = new AssetView ({model: asset})
      this.$("#app-assets ul").append(view.render().el)
      
    addAllAssets: ->
      Assets.each(this.addOneAsset)
      
    addOneTrack: (track) ->
      view = new TrackView({model: track})
      this.$("#app-timeline ul.tracks-list").append(view.render().el)
      
    addAllTracks: ->
      Tracks.each(this.addOneTrack)
      $("#playhead").height($(".tracks-list").height())
      
    addOneClip: (clip) ->
      view = new ClipView({ model: clip })
      clip.get("track_ids").forEach((track_id) ->
        this.$("#app-timeline ul.tracks-list li #track-"+track_id+" ul.clips-list").append(view.render().el)        
        
        asset = Assets.get(clip.get("asset_id"))        
          
        soundManager.createSound({
          id: clip.cid
          autoLoad: true
          url: clip.get("filepath")+"?secret_token="+asset.get("secret_token")+"&consumer_key=HPVSlSWvz2eoFt5jGGB8A"
          whileloading : -> 
            console.log 'sound '+this.sID+' loading, '+this.bytesLoaded+' of '+this.bytesTotal
        }).onposition(parseInt(clip.get("duration")), () -> this.stop())
            
      )
          
    addAllClips: ->
      
      Clips.each(this.addOneClip)
  
  window.Session = new SessionView
)