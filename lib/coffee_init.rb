module CoffeeInitializer
  def self.registered(app)
    require 'rack/coffee'
    app.use Rack::Coffee,
      :root => app.root,
      :urls => '/coffeescripts'
      # :root: the directory above urls. Defaults to Dir.pwd.
      # :urls: the directories in which to look for coffeescripts. May specify a string or an array of strings. Defaults to /javascripts.
      #Whether to serve any static assets found in your urls (via Rack::File). Defaults to true; Specify false to pass through to your app.
      #:static =>  false
      # :cache: Sets a Cache-Control header if truthy, public if set to :public
      # :ttl: The default max-age value for the Cache-Control header. Defaults to 86400.
      #When true, disables the top-level function wrapper that CoffeeScript uses by default.
      #:nowrap => true 

  end
end