$( () ->
  window.UserList = Backbone.Collection.extend
  
    model : User
    url   : "/api/session/users.json"
  
  window.Users = new UserList
)