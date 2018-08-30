:: UNTESTED - I assume this will work.
:: For files users.json and registered_rooms.json
::
:: Please add more here as needed.
::
:: EstrelSteel [Wow] - 2018.08.30

@echo off

:: Creating files that could not exist if they don't
if exists users.json (
	@echo "File ./users.json doesn't exist... Creating it."
	echo "{}" > users.json
)
if exists registered_rooms.json (
	@echo "File ./registered_rooms.json doesn't exist... Creating it."
	echo "{}" > registered_rooms.json
)

:: Booting the server
if "%*" = "1" (
	npm start
)
else (
	if "%1" = "test" (
		npm test
	)
	else (
		node server.js %1
	)
)