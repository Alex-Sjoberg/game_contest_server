class UsersController < ApplicationController
    
    def new
        @user = User.new
    end
  
  def index
    @users = User.all
  end
    
    def create
        @user = User.new(user_params)
      if @user.save then
          flash[:success] = "Yay you did it, " + @user.username + "!"
          redirect_to @user
        else
          render 'new'
        end 
      end 
       
    def show
        @user = User.find(params[:id])
    end
      
      
      def update
        @user = User.find(params[:id])
       
        if @user.update(user_params)
          redirect_to @user
        else
          render 'edit'
        end
      end  
      
      def edit
        @user = User.find(params[:id])
      end
      
      def destroy
        @user = User.find(params[:id])
        @user.destroy
        redirect_to users_path
      end
    
    private 
    def user_params
      params.require(:user).permit(:username,:password,:password_confirmation,:email)
    end
    
end
