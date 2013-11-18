class Contest < ActiveRecord::Base
  
  validates :user_id , presence: true
  validates :referee_id , presence: true
  validates :start , presence: true,  :timeliness => { :on_or_after => lambda { Date.current } } 
  validates :deadline , presence: true , :timeliness => {:on_or_after => lambda { Date.current }}
  validates :name , presence: true , uniqueness: true
  validates :description, presence: true
  validates :contest_type , presence: true
  validate :valid_deadline , :valid_start , :deadline_before_start

  
  belongs_to :user
  belongs_to :referee
  has_many :players
  has_many :matches, as: :manager
  
  def valid_deadline
   # puts "!!!!!!!!!!!!!!!!!!!!!!!!"
    #puts deadline.year, deadline.mon, deadline.day
   # puts Date.valid_date?(deadline.year,deadline.month,deadline.day)
    if deadline.nil? or !Date.valid_date?(deadline.year, deadline.month, deadline.day)
      errors.add(:deadline, "is not a real date")
    end
  end
  
  def valid_start
    if start.nil? or !Date.valid_date?(start.year, start.month, start.day)
      errors.add(:start, "is not a real date")
    end
  end
  
  def deadline_before_start
    if start.nil? or deadline.nil? or start < deadline
      errors.add(:start , "cannot be before the deadline")
    end
  end

end
