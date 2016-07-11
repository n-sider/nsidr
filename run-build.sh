#!/bin/bash

npm run teststack

RESULT=$?

if [ $RESULT == 0 ]; then
  echo "publish coverage for $DRONE_COMMIT"
  curl -F coverage=@coverage/net/lcov.info "https://cvr.vokal.io/coverage?owner=$REPO_OWNER&repo=$REPO_NAME&commit=$DRONE_COMMIT&coveragetype=lcov"
else
  curl -X POST "https://cvr.vokal.io/coverage/abort?owner=$REPO_OWNER&repo=$REPO_NAME&commit=$DRONE_COMMIT"
fi

exit $RESULT
