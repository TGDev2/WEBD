set -e

echo "==== Building images (to ensure we have the latest) ===="
docker-compose build

echo "==== Running Auth tests ===="
docker-compose run --rm auth npm test

echo "==== Running Webd tests ===="
docker-compose run --rm webd npm test

echo "==== Running Frontend tests ===="
# On exécute la phase de build multi-étapes,
# qui inclut le npm test en stage 1 :
docker-compose build frontend

echo "All tests passed successfully!"
