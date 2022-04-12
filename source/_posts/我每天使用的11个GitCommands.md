---
title: 我每天使用的11个Git Commands
date: 2022-04-12 18:21:19
tags: Git
categories: Git
---
> 本文是为我的年轻人（或任何新手）准备的，他们可以有效地使用git命令行，并简要介绍了我如何使用这些命令。
> https://medium.com/@mmpatil34/11-git-commands-i-use-daily-9bbd7590c8eb

### 1. git fetch origin
Pulls all the branches/tags from the repository specified. Here the repository is “origin”. More info
The command to start the day with, as it brings the local and the remote repository in the same state to start development.
### 2. git status
Displays the current branch, the files changed since the previous commit also specifies how far the branch is from its source branch. More info
Before switching the branches/creating a new branch/making new changes/or pulling changes, this command comes in handy to check if any files need to be stashed.
### 3. git checkout
git checkout -b <new branch name> origin/<source branch name>
To create a new branch from a particular source branch. Here “origin” is the default repository. More info
git checkout — — <name of the file>
When there are local changes made to a file, this command will help discard the current changes thus restoring the original state for the file.
git checkout <branch name>
Check out the particular branch in the local project.
### 4. git pull origin <branch name>
Pulls the changes from the remote branch to the local branch and calls git merge, if the changes are compatible. More info
The difference here between git pull & git fetch is, that git pull will internally call git fetch and also merge the changes with the local if they are compatible.
### 5. git add <name of the file>
Once the changes to a few files are done, the git add command can be used to add the files to a particular commit you want to make. More info
Now, the git status command can be used very conveniently to get the names of the files to add to the commit
### 6. git commit
git commit -m “<message relevant to the commit>”
To add the local changes to a commit with a meaningful message specifying the contents of the commit. More info
### 7. git push origin <branch name>
Publish the local commits to the remote repository. Here the repository is “origin”. More info
### 8. git cherry-pick
To cherry-pick individual commits/merge commits. More info
git cherry-pick <commit_id>
To cherry-pick a commit using the commit hash
git cherry-pick -m 1 <commit_id>
To cherry-pick a merge commit, the -m option is to specify the parent of the mainline, starting from 1.
### 9. git revert <commit id>
Introduce a new commit to revert a pushed commit with the specified commit hash. More info
### 10. git reset — soft HEAD~1
Undo 1 local commit without losing the changes in the files. More info
### 11. git reset — hard HEAD~1
Undo a local commit and discard the changes in the files. More info
Hope this helps. Thank you for reading😁
