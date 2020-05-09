# Build Container
docker build -t petsitter-backend .

# Start Dependencies
sh run-database.sh

# Run Container
docker run -p 8080:8080 --link=petsitter-db:petsitter-db petsitter-backend