scriptPath=$(dirname $0)"/createFirstAdmin"

if [ -f "$scriptPath.ts" ]; then
  echo "$scriptPath.ts" found
  NODE_PATH="..:./node_modules" ts-node "$scriptPath.ts" "$@"
else
  echo "$scriptPath.ts" not found. Running createFirstAdmin.js
  NODE_PATH="..:./node_modules" node "$scriptPath.js" "$@"
fi
