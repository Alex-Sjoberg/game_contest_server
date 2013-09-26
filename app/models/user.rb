class User < ActiveRecord::Base
  has_secure_password
  
  #validates :username , presence: true , uniqueness: true , length: {maximum: 20}
  #validates :email, presence: true , uniqueness: true ,format: { with: /\A[\w\d]{1,8}@[\w\d]+\.[a-z]{2,}\z/ }
  validates :username , presence: true , uniqueness:true ,length: {maximum: 20}
  validates :email , presence:true , format: {with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i}
end
