$(function(){
  
  
  /*-------------------------------------------
    CLIP collection
  -------------------------------------------*/
  window.ClipList = Backbone.Collection.extend({ 
    
    model : Clip,    
    url   : "/api/session/clips.json"
  });
  
  window.Clips = new ClipList;
  
  
  
  
  /*-------------------------------------------
    ASSET collection
  -------------------------------------------*/
  window.AssetList = Backbone.Collection.extend({ 
    
    model : Asset,
    url   : "/api/assets.json"
    
  });
  
  window.Assets = new AssetList;
  
  
  
  
  /*-------------------------------------------
    TRACK collection
  -------------------------------------------*/
  window.TrackList = Backbone.Collection.extend({ 
    
    model : Track,
    url   : "/api/session/tracks.json"
    
  });
  
  window.Tracks = new TrackList;
  
  
  
  
  /*-------------------------------------------
    SESSION collection
  -------------------------------------------*/
  window.SessionList = Backbone.Collection.extend({ 
    
    model : Asset,
    url   : "/api/sessions.json"
    
  });  
  
  
  
  
  /*-------------------------------------------
    USER collection
  -------------------------------------------*/
  window.UserList = Backbone.Collection.extend({ 
    
    model : User,
    url   : "/api/session/users.json"
    
  })

})