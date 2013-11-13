class Referee < ActiveRecord::Base
  belongs_to :user
  has_many :matches, as: :manager
  has_many :contests
  
  validates :name , presence: true , length: {minimum: 1}
  validates :rules_url , presence: true , length: {minimum: 1}
  validates :file_location , presence: true , length: {minimum: 2}
  validates :players_per_game, numericality: { greater_than: 0, less_than: 11 , only_integer: true}
  validates :rules_url , format: URI::regexp(%w(http https))
    
    def upload=(uploaded_io)
        if uploaded_io.nil?
            'then its an error!'
        else
            time_no_spaces = Time.now.to_s.gsub(/\s/,'_')
            file_location = Rails.root.join('code','referees', Rails.env ,time_no_spaces).to_s
            IO::copy_stream(uploaded_io, file_location)
          self.file_location = file_location
        end
    end
end
