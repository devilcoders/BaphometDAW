Admin.controllers :audio_sessions do

  get :index do
    @audio_sessions = AudioSession.all
    render 'audio_sessions/index'
  end

  get :new do
    @audio_session = AudioSession.new
    render 'audio_sessions/new'
  end

  post :create do
    @audio_session = AudioSession.new(params[:audio_session])
    if @audio_session.save
      flash[:notice] = 'AudioSession was successfully created.'
      redirect url(:audio_sessions, :edit, :id => @audio_session.id)
    else
      render 'audio_sessions/new'
    end
  end

  get :edit, :with => :id do
    @audio_session = AudioSession.find(params[:id])
    render 'audio_sessions/edit'
  end

  put :update, :with => :id do
    @audio_session = AudioSession.find(params[:id])
    if @audio_session.update_attributes(params[:audio_session])
      flash[:notice] = 'AudioSession was successfully updated.'
      redirect url(:audio_sessions, :edit, :id => @audio_session.id)
    else
      render 'audio_sessions/edit'
    end
  end

  delete :destroy, :with => :id do
    audio_session = AudioSession.find(params[:id])
    if audio_session.destroy
      flash[:notice] = 'AudioSession was successfully destroyed.'
    else
      flash[:error] = 'Impossible destroy AudioSession!'
    end
    redirect url(:audio_sessions, :index)
  end
end