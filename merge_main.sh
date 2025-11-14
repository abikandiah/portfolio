#!/bin/bash


check_prereqs() {
	if [[ -n $(git status --porcelain --untracked-files=no) ]]; then
		echo "Current branch has uncommitted files."
		echo
		git status
		return 1;
	else
		return 0;
	fi
}


# Call the function and check its exit status
check_prereqs
if [ $? -ne 0 ]; then
  echo "Quitting script due to missing prerequisites."
  exit 1
fi


current_branch=$(git rev-parse --abbrev-ref HEAD)
echo Merging $current_branch into main

git checkout main
git merge $current_branch
git push
git checkout $current_branch




