class UsersController < ApplicationController
  before_action :ensure_user_logged_in , only: [:edit,:update]
  before_action :ensure_correct_user , only: [:edit, :update]
  before_action :ensure_admin , only: [:destroy]
  
  respond_to :html, :json , :xml
  
    def new
      if !logged_in? then
        @user = User.new
      else
        flash[:warning] = "You're already logged in"
        redirect_to("/")
      end
    end
  
  def index
    @users = User.all
    respond_with(@user)
  end
    
    def create
      if logged_in?
        redirect_to root_path
        flash[:warning] = "Log out to create a new account"
      else
          @user = User.new(user_params)
        if @user.save then
          flash[:success] = "Welcome" + @user.username + "!"
            cookies.signed[:user_id] = @user.id
            redirect_to @user
          else
            render 'new'
          end 
        end
     end 
       
    def show
        @user = User.find(params[:id])
    end
      
      
      def update
        @user = User.find(params[:id])
       
        if @user.update(user_params)
          flash[:success] = " 'Congratulations, you've updated your account information' -Ghandi " 
          redirect_to @user
        else
          flash[:danger] = " 'You entered the wrong information' -Ghandi " 
          render 'edit'
        end
      end  
      
      def edit
        @user = User.find(params[:id])
      end
      
      def destroy
        @user = User.find(params[:id])
        if admin? and current_user?(@user)
          flash[:danger] = "Admin suicide is prohibited. Can't delete yourself"
          redirect_to root_path
        elsif admin?
          flash[:success] = "Successfully deleted user"
          @user.destroy
          redirect_to users_path
        end
      end
      
    private 
    def user_params
      params.require(:user).permit(:username,:password,:password_confirmation,:email)
    end
      
      def ensure_correct_user
        @user = User.find(params[:id])
        (redirect_to "/" and flash[:danger] = "Unable") unless current_user?(@user)
      end
      
      def ensure_admin
        (flash[:danger] = "Unable" and redirect_to root_path) unless current_user and current_user.admin?
      end
    
end
