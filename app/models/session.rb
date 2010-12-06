class Session
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

  # field <name>, :type => <type>, :default => <value>
  field :title, :type => String
  
  references_many :tracks, :stored_as => :array, :inverse_of => :sessions
  references_many :users, :stored_as => :array, :inverse_of => :sessions
  references_many :clips, :stored_as => :array, :inverse_of => :sessions

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

end
