Bahomet.controllers :daw do
  
  soundcloud_config = File.join(File.dirname(__FILE__), "../..", "config", "soundcloud.yml")
  $soundcloud = YAML.load(File.new(soundcloud_config).read)

  $sc_consumer = Soundcloud.consumer($soundcloud[ENV['RACK_ENV']]['key'], $soundcloud[ENV['RACK_ENV']]['secret'], $soundcloud[ENV['RACK_ENV']]['site'])
  
  get :daw, :map => "/daw/:id" do
    if not session[:user_id].nil?
      session[:session_id] = params[:id]
      @user = User.find(session[:user_id])
      @session = Session.find(params[:id])
      access_token = OAuth::AccessToken.new($sc_consumer, @user.access_token, @user.access_token_secret)
      @sc = Soundcloud.register({:access_token => access_token})
      @sc_user = @sc.User.find_me
      @assets = @sc_user.tracks
      @asset = Asset.new
      @title = @session.title    
      render :'daw/daw'
    else
      render '/'
    end
  end

  get :redirect, :map => "/sc/redirect" do
    callback_url = "http://#{env["HTTP_HOST"]}/sc/callback"
    sc_request_token = $sc_consumer.get_request_token(:oauth_callback => callback_url)
    session[:sc_request_token] = sc_request_token.token
    session[:sc_request_token_secret] = sc_request_token.secret
    @authorize_url = "#{$soundcloud[ENV['RACK_ENV']]['authorize']}?oauth_token=#{sc_request_token.token}"
    redirect @authorize_url
  end

  # after authentication at the Soundcloud authorize page, the user will land here
  # we get the access_token and use it to get the Soundcloud user resource 
  # then we look in our db to see if we know this user already otherwise we add him.
  # he will then be redirected to the loggedin page.
  get :callback, :map => "/sc/callback" do
    sc_request_token = OAuth::RequestToken.new($sc_consumer, session[:sc_request_token], session[:sc_request_token_secret])
    sc_access_token = sc_request_token.get_access_token(:oauth_verifier => params[:oauth_verifier])
    p sc_access_token
    sc = Soundcloud.register({:access_token => sc_access_token, :site => $soundcloud[ENV['RACK_ENV']]['site']})
    me = sc.User.find_me
    # check if user with me.id exists, update username & oauth stuff otherwise create a new user
    user = User.find(:first, :conditions => {:sc_user_id => me.id})
    if user.nil?
      user = User.create({
        :sc_user_id => me.id, 
        :sc_username => me.username,
        :access_token => sc_access_token.token, 
        :access_token_secret => sc_access_token.secret,
        :role => "owner" 
      })
    else
      user.sc_username = me.username
      user.access_token = sc_access_token.token
      user.access_token_secret = sc_access_token.secret
      user.save!
    end
    
    session[:user_id] = user.id
    redirect "/"
  end
  
  # delete his session and redirect to home
  get :logout, :map => "/logout" do
    session[:user_id] = nil
    flash[:notice] = "You've logged out. Good bye!"    
    redirect "/"      
  end
  
  post :new, :map => "/sessions/new" do
    if not session[:user_id].nil?
      user = User.find(session[:user_id])
      title = params[:session][:title]
      session = Session.new({:title => title})
      if session.save      
        user.sessions << session        
        redirect "/daw/#{session._id}"
      else
        redirect "/"
      end
    else
      redirect "/"
    end
  end

  get :index, :map => "/" do
    if not session[:user_id].nil?
      @user = User.find(session[:user_id])
      @sessions = @user.sessions.all
      @session = Session.new     
    end
    render :'daw/index'
  end

end

