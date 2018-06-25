#!/bin/sh

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]
then
    if [ "$TRAVIS_BRANCH" == "staging" ] || \
        [ "$TRAVIS_BRANCH" == "production" ]
    then 
        curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
        
        unzip awscli-bundle.zip
        ./awscli-bundle/install -b ~/bin/aws
        export PATH=~/bin:$PATH
        eval $(aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID)
        eval $(aws configure set aws_secret_key_id $AWS_SECRET_ACCESS_KEY)
        eval $(aws ecr get-login --region us-east-2 --no-include-email)
        export TAG=$TRAVIS_BRANCH
        export REPO=$AWS_ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com
    fi

    if [ "$TRAVIS_BRANCH" == "staging" ]
    then
        export REACT_APP_USERS_SERVICE_URL="http://expense-tracker-staging-alb-2128905637.us-east-2.elb.amazonaws.com"
    fi  

    if [ "$TRAVIS_BRANCH" == "staging" ] || \
       [ "$TRAVIS_BRANCH" == "production" ] 
    then
        #users
        docker build $USERS_REPO -t $USERS:$COMMIT -f Dockerfile-$DOCKER_ENV
        docker tag $USERS:$COMMIT $REPO/$USERS:$TAG
        docker push $REPO/$USERS:$TAG
        #users_db
        docker build $USERS_DB_REPO -t $USERS_DB:$COMMIT -f Dockerfile
        docker tag $USERS_DB:$COMMIT $REPO/$USERS_DB:$TAG
        docker push $REPO/$USERS_DB:$TAG
        #client
        docker build $CLIENT_REPO -t $CLIENT:$COMMIT -f Dockerfile-$DOCKER_ENV --build-arg REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL
        docker tag $CLIENT:$COMMIT $REPO/$CLIENT:$TAG
        docker push $REPO/$CLIENT:$TAG
        #swagger
        docker build $SWAGGER_REPO -t $SWAGGER:$COMMIT -f Dockerfile-$DOCKER_ENV $SWAGGER_DIR
        docker tag $SWAGGER:$COMMIT $REPO/$SWAGGER:$TAG
        docker push $REPO/$SWAGGER:$TAG
    fi
fi

  