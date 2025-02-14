-- Active: 1739513174980@@127.0.0.1@3306@newleaf
#데이터베이스 생성
CREATE DATABASE Kopuragi DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;

#계정명 및 비밀번호 설정
CREATE USER 'shikshokk'@'%' IDENTIFIED BY '4321';

#계정 사용하기
USE 'shikshokk';

#계정에게 권한 부여
GRANT ALL PRIVILEGES ON *.* TO 'shikshokk'@'%' WITH GRANT OPTION;

#계정이 제대로 생성되었는지 확인
SHOW DATABASES;
USE mysql;
SELECT * FROM user;

#??
FLUSH PRIVILEGES;
#테이블 조회
SHOW TABLES;