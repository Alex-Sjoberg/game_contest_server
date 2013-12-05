module Uploadable
  extend ActiveSupport::Concern
  
  included do
    validates :file_location, presence: true
    validate :valid_file_location
  end
  
  
    def upload=(uploaded_io)
        if uploaded_io.nil?
            'then its an error!'
        else
            time_no_spaces = Time.now.to_s.gsub(/\s/,'_')
            file_location = Rails.root.join('code',self.class.to_s.pluralize.downcase, Rails.env ,time_no_spaces).to_s
            IO::copy_stream(uploaded_io, file_location)
            self.file_location = file_location
        end
    end
      
      def valid_file_location
        if file_location.nil? or not File.exist?(file_location)
          errors.add(:file_location , "is not a valid file")
        end
      end
  
end