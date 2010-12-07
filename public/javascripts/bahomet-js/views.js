$(function(){

  
  /*-------------------------------------------
    CLIP view
  -------------------------------------------*/
  window.ClipView = Backbone.View.extend({
    
    template    :  _.template($('#clip-template').html()),

    events: {
      
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.view = this;
    },
    
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
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
      return this;
    }
    
  });
  
  
  
  
  /*-------------------------------------------
    Track view
  -------------------------------------------*/
  window.TrackView = Backbone.View.extend({
    
    tagName     :  "li",
    className   :  "track",
    template    :  _.template($('#track-template').html()),

    events: {
      
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.view = this;
    },
    
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));      
      return this;
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
      var view = new ClipView({model: clip});
      _.each(clip.attributes.track_ids, function(track_id){
        this.$("#app-timeline ul.tracks-list li #track-"+track_id+" ul.clips-list")
          .append(view.render().el)
          .find(".clip")
          .resizable()
          .draggable();
      })
      
    },    
    addAllClips: function() {
      Clips.each(this.addOneClip);
    }
    
  });
  
  window.Session = new SessionView;
  
  
  
  
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
  

})