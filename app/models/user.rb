class User < ActiveRecord::Base
    attr_accessor :username , :password , :confirmation
  
	def new
        puts "Here"
        render text: params[:post].inspect
	end
    
    def create
    end
    
end
