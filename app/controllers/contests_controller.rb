class ContestsController < ApplicationController
  before_action :ensure_contest_creator , except: [:index, :show]
  before_action :get_contest, only: [:show, :update , :edit ]
  
  def new
    @contest = current_user.contests.build
  end
  
  def create
    @contest = current_user.contests.build(contest_params)
    @contest.referee = Referee.find(params[:contest][:referee])
    if @contest.save
      flash[:success] = "Contest created"
      redirect_to @contest
    else
      flash[:danger] = "Naw dude, thats ain't right"
      render :new
    end
  end
  
  def show
  end
    
  
  private
  
  def ensure_contest_creator
    current_user.contest_creator
  end
  
  def contest_params
    params.require(:contest).permit(:name , :description , :contest_type, :deadline , :start)
  end
    
    def get_contest
      @contest = Contest.find(params[:id])
    end
  
end
