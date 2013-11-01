class CreatePlayers < ActiveRecord::Migration
  def change
    create_table :players do |t|
      t.string :file_location
      t.string :name
      t.text :description
      t.boolean :downloadable , default: false
      t.boolean :playable , default: true
      t.references :user, index: true
      t.references :contest, index: true

      t.timestamps
    end
  end
end
