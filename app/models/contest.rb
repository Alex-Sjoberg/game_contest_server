class Contest < ActiveRecord::Base
  
  validates :user_id , presence: true
  validates :referee_id , presence: true
  validates :start , presence: true,  :timeliness => { :on_or_after => lambda { Date.current } } 
  validates :deadline , presence: true , :timeliness => {:on_or_after => lambda { Date.current }}
  validates :name , presence: true , uniqueness: true
  validates :description, presence: true
  validates :contest_type , presence: true
  
  validate  :deadline_before_start

  
  belongs_to :user
  belongs_to :referee
  has_many :players
  has_many :matches, as: :manager
  
  def deadline_before_start
    if start.nil? or deadline.nil? or start < deadline
      errors.add(:start , "cannot be before the deadline")
    end
  end

end
