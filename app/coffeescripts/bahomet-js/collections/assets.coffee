$( () ->
  window.AssetList = Backbone.Collection.extend
  
    model : Asset
    url   : "/api/assets.json"
  
  window.Assets = new AssetList
)