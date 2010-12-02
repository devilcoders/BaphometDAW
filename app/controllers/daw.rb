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

  get :daw, :map => "/daw/:id" do
    audio_session = AudioSession.find(params[:id])
    @asset = Asset.new
    @title = audio_session.title
    render :'daw/daw'
  end

  post :new, :map => "/audio_sessions/new" do
    title = params[:audio_session][:title]
    audio_session = AudioSession.new({
      :title => title
    })
    if audio_session.save
      redirect "/daw/#{audio_session._id}"
    end
  end

  get :index, :map => "/" do
    @audio_session = AudioSession.new
    render :'daw/index'
  end

end

