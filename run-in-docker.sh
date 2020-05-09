# Build Container
docker build -t designapis/petsitter:latest .
# Run stack
docker-compose -f ./docker-compose.yml up -d
