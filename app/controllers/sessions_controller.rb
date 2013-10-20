class SessionsController < ApplicationController
  
  def new
    
  end
  
  def create
    @user = User.find_by(username: params[:username])
    if @user && @user.authenticate(params[:password])
      cookies.signed[:user_id] = @user.id
      flash[:success] = "Welcome"
      redirect_to @user
    else 
      flash.now[:danger] = "Invalid credentials"
      render :new
   
    end
  end
  
  def destroy
    flash[:info] = "You've logged out"
    cookies.delete(:user_id)
    redirect_to root_path
  end
end
