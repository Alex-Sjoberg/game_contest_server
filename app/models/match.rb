class Match < ActiveRecord::Base
  validates :manager_id , presence: true
  validates :status , presence: true
  validates :earliest_start , :timeliness => { :on_or_after => lambda { Date.current } } , :unless => [:completed? , :started?]
  validates :earliest_start , presence: true, :unless => [:started? , :completed?]
  validates :completion , presence: true , :timeliness => {:on_or_before => lambda { Date.current }} , :if => :completed?
  validate :right_number_of_players?
  
  belongs_to :manager, polymorphic: true
  has_many :player_matches
  has_many :players, through: :player_matches
  
  def completed?
    self.status == "Completed"
  end
  
  def started?
    self.status == "Started"
  end
  
  def right_number_of_players?
    if self.manager.nil? or self.player_matches.count != self.manager.referee.players_per_game
      errors.add(:status)
    end
  end
end
