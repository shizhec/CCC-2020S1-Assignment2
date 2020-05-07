#!/bin/bash

. ./unimelb-comp90024-2020-grp-12-openrc.sh; ansible-playbook -i hosts -u ubuntu --key-file=~/.ssh/CCC-Nectar-Group.pem update_git_repo.yaml
