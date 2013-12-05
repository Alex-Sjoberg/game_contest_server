class MatchesController < ApplicationController
  before_action :get_contest , only: [:index]
  before_action :get_match , only: [:show, :destroy, :edit, :update]  
  
  def show
  end
  
  def index
    @matches = @contest.matches
  end
  
  
  private
    def get_contest
      @contest = Contest.find(params[:contest_id])
    end
  
  def get_match
    @match = Match.find(params[:id])
  end
  
end
