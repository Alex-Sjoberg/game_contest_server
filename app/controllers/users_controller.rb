class UsersController < ApplicationController
    
    def new
        @user = User.new()
    end
    
    def create
        puts "PARAMS IS!!!!!!!!!!" , params
        puts "Params sub user" , params[:user]
       # params = params[:user].symbolize_keys
        
        @user = User.new()
       # @user.update_attributes!(user_params)
    end
    
    private 
    def user_params
        params.require(:user).permit(:username,:password,:confirmation,:email)
    end
    
end
