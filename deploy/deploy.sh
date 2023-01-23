#!/bin/bash

mkdir ./tmp

# Write to temporary file
echo -e "
# Please enter the deploy message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the deploy
#
# This message will be used as a custom commit message for the
# 'deploy' command, which builds and deploys this app to gh-pages.
#
# https://github.com/gitname/react-gh-pages#7-push-the-react-app-to-the-github-repository
#" > ./tmp/DEPLOY_EDITMSG.md

# In case I'd like to switch editors
DEFAULT_EDITOR=/usr/bin/nano
$DEFAULT_EDITOR ./tmp/DEPLOY_EDITMSG.md

# Get all the written content
modified_content=`grep -v '^#' ./tmp/DEPLOY_EDITMSG.md`

# We'll remove the entire temporary directory, I see no need for it
rm -rf ./tmp

# Exit if the deploy message is empty
if [ ! -n "$modified_content" ]; then
    echo -e "\nAborting deploy due to empty deploy message."
    exit 0
fi

npm run deploy -- -m $modified_content