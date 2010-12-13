$(function(){
  
  
  /*-------------------------------------------
    CLIP model
  -------------------------------------------*/
  window.Clip = Backbone.Model.extend({

    set: function(attributes, options) {
      Backbone.Model.prototype.set.call(this, attributes, options);
    },
  
    setDuration: function(duration){
      this.set("duration", duration);
    },
  
    setPosition: function(position){
      this.set("position", position)
    },
  
    clear: function(){
      this.destroy();
      this.view.remove();
    }
  
  });
  
  
  
  
  
  /*-------------------------------------------
    ASSET model
  -------------------------------------------*/
  window.Asset = Backbone.Model.extend({
    
    set: function(attributes, options) {
      Backbone.Model.prototype.set.call(this, attributes, options);
    },
  
    clear: function(){
      this.destroy();
      this.view.remove();
    }
  
  });
  
  
  
  
  /*-------------------------------------------
    TRACK model
  -------------------------------------------*/
  window.Track = Backbone.Model.extend({
    
    set: function(attributes, options) {
      Backbone.Model.prototype.set.call(this, attributes, options);
    },
  
    clear: function(){
      this.destroy();
      this.view.remove();
    }
  
  });
  
  
  
  
  /*-------------------------------------------
    USER model
  -------------------------------------------*/
  window.User = Backbone.Model.extend({
    
    set: function(attributes, options) {
      Backbone.Model.prototype.set.call(this, attributes, options);
    },
  
    clear: function(){
      this.destroy();
      this.view.remove();
    }
  
  });
  
});