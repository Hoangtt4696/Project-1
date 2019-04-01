#!/bin/bash
eval $(ssh-agent -s)
ssh-add <(echo "$PRODUCTION_HOST_SSH")

ssh $PRODUCTION_HOST "\
source /etc/profile && docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN $CONTAINER \
&& cd /srv/danhgia360 && docker-compose pull \
&& docker-compose up -d \
&& docker logout $CONTAINER" < /dev/null

ssh-add -D
