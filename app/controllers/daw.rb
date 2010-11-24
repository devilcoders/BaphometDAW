Bahometh.controllers :daw do
  # get :index, :map => "/foo/bar" do
  #   session[:foo] = "bar"
  #   render 'index'
  # end

  # get :sample, :map => "/sample/url", :provides => [:any, :js] do
  #   case content_type
  #     when :js then ...
  #     else ...
  # end

  # get :foo, :with => :id do
  #   "Maps to url '/foo/#{params[:id]}'"
  # end

  # get "/example" do
  #   "Hello world!"
  # end

  get :index, :map => "/" do
    render :'daw/index'
  end
  
  post '/upload' do
    FileUtils.mkdir_p("./public/files")
    File.open(params[:file].filename, 'wb') do |file|
      file.write(datafile[:tempfile].read)
    end
    "wrote to #{filename}\n"
  end

end