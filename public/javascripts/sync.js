// Enable pusher logging - don't include this in production
Pusher.log = function() {
  if (window.console) window.console.log.apply(window.console, arguments);
};

// Flash fallback logging - don't include this in production
WEB_SOCKET_DEBUG = true;

var pusher = new Pusher('e5aba36a22a5138f1131');
pusher.subscribe('bahometh');
pusher.bind('update', function(data) {
  update_object(data);
});

function update_object(data){
  
}
