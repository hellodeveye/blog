FROM openjdk:11

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV TZ=Asia/Shanghai
ENV apollo.meta http://192.168.3.183:8080
ENV APOLLO_LABEL XianDevLabel
WORKDIR /

EXPOSE 8080

ADD {{JOB_NAME}}.jar /{{JOB_NAME}}.jar

CMD ["java","-Dapollo.label=XianDevLabel","-Djava.security.egd=file:/dev/./urandom","-jar","{{JOB_NAME}}.jar"]
