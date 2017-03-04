#!/bin/sh

# Written By: Calvin Echols
# 12/19/2016

# CNNGO Samsung TV build script
# Application Id = "YTYu2KsmD0.CNNgo"

# Dependencies: Tizen CLI, 

# Command used to generate Jenkins Tizen Certificate.
# tizen certificate -a devalias -p password -c US -s GA -ct ATL -o Turner -u CNNGO -u Calvin -e calvin.echols@turner.com -f jenkins_build_certificate

# Command to create the Tizen Security Profile on Jenkins server where I created some environment variables.
# FYI $TIZEN_JENKINS_CERT is the absolute path and the certificate created from the previous command.
# tizen security-profiles add -n development -a $TIZEN_JENKINS_CERT -p password

# Configure Tizen CLI
# tizen cli-config "profiles.path=/Users/logs/tizen-sdk-data/ide/keystore/profiles.xml"

echo "Starting CNNGO Samsung TV Build Script"

echo "Changing Directory to app directory."
#cd ../cnngo-app
cd $WORKSPACE/cnngo-app

echo "Cleaning the project."
tizen clean

echo "Building the project."
tizen build-web -opt

echo "Package the app for QA deployment."
tizen package -t wgt -s development -- $WORKSPACE/cnngo-app/.buildResult

#echo "Deploying the app to device."
#tizen install  -t ? -n CNNgo.wgt -- $WORKSPACE/cnngo-app/.buildResult