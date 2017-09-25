#!/bin/bash
aws s3 cp ./dist/archive.zip s3://net.leanstacks.lambda/hello-lambda-nodejs/
