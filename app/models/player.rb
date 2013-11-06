class Player < ActiveRecord::Base
  validates :user_id , presence: true
  validates :contest_id , presence:true
  
  belongs_to :user
  belongs_to :contest
  has_many :player_matches
  has_many :matches , through: :player_matches
  
end
