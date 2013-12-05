class PlayersController < ApplicationController
  before_action :ensure_user_logged_in , except: [:index, :show]
  before_action :get_contest , only: [:new, :index , :create]
  before_action :get_player , only: [:show, :destroy, :edit, :update]
  before_action :ensure_user_is_owner , only: [:edit , :delete , :update , :destroy]
  
  #/contests/:contest_id/players/new
  def new
    @player = @contest.players.build
  end
  
  #/contests/:contest_id/players
  def create
    @player = @contest.players.build(player_params)
    @player.user = current_user
    if @player.save
      flash[:success] = "Player created"
      redirect_to @player
    else
      render :new
    end
  end
  
  def show
  end
  
  def index
    @players = @contest.players
  end
  
  def destroy
    flash[:success] = "Successfully murdered this player. Congratulations hero."
    File.delete(@player.file_location)
    @player.destroy
    redirect_to contest_players_path(@player.contest)
  end
  
  def edit
  end
  
  def update
    if @player.update(player_params)
      flash[:success] = "Player has been updated" 
      redirect_to @player
    else
      flash[:danger] = "Invalid player information" 
      render 'edit'
    end
  end
  
  private
  
    def get_contest
      @contest = Contest.find(params[:contest_id])
    end  
  
  def get_player
    @player = Player.find(params[:id])
  end
  
    def player_params
      params.require(:player).permit(:name , :upload , :description)
    end
  
    def ensure_user_is_owner
      @player = get_player
      (flash[:danger] = "Unable" and redirect_to root_path) unless owner?(@player)
    end
  
end


