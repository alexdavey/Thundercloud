#!/bin/bash

# Change the delimiter to a comma
IFS=$','

# Arguments required for every test
args=("../js/lib/require.js" "../js/lib/underscore.js" "../js/utility.js")

# Run the test with the new arguments, concatenating
# them with a comma and prepending the js_files flag
exec gjstest "--js_files=${args[*]},$*"

# Reset the delimiter for safety
unset IFS
