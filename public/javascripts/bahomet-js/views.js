$(function(){

  
  /*-------------------------------------------
    CLIP view
  -------------------------------------------*/
  window.ClipView = Backbone.View.extend({

    tagName         :  "li",
    className       :  "clip",
    template        :  _.template($('#clip-template').html()),
    
    events: {
      "resizestop"  :  "updateDuration",
      "resize"      :  "updateClipInfo",
      "dragstop"    :  "updatePosition",
      "click"       :  "getClipInfo"
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    updatePosition: function(){
      var offset = $("#clip-"+this.model.get("_id")).offset();
      $.post('/api/clips/set_position.json', {
        clip_id: this.model.get("_id"),
        position: (offset.left - 330)
      },
      function(data){
        if(data.clip[0].success){
          console.log("Position changed in db!")
        }
      })
    },
    
    updateClipInfo: function(){      
      $(this.el).find('.clip-duration').text($(this.el).width()/10)
    },

    updateDuration: function(){
      $.post('/api/clips/set_duration.json', {
        clip_id: this.model.get("_id"),
        duration: parseInt(($("#clip-"+this.model.get("_id")).width()/10)*1000)
      },
      function(data){
        if(data.clip[0].success){
          console.log("Duration changed in db!")
        }
      })
    },
    
    getClipInfo: function(){
      $('#clip-preview').html('<img class="clip-waveform" src="'+this.model.get("waveform_url")+'" width="100%" height="100px" />')
    },
    
    render: function() {
      var track = this;
      $(this.el).attr("id", "clip-"+this.model.get("_id"));
      $(this.el).css({
        width: this.model.get('duration')/100,
        left: this.model.get('position'),
        top: 5
      });
      $(this.el).html(this.template(this.model.toJSON()));
      $(this.el).draggable({
        axis: "x",
        containment: '.track',
        grid: [5, 0],
        stack: ".clip",
        distance: 10
      });
      $(this.el).resizable({
        handles: 'e',
        grid: [0, 10],
        maxWidth: this.model.get("asset_duration")/100,
        minWidth: 10
        //, alsoResize: ".clip.ui-selected"
      });
      return this;
    }
    
  });
  
  
  
  
  /*-------------------------------------------
    ASSET view
  -------------------------------------------*/
  window.AssetView = Backbone.View.extend({
    
    tagName     :  "li",
    className   :  "asset",
    template    :  _.template($('#asset-template').html()),
    
    events: {
      
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.view = this;
    },
    
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      $(this.el).draggable(
        {
          revert    :  "invalid",
          appendTo  :  'body',
          helper    :  "clone"
        }        
      );
      return this;
    }
    
  });
  
  
  
  
  /*-------------------------------------------
    Track view
  -------------------------------------------*/
  window.TrackView = Backbone.View.extend({
    
    tagName               :  "li",
    className             :  "track",
    template              :  _.template($('#track-template').html()),

    events: {
      "drop"              :  "drop"      
   },

    initialize: function() {
      _.bindAll(this, 'render', 'drop');
      this.model.bind('change', this.render);
      this.model.view = this;
    },
    
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      $(this.el).droppable(
        {
          accept: '.asset'
        }
      );
      return this;
    },

    drop: function(event, ui){
      var asset = Assets.get(ui.draggable.context.children[0].id.split('-')[1]);
      $.ajax({
        type: "POST",
        url:  '/api/clips/new.json',
        data: {
          session_id      :  location.pathname.split('/')[2],
          title           :  asset.get('title'),
          track_id        :  this.model.get('_id'),
          asset_id        :  asset.get('id'),
          position        :  JSON.stringify(ui.offset.left - 330),
          duration        :  asset.get('duration'),
          filepath        :  asset.get('stream_url'),
          waveform_url    :  asset.get('waveform_url')
        },
        success: function(data){
          var clip = new Clip(data[0]);
          Clips.add([
            clip
          ]);
        }
      });


    }
    
  });
  
  
  
  
  /*-------------------------------------------
    USER view
  -------------------------------------------*/
  window.UserView = Backbone.View.extend({

    tagName: "div",

    className: "user",

    events: {

    },

    initialize: function() {
      _.bindAll(this, "render");
    },

    render: function() {

    }

  });




  /*-------------------------------------------
    SESSION view
  -------------------------------------------*/
  window.SessionView = Backbone.View.extend({
    
    tagName   :  "div",
    className :  "session",
    el        :  $("#container"),

    events: {
      
    },

    initialize: function() {
      _.bindAll(this, 
        'addOneAsset', 'addAllAssets', 
        'addOneTrack', 'addAllTracks',
        'addOneClip' , 'addAllClips' ,
        'render'
      );

      Assets.bind('add',     this.addOneAsset);
      Assets.bind('refresh', this.addAllAssets);
      Assets.bind('all',     this.render);
      Assets.fetch();
      
      Tracks.bind('add',     this.addOneTrack);
      Tracks.bind('refresh', this.addAllTracks);
      Tracks.bind('all',     this.render);
      Tracks.fetch();
      
      Clips.bind('add',     this.addOneClip);
      Clips.bind('refresh', this.addAllClips);
      Clips.bind('all',     this.render);
      Clips.fetch();

      $(".tracks-list").selectable({
        filter: '.clip'
      })
    },

    render: function() {
      
    },
    
    addOneAsset: function(asset) {
      var view = new AssetView({model: asset});
      this.$("#app-assets ul").append(view.render().el);
    },    
    addAllAssets: function() {
      Assets.each(this.addOneAsset);
    },
    addOneTrack: function(track) {
      var view = new TrackView({model: track});
      this.$("#app-timeline ul.tracks-list").append(view.render().el);
    },    
    addAllTracks: function() {
      Tracks.each(this.addOneTrack);
    },
    addOneClip: function(clip) {
      var view = new ClipView({ model: clip });
      clip.get("track_ids").forEach(function(track_id){
        console.log(Assets.get(clip.get("asset_id")))
        this.$("#app-timeline ul.tracks-list li #track-"+track_id+" ul.clips-list")
          .append(view.render().el);
        var asset = Assets.get(clip.get("asset_id"))
        soundManager.createSound({
          id: clip.cid,
          url: clip.get("filepath")+"?secret_token="+asset.get("secret_token")+"&consumer_key=HPVSlSWvz2eoFt5jGGB8A"
        });
      });
    },    
    addAllClips: function() {
      Clips.each(function(clip){
        var view = new ClipView({model: clip});
        clip.get("track_ids").forEach(function(track_id){
          this.$("#app-timeline ul.tracks-list li #track-"+track_id+" ul.clips-list")
            .append(view.render().el);
          var asset = Assets.get(clip.get("asset_id"))
          soundManager.createSound({
            id: clip.cid,
            url: clip.get("filepath")+"?secret_token="+asset.get("secret_token")+"&consumer_key=HPVSlSWvz2eoFt5jGGB8A"
          });
        });
      });
    }
    
  });
  
  window.Session = new SessionView;
  

});