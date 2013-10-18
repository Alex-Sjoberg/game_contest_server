class UsersController < ApplicationController
  before_action  :ensure_user_logged_in , only: [:edit,:update]
  before_action :ensure_correct_user , only: [:edit, :update]
  before_action :ensure_admin , only: [:destroy]
  
    def new
        @user = User.new
    end
  
  def index
    @users = User.all
  end
    
    def create
        @user = User.new(user_params)
      if @user.save then
        flash[:success] = "Welcome" + @user.username + "!"
          cookies.signed[:user_id] = @user.id
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
      
      def ensure_user_logged_in
        ( flash[:warning] = "Unable" and redirect_to login_path) unless logged_in?
      end
      
      def ensure_correct_user
        @user = User.find(params[:id])
        (redirect_to "/" and flash[:danger] = "Unable") unless current_user?(@user)
      end
      
      def ensure_admin
        #redirect_to root_path unless current_user and current_user.admin?
        true
      end
    
end
