class RefereesController < ApplicationController
  before_action :ensure_user_logged_in , except: [:index, :show]
  before_action :get_referee , only: [:edit, :show , :update , :destroy]
  before_action :ensure_user_is_owner , only: [:edit , :delete , :update , :destroy]
  before_action :ensure_contest_creator, only: [:edit , :update , :create , :new]
  
  def new
    @referee = current_user.referees.build
  end
    
    def create
        @referee = current_user.referees.build(referee_params)
        if @referee.save then
          flash[:success] = "Referee created"
          redirect_to @referee
          else
            render :new
        end
    end
      
    def index
      @referees = Referee.all
    end
      
   def destroy
     flash[:success] = "Successfully deleted referee"
     File.delete(@referee.file_location)
     @referee.destroy
     redirect_to referees_path
   end
      
    def show
          @referee = Referee.find_by_id(params[:id])
    end
      
    def edit
    end

    def update 
      if @referee.update(referee_params)
        flash[:success] = "Referee has been updated" 
        redirect_to @referee
      else
        flash[:danger] = "Invalid referee information" 
        render 'edit'
      end
    end  
    
    private
      def referee_params
        params.require(:referee).permit(:name , :upload , :players_per_game , :rules_url)
      end
      
    def get_referee
      @referee = Referee.find(params[:id])
    end
      
    def ensure_user_is_owner
      @referee = get_referee
      (flash[:danger] = "Unable" and redirect_to root_path) unless owner?(@referee)
    end

      
      
end


