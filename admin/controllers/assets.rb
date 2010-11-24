Admin.controllers :assets do

  get :index do
    @assets = Asset.all
    render 'assets/index'
  end

  get :new do
    @asset = Asset.new
    render 'assets/new'
  end

  post :create do
    @asset = Asset.new(params[:asset])
    if @asset.save
      flash[:notice] = 'Asset was successfully created.'
      redirect url(:assets, :edit, :id => @asset.id)
    else
      render 'assets/new'
    end
  end

  get :edit, :with => :id do
    @asset = Asset.find(params[:id])
    render 'assets/edit'
  end

  put :update, :with => :id do
    @asset = Asset.find(params[:id])
    if @asset.update_attributes(params[:asset])
      flash[:notice] = 'Asset was successfully updated.'
      redirect url(:assets, :edit, :id => @asset.id)
    else
      render 'assets/edit'
    end
  end

  delete :destroy, :with => :id do
    asset = Asset.find(params[:id])
    if asset.destroy
      flash[:notice] = 'Asset was successfully destroyed.'
    else
      flash[:error] = 'Impossible destroy Asset!'
    end
    redirect url(:assets, :index)
  end
end