class User < ActiveRecord::Base
  
	def new
        puts "Here"
        render text: params[:post].inspect
	end
    
    def create
    end
    
end
