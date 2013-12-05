class Player < ActiveRecord::Base
  include Uploadable

  validates :user_id , presence: true
  validates :contest_id , presence:true
  validates_presence_of :name , :file_location, :description
  validates :name , :uniqueness => { :scope => :contest}
  

  
  belongs_to :user
  belongs_to :contest
  has_many :player_matches
  has_many :matches , through: :player_matches
  
  def losses
    total_losses = 0
    player_matches.each do |match|
      if match.result == "Loss"
        total_losses += 1
      end  
    end
    total_losses
    #player_matches.count{|match| match.result === "Loss"} why doesn't this work? :(
  end
    
  def wins
    total_wins = 0
    player_matches.each do |match|
      if match.result == "Win"
        total_wins += 1
      end
    end
    total_wins
      
  end
    
    
end

