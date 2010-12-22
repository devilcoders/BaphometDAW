class Track
  include Mongoid::Document
  include Mongoid::Timestamps

  # field <name>, :type => <type>, :default => <value>
  field :title, :type => String
  field :atype, :type => String, :default => "audio"
  field :state, :type => String, :default => "active"
  
  references_many :clips, :stored_as => :array, :inverse_of => :tracks
  references_many :sessions, :stored_as => :array, :inverse_of => :tracks
  references_many :users, :stored_as => :array, :inverse_of => :tracks 
  
  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

end
