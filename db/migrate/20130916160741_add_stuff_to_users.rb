class AddStuffToUsers < ActiveRecord::Migration
  def change
    add_column :users, :username, :string
    add_column :users, :password, :string
    add_column :users, :confirmation, :string
  end
end
