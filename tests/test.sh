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
	dependencyDoesNotExist=true
	for i in $1
	do
		echo "1: ${1}"
		echo "2: ${2}"
		if "$i" = $2
			then dependencyDoesNotExist=false
		fi
	done
}

function addDependencies {
	# Get the dependencies of the file using sed,
	# 'require(['trie', 'canvas', 'test'], function...' becomes
	# 'trie,canvas,test' and is then split at the comma
	# TODO: split at comma! + global recursive search
	dependencies=exec sed 's/(require|define)(\[\(.*\)\].*/\1/' "$1" | sed s/\'//g | sed 's/ *\, */,/g' 

	# echo "1:: ${1}"
	echo "dependencies:: ${dependencies}"

	# Add all of the dependencies
	for j in $dependencies
	do
		# Only add the dependency if it has not already been added
		echo "$dependencies"
		contains $dependencies $j
		if $dependencyDoesNotExist
			then

			# Add the dependencies of that file
			addDependencies j

			# Add name of dependencies to list of loaded dependencies
			dependencies=("${dependencies[@]}" "${j}")

			echo "Adding ../src/${j}.js as a dependency"

			# Add that file
			args=(${args[@]} "../src/${j}.js")

		fi
	done
}

# Loop over all of the arguments to the test script
for i in $*
do
	# addDependencies "../src/${i}.js"
	addDependencies "${i}.js"

	# Add the source file itself and the test file
	args=("${args[@]}" "../src/${i}.js" "${i}.js")
done


# Run the test with the new arguments, concatenating
# them with a comma and prepending the js_files flag
exec gjstest "--js_files=${args[*]}"

# Reset the delimiter for safety
unset IFS
