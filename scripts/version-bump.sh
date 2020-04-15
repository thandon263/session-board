#!/bin/bash
echo "Welcome to Version BUMP";

if [ "$1" = "BUMP-PUSH-TAGS" ]; then
  git push origin master --follow-tags &&
  exit 0;
fi

currentbranch=$(git rev-parse --abbrev-ref HEAD);
if [ "$currentbranch" = "master" ]; then
  lastcommitmsg=$(git log -1 --pretty=%B);
  echo "Last commit was: $lastcommitmsg";
  if [[ ! "$lastcommitmsg" == "[bump]"* ]]; then
    echo "Commiting to Master branch, patching version number";
    npm version patch -m "[bump] Version bumped to %s";
  else
    echo "Not bumping version on master. Last commit was $lastcommitmsg";
  fi
else
  echo "Commiting to $currentbranch branch. Not master, version number unchanged";
  currentversion=$(cat package.json | grep '"version":');
  echo "$currentversion";
fi
exit 0;