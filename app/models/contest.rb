class Contest < ActiveRecord::Base
  validates :user_id , presence: true
  validates :referee_id , presence: true
  validates :deadline , presence: true
  validates :start , presence: true
  validates :name , presence: true
  validates :description, presence: true
  validates :contest_type , presence: true

  
  belongs_to :user
  belongs_to :referee
  has_many :players
  has_many :matches, as: :manager

end
