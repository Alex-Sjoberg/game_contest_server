class ContestsController < ApplicationController
  before_action :ensure_user_logged_in , except: [:index, :show]
  before_action :ensure_contest_creator , except: [:index, :show]
  before_action :get_contest, only: [:show, :update , :edit , :destroy]
  before_action :ensure_owner , only: [:update , :edit , :destroy ]
  
  def new
    @contest = current_user.contests.build
  end
  
  def create
    @contest = current_user.contests.build(contest_params)
   #@contest.referee = Referee.find(params[:contest][:referee].to_i)
    if @contest.save
      flash[:success] = "Contest created"
      redirect_to @contest
    else
      flash[:danger] = "Naw dude, that ain't right"
      render :new
    end
  end
  
  def show
  end
  
  def edit
  end
  
  def update
    #@contest.referee = Referee.find(params[:contest][:referee])
    if @contest.update(contest_params)
        flash[:success] = "Contest has been updated" 
        redirect_to @contest
      else
        flash[:danger] = "Invalid contest information" 
        render 'edit'
      end
  end
  
   def destroy
     flash[:success] = "Successfully deleted contest"
     @contest.destroy
     redirect_to contests_path
   end    
  
  def index
    @contests = Contest.all
  end
  
  private
  
  def ensure_contest_creator
    (flash[:danger] = "Unable" and redirect_to root_path) unless logged_in? and current_user.contest_creator
  end
  
  def contest_params
    params.require(:contest).permit(:name , :description , :contest_type, :deadline , :start , :referee_id)
  end
    
    def get_contest
      @contest = Contest.find(params[:id])
    end
  
  def ensure_owner
    @contest = get_contest
    (flash[:danger] = "Unable" and redirect_to root_path) unless owner?(@contest)
  end
  
end
