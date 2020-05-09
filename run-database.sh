# Start a MongoDB Server in a Docker container
docker run --name petsitter-db -d -p 27017:27017 mongo:4.2.3

# Start a Mongo Express Container for MongoDB Administration and link to DB
docker run --name mongo-express -d -e ME_CONFIG_MONGODB_SERVER=petsitter-db -p 8081:8081 --link petsitter-db:petsitter-db mongo-express