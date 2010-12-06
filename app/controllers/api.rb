Bahometh.controllers :api do
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
  
  layout :none

  get :assets, :map => "/api/assets", :provides => [:json] do
    case content_type
    when :json
      if not session[:user_id].nil?
        @user = User.find(session[:user_id])
        access_token = OAuth::AccessToken.new($sc_consumer, @user.access_token, @user.access_token_secret)
        @sc = Soundcloud.register({:access_token => access_token})
        @sc_user = @sc.User.find_me
        @assets = @sc_user.tracks
      
        render :"api/assets"
      end            
    end
  end
  
  get :tracks, :map => "/api/session/tracks", :provides => [:json] do
    case content_type
    when :json
      if not session[:user_id].nil?
        session = Session.find(params[:session_id])
        @tracks = session.tracks.all 
        render :"api/tracks/session"
      end            
    end
  end
  
  get :clips, :map => "/api/session/clips", :provides => [:json] do
    case content_type
    when :json
      if not session[:user_id].nil?
        session = Session.find(params[:session_id])
        @clips = session.clips.all 
        render :"api/clips/session"
      end            
    end
  end
  
  post :new_track, :map => "/api/tracks/new", :provides => [:json] do
    case content_type
    when :json
      if not session[:user_id].nil?
        @user = User.find(session[:user_id])
        session = Session.find(params[:session_id])
        @track = Track.create
        session.tracks << @track
        @user.tracks << @track
        render :"api/tracks/new"
      end
    end
  end
  
  post :new_clip, :map => "/api/clips/new", :provides => [:json] do
    case content_type
    when :json
      if not session[:user_id].nil?
        @user = User.find(session[:user_id])
        session = Session.find(params[:session_id])
        @track = Track.find(params[:track_id])
        @clip = Clip.create({
          :title => params[:title],
          :position => params[:position],
          :duration => params[:duration],
          :asset_duration => params[:duration],
          :asset_id => params[:asset_id],
          :waveform_url => params[:waveform_url],
          :filepath => params[:filepath]
        })
        @track.clips << @clip
        session.clips << @clip
        @user.clips << @clip
        p @clip
        render :"api/clips/new"
      end
    end
  end
  
  post :clip_set_duration, :map => "/api/clips/set_duration", :provides => [:json] do
    case content_type
    when :json
      if not session[:user_id].nil?        
        @clip = Clip.find(params[:clip_id])
        @clip.update_attributes(:duration => params[:duration])
        render :"api/clips/duration"
      end
    end
  end
  
  post :clip_set_position, :map => "/api/clips/set_position", :provides => [:json] do
    case content_type
    when :json
      if not session[:user_id].nil?        
        @clip = Clip.find(params[:clip_id])
        @clip.update_attributes(:position => params[:position])
        render :"api/clips/position"
      end
    end
  end
  
end