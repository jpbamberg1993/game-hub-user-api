#!/bin/sh
env=$1

#Safety Checks

if [ -z "$env" ] || ([ "$env" != "dev" ] && [ "$env" != "int" ])
then
	echo "Please provide arguments: Usage: ./deploy_lambdas.sh [ENV_TO_DEPLOY]"
	echo "Supported environments: dev / int"
	exit 1
fi

echo "Deployment started for environment: " $env

#Creating necessary variables

fileName="env.${env}.json"
sourceLocation="s3://game-hub-secrets/${fileName}"

#Downloading the config file from s3

echo "Downloading from s3: " $sourceLocation
aws s3 cp $sourceLocation $fileName

#Deploying the lambdas via serverless

echo "Deploying Lambdas"
serverless deploy --stage $env
echo "Lambdas deployed"

#Once complete delete configs from local machine

echo "Deleting config file from local"
rm $fileName

echo "Deployment complete for environment: " $env
exit 0
