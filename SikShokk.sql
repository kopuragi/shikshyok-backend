
-- Active: 1739513174980@@127.0.0.1@3306@kopuragi
#데이터베이스 생성
CREATE DATABASE Kopuragi DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;

#계정명 및 비밀번호 설정
CREATE USER 'shikshokk'@'%' IDENTIFIED BY '4321';

#계정 사용하기//////
USE Kopuragi;

#계정에게 권한 부여
GRANT ALL PRIVILEGES ON *.* TO 'shikshokk'@'%' WITH GRANT OPTION;

#계정이 제대로 생성되었는지 확인
SHOW DATABASES;
USE kopuragi;





#??
FLUSH PRIVILEGES;
#테이블 조회
SHOW TABLES ;

SELECT * FROM orderedmenu;
SELECT * FROM orderedvisitor;

DELIMITER $$

DROP TABLE orderedmenu;

INSERT INTO orderedMenu (menuName, price, totalPrice, visitTime) VALUES
('김치찌개', '8000', '16000', '2025-01-10 12:30:00'),
('김치찌개', '8000', '16000', '2025-01-10 12:30:00'),
('김치찌개', '8000', '16000', '2025-01-10 12:30:00'),
('김치찌개', '8000', '16000', '2025-01-10 12:30:00'),
('불고기', '8000', '16000', '2025-01-10 12:30:00'),
('불고기', '8000', '16000', '2025-01-10 12:30:00'),
('불고기', '8000', '16000', '2025-01-10 12:30:00'),
('불고기', '12000', '24000', '2025-01-22 14:00:00'),
('불고기', '12000', '24000', '2025-01-22 14:00:00'),
('불고기', '12000', '24000', '2025-01-22 14:00:00'),
('불고기', '12000', '24000', '2025-01-22 14:00:00'),
('제육볶음', '9000', '18000', '2025-02-05 18:15:00'),
('된장찌개', '7000', '14000', '2025-02-14 19:00:00'),
('갈비찜', '15000', '30000', '2025-02-28 10:45:00'),
('비빔밥', '7000', '14000', '2025-03-02 11:30:00'),
('닭갈비', '10000', '20000', '2025-03-10 17:00:00'),
('떡볶이', '4000', '8000', '2025-03-15 13:20:00'),
('라면', '3000', '6000', '2025-03-20 20:00:00'),
('삼겹살', '13000', '26000', '2025-03-25 16:30:00');


INSERT INTO orderedVisitor (user_id, visitors, isTakeout, visitTime) VALUES
('user1', 2, TRUE, '2025-01-15 14:30:00'),
('user2', 4, FALSE, '2025-01-22 18:00:00'),
('user1', 3, TRUE, '2025-02-10 12:15:00'),
('user3', 5, FALSE, '2025-02-25 19:45:00'),
('user2', 2, TRUE, '2025-03-05 16:20:00'),
('user4', 1, FALSE, '2025-03-12 13:10:00'),
('user3', 4, TRUE, '2025-01-30 11:50:00'),
('user5', 3, FALSE, '2025-02-18 17:30:00'),
('user1', 2, TRUE, '2025-03-28 20:00:00'),
('user4', 5, FALSE, '2025-01-08 09:45:00'),
('user10', 5, FALSE, '2025-01-08 09:45:00');


#owner 샘플 데이터
SELECT * FROM owner;
INSERT INTO owner (name, nickname, userid, pw, email, phone, join_date, isDelete, businessNumber, ownerShopname, ownerShopaddress, ownerShoptype) VALUE 
('임진우','지누','jinu0000','aaAA11!!','jinu@naver.com','010-0000-0000', '2025-01-01', false, '1111111111','스타벅스','서울시 도봉구','카페');


#shop 테이블 샘플 데이터
SELECT * FROM shop;
INSERT INTO shop (owner_id, shopName, businessNumber, shopAddress, shopPhone, shopType, shopOwner) VALUES 
(1, '투썸플레이스','1234567890','서울시 도봉구','02-222-2222','카페','이민철');

#menu 테이블 샘플 데이터
SELECT * FROM menu;
DROP TABLE menu;
DROP TABLE menufile;
DESC menu;
#menu 테이블의 내용을 전부 지운다.
TRUNCATE TABLE menu;
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(1, '얼그레이',4000,'시트러스 향이 나는 홍차','차');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(2, '페퍼민트',4000,'시트러스 향이 나는 홍차','차');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(3, '아메리카노',4000,'시트러스 향이 나는 홍차','커피');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(4, '카페라떼',4000,'시트러스 향이 나는 홍차','커피');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(5, '마끼아또',4000,'시트러스 향이 나는 홍차','커피');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(6, '오렌지 주스',4000,'시트러스 향이 나는 홍차','주스');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(7, '딸기주스',4000,'시트러스 향이 나는 홍차','주스');
INSERT INTO menu (shop_menu_id, menuName, price, menudesc, category) VALUES 
(8, '사과주스',4000,'시트러스 향이 나는 홍차','주스');

