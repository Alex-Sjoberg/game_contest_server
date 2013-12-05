class Referee < ActiveRecord::Base
  include Uploadable
  
  belongs_to :user
  has_many :matches, as: :manager
  has_many :contests
  
  validates :name , presence: true , uniqueness: true, length: {minimum: 1}
  validates :rules_url , presence: true , length: {minimum: 1}
  validates :file_location , presence: true , length: {minimum: 2}
  validates :players_per_game, numericality: { greater_than: 0, less_than: 11 , only_integer: true}
  validates :rules_url , format: URI::regexp(%w(http https))
  
  def referee
    self
  end
    

end
