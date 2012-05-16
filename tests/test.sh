#!/bin/bash

# Change the delimiter to a comma
IFS=$','

# Arguments required for every test
args=("../src/lib/require.js"
	  "../src/lib/underscore.js"
	  "../src/utility.js"
	  "test.js")

dependencies=()

function contains {
	for i in $0
	do
		if i == $1
			then return true
		fi
	done

	return false
}

function addDependencies {
	# Get the dependencies of the file using sed,
	# 'require(['trie', 'canvas', 'test'], function...' becomes
	# 'trie,canvas,test' and is then split at the comma
	dependencies=$0 | sed 's/require(\[\(.*\)\].*/\1/' | sed s/\'//g | sed 's/ *\, */,/g' # TODO: split at comma! + global recursive search

	# Add all of the dependencies
	for j in dependencies
	do
		# Only add the dependency if it has not already been added
		if ! contains dependencies j
			then

			# Add the dependencies of that file
			addDependencies j

			# Add name of dependencies to list of loaded dependencies
			$dependencies=(${dependencies[@]} ${j})

			echo "Adding ../src/${j}.js as a dependency"

			# Add that file
			args=(${args[@]} "../src/${j}.js")

		fi
	done
}

# Loop over all of the arguments to the test script
for i in $*
do
	addDependencies i

	# Add the source file itself and the test file
	args=("${args[@]}" "../src/${i}.js" "${i}.js")
done


# Run the test with the new arguments, concatenating
# them with a comma and prepending the js_files flag
exec gjstest "--js_files=${args[*]}"

# Reset the delimiter for safety
unset IFS
