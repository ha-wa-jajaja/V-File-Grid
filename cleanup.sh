#!/bin/bash

# Fetch all branches from the remote and prune deleted branches
git fetch --all --prune

# Delete local branches that do not exist on the remote, forcing the deletion
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs -r git branch -D

# Prune local references to deleted remote branches
git remote prune origin