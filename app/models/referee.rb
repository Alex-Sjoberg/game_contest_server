class Referee < ActiveRecord::Base
  belongs_to :user
  has_many :matches, as: :manager
  has_many :contests
    
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
