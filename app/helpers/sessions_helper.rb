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
  
  def admin?
    current_user.admin
  end
  
  def owner?(object)
    current_user.id == object.user_id
  end
  
  def contest_creator?
    current_user.contest_creator
  end
  
  def banned?
    curent_user.banned
  end
      
  def ensure_admin
    redirect_to root_path unless current_user and current_user.admin?
  end
  
  def ensure_user_logged_in
    (flash[:warning] = "Unable" and redirect_to login_path) unless logged_in?
  end
    
    def ensure_contest_creator
      (flash[:danger] = "You aren't allowed to create contests" and redirect_to root_path) unless current_user and current_user.contest_creator?
    end
  
  def ensure_not_banned
    (flash[:warning] = "Unable, you're banned" and  redirect_to root_path) unless current_user and not current_user.banned?
  end
  
  

  
end
