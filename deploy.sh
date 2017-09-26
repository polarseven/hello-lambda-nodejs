#!/bin/bash
aws cloudformation package --template-file template.yaml --s3-bucket net.leanstacks.lambda --output-template-file ./dist/packaged-template.yaml
aws cloudformation deploy --template-file ./dist/packaged-template.yaml --stack-name HelloLambda --capabilities CAPABILITY_IAM
