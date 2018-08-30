# For files users.json and registered_rooms.json
#
# Please add more here as needed.
#
# EstrelSteel [Wow] - 2018.08.30

# Creating files that could not exist if they don't
if [ ! -e users.json ]; then
	echo "File ./users.json doesn't exist... Creating it."
	echo "{}" > users.json
fi
if [ ! -e registered_rooms.json ]; then
	echo "File ./registered_rooms.json doesn't exist... Creating it."
	echo "{}" > registered_rooms.json
fi

# Booting the server
if [ "$#" = "0" ]; then
	npm start
else
	if [ "$1" = "test" ]; then
		npm test
	else
		node server.js $1
	fi
fi