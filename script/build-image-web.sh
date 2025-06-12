#!/bin/bash

if [ "${BUILD_DIR}" == "" ];then
    echo "env 'BUILD_DIR' is not set"
    exit 1
fi

DOCKER_DIR=${BUILD_DIR}/${JOB_NAME}

if [ ! -d ${DOCKER_DIR} ];then
    mkdir -p ${DOCKER_DIR}
fi

echo "docker workspace: ${DOCKER_DIR}"

JENKINS_DIR=${WORKSPACE}/${MODULE}

echo "jenkins workspace: ${JENKINS_DIR}"

PROJECT_DIR=${JENKINS_DIR}${JOB_NAME}-web

echo "project workspace: ${PROJECT_DIR}"


if [ ! -f ${PROJECT_DIR}/target/*.jar ];then
    echo "target jar file not found ${PROJECT_DIR}/target/*.jar"
    exit 1
fi

cd ${DOCKER_DIR}
rm -fr *.jar Dockerfile

DOCKER_FILE=/opt/script/Dockerfile

cp ${PROJECT_DIR}/target/*.jar .
cp ${DOCKER_FILE} .

sed -i "s,{{JOB_NAME}},${JOB_NAME},g" Dockerfile

VERSION=$(date +%Y%m%d%H%M%S)

IMAGE_NAME=harbor.merchant.com/kubernetes/${JOB_NAME}:${VERSION}

echo "${IMAGE_NAME}" > ${WORKSPACE}/IMAGE

echo "building image: ${IMAGE_NAME}"
docker build -t ${IMAGE_NAME} .

docker push ${IMAGE_NAME}

helm list -n default
helm upgrade ${JOB_NAME} --set name=${JOB_NAME} --set version=$VERSION --set httpPorts=8080  -n default  /opt/charts/
