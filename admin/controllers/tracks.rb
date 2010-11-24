Admin.controllers :tracks do

  get :index do
    @tracks = Track.all
    render 'tracks/index'
  end

  get :new do
    @track = Track.new
    render 'tracks/new'
  end

  post :create do
    @track = Track.new(params[:track])
    if @track.save
      flash[:notice] = 'Track was successfully created.'
      redirect url(:tracks, :edit, :id => @track.id)
    else
      render 'tracks/new'
    end
  end

  get :edit, :with => :id do
    @track = Track.find(params[:id])
    render 'tracks/edit'
  end

  put :update, :with => :id do
    @track = Track.find(params[:id])
    if @track.update_attributes(params[:track])
      flash[:notice] = 'Track was successfully updated.'
      redirect url(:tracks, :edit, :id => @track.id)
    else
      render 'tracks/edit'
    end
  end

  delete :destroy, :with => :id do
    track = Track.find(params[:id])
    if track.destroy
      flash[:notice] = 'Track was successfully destroyed.'
    else
      flash[:error] = 'Impossible destroy Track!'
    end
    redirect url(:tracks, :index)
  end
end