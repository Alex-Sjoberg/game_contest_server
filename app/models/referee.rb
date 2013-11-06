class Referee < ActiveRecord::Base
  belongs_to :user
  has_many :matches, as: :manager
  has_many :contests
    
    def upload=(uploaded_io)
        if uploaded_io.nil?
            'then its an error!'
        else
            time_no_spaces = Time.now.to_s.gsub(/\s/,'_')
            file_location = Rails.root.join('code','referees', time_no_spaces + current_user.id.to_s)
            self.file_location = 'the/location/of/the/file/on/the/server/;/might/be/long/like/this/-Ghandi'
        end
    end
end
