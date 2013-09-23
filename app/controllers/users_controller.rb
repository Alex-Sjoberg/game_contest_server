class UsersController < ApplicationController
    
    def new
        @user = User.new()
    end
    
    def create
        puts "PARAMS IS!!!!!!!!!!" , params
        puts "Params sub user" , params[:user]
       # params = params[:user].symbolize_keys
        
        @user = User.new(user_params)
        if @user.save
        #@user.update_attributes!(user_params)
          redirect_to @user
        else
          render 'new'
        end 
    end
    
    private 
    def user_params
      params.require(:user).permit(:username,:password,:password_confirmation,:email)
    end
    
end
