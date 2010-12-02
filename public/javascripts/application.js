$(document).ready(function(){
  
  /* SoundCloud API */
  var api = $.sc.api('8h4MLbPKttdxZm3l0YN3w', {
    onAuthSuccess: function(user, container){
      alert('You are ' + user.username + ' on SoundCloud!');
    }
  });
  
})

