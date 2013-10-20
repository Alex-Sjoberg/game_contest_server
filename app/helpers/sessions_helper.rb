module SessionsHelper
  
  def current_user
    @current_user ||= User.find(cookies.signed[:user_id]) if cookies.signed[:user_id]
  end
  
  def logged_in?
    !current_user.nil?
  end
  
  def current_user?(user)
    current_user == user
  end
  
  def admin?()
    current_user.admin
  end
  
end
