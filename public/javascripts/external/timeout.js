window.Timeout = { 
  _timeouts: {}, 
  set: function(name, func, time){ 
    this.clear(name); 
    this._timeouts[name] = {pending: true, func: func}; 
    var tobj = this._timeouts[name];
    tobj.timeout = setTimeout(function(){ 
      /* setTimeout normally passes an accuracy report on some browsers, this just forwards that. */
      tobj.func.call(arguments); 
      tobj.pending = false;
    }, time); 
  },
  hasRun: function(name){ 
    if(this._timeouts[name]){
      return !this._timeouts[name].pending; 
    }
    return -1; /* Whut? */ 
  },
  runNow: function(name){
    if( this._timeouts[name] && this.hasRun(name)===false ){
      this._timeouts[name].func(-1); /* fake time. *shrug* */
      this.clear(name);
    }
  },
  clear: function(name){
    if(this._timeouts[name] && this._timeouts[name].pending){
      clearTimeout(this._timeouts[name].timeout); 
      this._timeouts[name].pending = false; 
    }
  }
};