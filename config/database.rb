# Connection.new takes host, port
require 'uri'
uri = URI.parse(ENV['MONGOHQ_URL'])

host = case Padrino.env 
  when :development then 'localhost'
  when :production  then uri.host
end
port = case Padrino.env 
  when :development then Mongo::Connection::DEFAULT_PORT
  when :production  then uri.port
end
database_name = case Padrino.env
  when :development then 'bahometh_development'
  when :production  then 'bahometh_production'
  when :test        then 'bahometh_test'
end

Mongoid.database = Mongo::Connection.new(host, port).db(database_name)

# You can also configure Mongoid this way
# Mongoid.configure do |config|
#   name = @settings["database"]
#   host = @settings["host"]
#   config.master = Mongo::Connection.new.db(name)
#   config.slaves = [
#     Mongo::Connection.new(host, @settings["slave_one"]["port"], :slave_ok => true).db(name),
#     Mongo::Connection.new(host, @settings["slave_two"]["port"], :slave_ok => true).db(name)
#   ]
# end
#
# More installation and setup notes are on http://mongoid.org/docs/
