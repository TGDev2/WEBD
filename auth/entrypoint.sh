echo "Rebuilding sqlite3 module for Linux architecture..."
npm rebuild sqlite3 --build-from-source
echo "Starting authentication service..."
node src/index.js
