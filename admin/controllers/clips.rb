Admin.controllers :clips do

  get :index do
    @clips = Clip.all
    render 'clips/index'
  end

  get :new do
    @clip = Clip.new
    render 'clips/new'
  end

  post :create do
    @clip = Clip.new(params[:clip])
    if @clip.save
      flash[:notice] = 'Clip was successfully created.'
      redirect url(:clips, :edit, :id => @clip.id)
    else
      render 'clips/new'
    end
  end

  get :edit, :with => :id do
    @clip = Clip.find(params[:id])
    render 'clips/edit'
  end

  put :update, :with => :id do
    @clip = Clip.find(params[:id])
    if @clip.update_attributes(params[:clip])
      flash[:notice] = 'Clip was successfully updated.'
      redirect url(:clips, :edit, :id => @clip.id)
    else
      render 'clips/edit'
    end
  end

  delete :destroy, :with => :id do
    clip = Clip.find(params[:id])
    if clip.destroy
      flash[:notice] = 'Clip was successfully destroyed.'
    else
      flash[:error] = 'Impossible destroy Clip!'
    end
    redirect url(:clips, :index)
  end
end