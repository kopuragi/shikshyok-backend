
-- Active: 1732688612707@@127.0.0.1@3306@kopuragi-- Active: 1739513174980@@127.0.0.1@3306@kopuragi-- Active: 1732688612707@@127.0.0.1@3306@kopuragi-- Active: 1739513174980@@127.0.0.1@3306@kopuragi
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

INSERT INTO orderedMenu (menuName, price, totalPrice, visitTime, shop_order_id) VALUES
('김치찌개', '8000', '16000', '2025-01-10', 1),
('김치찌개', '8000', '16000', '2025-01-10', 1),
('김치찌개', '8000', '16000', '2025-01-10', 1),
('김치찌개', '8000', '16000', '2025-01-10', 1),
('불고기', '8000', '16000', '2025-01-10', 2),
('불고기', '8000', '16000', '2025-01-10', 2),
('불고기', '8000', '16000', '2025-01-10', 2),
('불고기', '12000', '24000', '2025-01-22', 3),
('불고기', '12000', '24000', '2025-01-22', 3),
('불고기', '12000', '24000', '2025-01-22', 3),
('불고기', '12000', '24000', '2025-01-22', 3),
('제육볶음', '9000', '18000', '2025-02-05', 4),
('된장찌개', '7000', '14000', '2025-02-14', 5),
('갈비찜', '15000', '30000', '2025-02-28', 6),
('비빔밥', '7000', '14000', '2025-03-02', 7),
('닭갈비', '10000', '20000', '2025-03-10', 8),
('떡볶이', '4000', '8000', '2025-03-15', 9),
('라면', '3000', '6000', '2025-03-20', 10),
('삼겹살', '13000', '26000', '2025-03-25', 1);




INSERT INTO orderedVisitor (user_id, visitors, isTakeout, visitTime, shop_order_id) VALUES
('user1', 2, TRUE, '2025-01-25', 1),
('user1', 2, TRUE, '2025-01-25', 1),
('user1', 2, TRUE, '2025-01-26', 2),
('user1', 2, TRUE, '2025-01-27', 2),
('user2', 4, FALSE, '2025-01-25', 3),
('user2', 4, FALSE, '2025-01-26', 3),
('user2', 4, FALSE, '2025-01-27', 3),
('user3', 3, TRUE, '2025-02-10', 4),
('user4', 3, TRUE, '2025-02-10', 4),
('user5', 3, TRUE, '2025-02-10', 5),
('user3', 5, FALSE, '2025-02-25', 6),
('user2', 2, TRUE, '2025-03-05', 7),
('user4', 1, FALSE, '2025-03-12', 8),
('user3', 4, TRUE, '2025-01-30', 9),
('user5', 3, FALSE, '2025-02-18', 10),
('user1', 2, TRUE, '2025-03-28', 11),
('user4', 5, FALSE, '2025-01-08', 12),
('user10', 5, FALSE, '2025-01-08', 13);




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

DROP TABLE menufile;
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

-- 더미 데이터 삽입
INSERT INTO `order` (cus_order_id, shop_order_id, user_id, menuName, price, totalPrice, visitors, isTakeout, orderTime, `option`, progress, visitTime) VALUES
(1, 101, 'user01', '치킨', '15000', '45000', 3, 0, '2025-02-27 12:30:00', '추가 치즈', '수락', '2025-02-28'),
(2, 102, 'user02', '피자', '12000', '12000', 1, 1, '2025-02-27 13:00:00', '매운맛', '진행 중', '2025-02-28'),
(3, 103, 'user03', '햄버거', '20000', '60000', 3, 0, '2025-02-27 14:15:00', '사이드 감자 추가', '완료', '2025-02-28'),
(4, 104, 'user04', '돈까스', '18000', '36000', 2, 1, '2025-02-27 15:45:00', '콜라 추가', '거절', '2025-02-28'),
(5, 105, 'user05', '떡볶이', '25000', '50000', 2, 0, '2025-02-27 17:10:00', '치즈볼 추가', '수락', '2025-02-28'),
(6, 106, 'user06', '김밥', '17000', '34000', 2, 1, '2025-02-27 18:20:00', '고구마 피자 변경', '진행 중', '2025-02-28'),
(7, 107, 'user07', '칼국수', '13000', '26000', 2, 0, '2025-02-27 19:05:00', '추가 소스', '완료', '2025-02-28'),
(8, 108, 'user08', '라면', '14000', '28000', 2, 1, '2025-02-27 20:30:00', '사이드 샐러드 추가', '거절', '2025-02-28');

