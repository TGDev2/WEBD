echo "Rebuilding sqlite3 module for Linux architecture in webd service..."
npm rebuild sqlite3 --build-from-source
echo "Starting Concert Ticketing Webd Microservice..."
node src/index.js
