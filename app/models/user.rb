class User
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

  # field <name>, :type => <type>, :default => <value>
  field :sc_user_id, :type => Integer
  field :sc_username, :type => String
  field :access_token, :type => String
  field :access_token_secret, :type => String
  field :role, :type => String
  
  references_many :tracks, :stored_as => :array, :inverse_of => :users
  references_many :clips, :stored_as => :array, :inverse_of => :users
  references_many :assets
  references_many :sessions, :stored_as => :array, :inverse_of => :users 
  
  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

end
