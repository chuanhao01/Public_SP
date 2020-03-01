-- MySQL dump 10.13  Distrib 5.7.28, for Linux (x86_64)
--
-- Host: localhost    Database: BED_CA1_Assignment
-- ------------------------------------------------------
-- Server version	5.7.28-0ubuntu0.18.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `COMMENTS`
--

DROP TABLE IF EXISTS `COMMENTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `COMMENTS` (
  `listing_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `comment` varchar(500) NOT NULL,
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` int(1) NOT NULL,
  PRIMARY KEY (`listing_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `COMMENTS_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `LISTINGS` (`listing_id`),
  CONSTRAINT `COMMENTS_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COMMENTS`
--

LOCK TABLES `COMMENTS` WRITE;
/*!40000 ALTER TABLE `COMMENTS` DISABLE KEYS */;
/*!40000 ALTER TABLE `COMMENTS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FAVOURITES`
--

DROP TABLE IF EXISTS `FAVOURITES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FAVOURITES` (
  `listing_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` int(1) NOT NULL,
  PRIMARY KEY (`listing_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `FAVOURITES_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `LISTINGS` (`listing_id`),
  CONSTRAINT `FAVOURITES_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FAVOURITES`
--

LOCK TABLES `FAVOURITES` WRITE;
/*!40000 ALTER TABLE `FAVOURITES` DISABLE KEYS */;
/*!40000 ALTER TABLE `FAVOURITES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LIKES`
--

DROP TABLE IF EXISTS `LIKES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LIKES` (
  `like_id` varchar(255) NOT NULL,
  `listing_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` int(1) NOT NULL,
  PRIMARY KEY (`like_id`),
  KEY `listing_id` (`listing_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `LIKES_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `LISTINGS` (`listing_id`),
  CONSTRAINT `LIKES_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LIKES`
--

LOCK TABLES `LIKES` WRITE;
/*!40000 ALTER TABLE `LIKES` DISABLE KEYS */;
INSERT INTO `LIKES` VALUES ('21102c51-a13f-4870-865d-cb6874cfefd4','5864261d-1f61-48ba-8f05-9df328206821','6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2020-01-02 02:21:44','2020-01-02 02:21:44',0),('2deb577a-c022-4bd5-95ac-e201f2c7e2a9','3e197ec6-e519-4bcb-aad2-ead05a3a9342','79adf7fa-82e3-4f51-957c-971de438ed0a','2019-12-30 07:17:58','2019-12-30 07:18:14',1),('3c0fa5b4-4421-4828-a99c-2067de4de8f8','3e197ec6-e519-4bcb-aad2-ead05a3a9342','6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2019-12-29 10:48:16','2019-12-30 05:40:43',1),('628d601a-df4f-4470-a871-885bc129ab3c','3e197ec6-e519-4bcb-aad2-ead05a3a9342','78848f75-7265-4152-a06c-4d714956cbbf','2019-12-27 09:45:07','2019-12-30 06:41:33',1),('6dc3fcd2-4a78-46aa-b46d-dc080fc5d140','3e197ec6-e519-4bcb-aad2-ead05a3a9342','6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2019-12-29 10:32:13','2019-12-29 10:48:15',1),('712248bf-62ef-4ba6-92ef-1d3b6b0e241b','3e197ec6-e519-4bcb-aad2-ead05a3a9342','b8ebfe27-b5bc-4081-b166-8d4ec166c9bc','2019-12-27 09:45:24','2019-12-30 06:41:33',1),('86cb6ea2-9b30-4241-8bd1-ae7b020b5994','3e197ec6-e519-4bcb-aad2-ead05a3a9342','6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2019-12-27 09:25:33','2019-12-29 10:32:11',1),('99f16848-e2f9-4f28-b216-e92c924b7a71','3e197ec6-e519-4bcb-aad2-ead05a3a9342','6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2019-12-27 09:24:48','2019-12-27 09:24:54',1),('b3a7ab29-6ca5-49b3-ae18-3aea8f4c406f','b091f090-e232-49c2-bb39-42b16fde01b6','6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2019-12-29 10:32:03','2019-12-29 10:32:04',1),('f5bc55a3-7109-441f-9df6-7f1e55c05bee','3e197ec6-e519-4bcb-aad2-ead05a3a9342','6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2019-12-30 05:40:52','2019-12-30 06:41:33',1),('f68080c3-37b8-42e9-94e7-b31e4d3f040a','b091f090-e232-49c2-bb39-42b16fde01b6','6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2019-12-30 06:01:54','2019-12-30 06:01:54',0);
/*!40000 ALTER TABLE `LIKES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LISTINGS`
--

DROP TABLE IF EXISTS `LISTINGS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LISTINGS` (
  `listing_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `listing_user_id` varchar(255) NOT NULL,
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `availability` int(1) DEFAULT NULL,
  `last_modified_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` int(1) DEFAULT NULL,
  PRIMARY KEY (`listing_id`),
  KEY `listing_user_id` (`listing_user_id`),
  CONSTRAINT `LISTINGS_ibfk_1` FOREIGN KEY (`listing_user_id`) REFERENCES `USERS` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LISTINGS`
--

LOCK TABLES `LISTINGS` WRITE;
/*!40000 ALTER TABLE `LISTINGS` DISABLE KEYS */;
INSERT INTO `LISTINGS` VALUES ('1f992240-a698-4e6b-8a02-f402a9d22077','new','new',13.00,'11a19fdb-2845-4dbd-9c29-c010b2aaf162','2019-12-31 08:42:48',0,'2019-12-31 08:42:48',0),('20ec2e4d-1c6b-49bb-bcf9-72436390d72e','temp','temp',13.00,'6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2019-12-29 10:30:30',0,'2019-12-29 10:31:14',1),('3e197ec6-e519-4bcb-aad2-ead05a3a9342','changed','changed',10.00,'79adf7fa-82e3-4f51-957c-971de438ed0a','2019-12-21 11:57:44',0,'2019-12-30 06:42:37',1),('5864261d-1f61-48ba-8f05-9df328206821','bed','bed',81.11,'79adf7fa-82e3-4f51-957c-971de438ed0a','2019-12-31 07:34:42',0,'2019-12-31 07:34:42',0),('5e0cd6de-2a2d-4c1e-bed4-c82b3dd5d148','abc 2','abc 2',90.00,'6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2019-12-23 03:13:58',0,'2019-12-23 03:14:08',0),('8b36fcf7-28e7-4afd-b486-19694bcf81dc','new','new',11.00,'11a19fdb-2845-4dbd-9c29-c010b2aaf162','2019-12-31 08:15:01',0,'2019-12-31 08:42:35',1),('b091f090-e232-49c2-bb39-42b16fde01b6','bac','this is from bac',12.00,'78848f75-7265-4152-a06c-4d714956cbbf','2019-12-27 07:31:09',0,'2019-12-27 07:31:09',0),('ea9c8602-d716-4061-9620-240e018283d1','abc','abc',11.00,'6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2019-12-22 08:49:22',0,'2019-12-22 11:41:13',0),('ea9cbe48-4af1-4720-975a-b118b117badb','i am abc 2','i am abc 2',11.00,'6f51a60c-67b6-42e5-bfb7-4f9fe626d451','2019-12-22 08:51:57',0,'2019-12-22 10:20:58',1);
/*!40000 ALTER TABLE `LISTINGS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LISTING_PICTURES`
--

DROP TABLE IF EXISTS `LISTING_PICTURES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LISTING_PICTURES` (
  `listing_id` varchar(255) NOT NULL,
  `listing_picture_file_name` varchar(255) NOT NULL,
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` int(1) NOT NULL,
  PRIMARY KEY (`listing_id`,`listing_picture_file_name`),
  CONSTRAINT `LISTING_PICTURES_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `LISTINGS` (`listing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LISTING_PICTURES`
--

LOCK TABLES `LISTING_PICTURES` WRITE;
/*!40000 ALTER TABLE `LISTING_PICTURES` DISABLE KEYS */;
INSERT INTO `LISTING_PICTURES` VALUES ('1f992240-a698-4e6b-8a02-f402a9d22077','68cc1ed8352705b954b33478335097ce','2019-12-31 08:42:59','2019-12-31 08:42:59',0),('3e197ec6-e519-4bcb-aad2-ead05a3a9342','bb96a0d4419f35593daa4f5639edfcaf','2019-12-30 05:32:24','2019-12-30 06:42:37',1),('5864261d-1f61-48ba-8f05-9df328206821','7d486b34f99e4b74fe7d9fcfb5968b7d','2019-12-31 07:38:44','2019-12-31 07:38:44',0),('8b36fcf7-28e7-4afd-b486-19694bcf81dc','aaea03e702791c17a2369db3b2fd7055','2019-12-31 08:42:32','2019-12-31 08:42:35',1),('ea9c8602-d716-4061-9620-240e018283d1','d13f459e9604ce058e307c38f9507916','2019-12-30 04:46:56','2019-12-30 04:46:56',0);
/*!40000 ALTER TABLE `LISTING_PICTURES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OFFERS`
--

DROP TABLE IF EXISTS `OFFERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OFFERS` (
  `offer_id` varchar(255) NOT NULL,
  `listing_id` varchar(255) NOT NULL,
  `offer_user_id` varchar(255) NOT NULL,
  `offer_price` decimal(12,2) NOT NULL,
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(1) NOT NULL,
  `last_modified_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` int(1) NOT NULL,
  PRIMARY KEY (`offer_id`),
  KEY `listing_id` (`listing_id`),
  KEY `offer_user_id` (`offer_user_id`),
  CONSTRAINT `OFFERS_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `LISTINGS` (`listing_id`),
  CONSTRAINT `OFFERS_ibfk_2` FOREIGN KEY (`offer_user_id`) REFERENCES `USERS` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OFFERS`
--

LOCK TABLES `OFFERS` WRITE;
/*!40000 ALTER TABLE `OFFERS` DISABLE KEYS */;
INSERT INTO `OFFERS` VALUES ('4cd01629-72f7-43cf-8fa2-07d8b6e00299','3e197ec6-e519-4bcb-aad2-ead05a3a9342','6f51a60c-67b6-42e5-bfb7-4f9fe626d451',9.00,'2019-12-23 03:49:21',0,'2019-12-27 07:43:27',1),('8967e258-8b04-412d-a7ee-ea41bdff7d49','b091f090-e232-49c2-bb39-42b16fde01b6','6f51a60c-67b6-42e5-bfb7-4f9fe626d451',13.00,'2019-12-30 07:15:47',0,'2019-12-30 07:15:47',0),('c6e54e1f-21e7-4527-a94a-635eff043898','3e197ec6-e519-4bcb-aad2-ead05a3a9342','79adf7fa-82e3-4f51-957c-971de438ed0a',22.00,'2019-12-23 07:35:44',0,'2019-12-30 06:42:37',1),('d422f521-0485-4f3f-877b-19284035ad77','3e197ec6-e519-4bcb-aad2-ead05a3a9342','6f51a60c-67b6-42e5-bfb7-4f9fe626d451',12.00,'2019-12-27 07:46:14',0,'2019-12-27 07:56:55',1),('f7646b2e-4503-44dc-8f78-c2c9b7fc922a','3e197ec6-e519-4bcb-aad2-ead05a3a9342','6f51a60c-67b6-42e5-bfb7-4f9fe626d451',12.00,'2019-12-27 07:44:19',0,'2019-12-27 07:46:06',1);
/*!40000 ALTER TABLE `OFFERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USERS`
--

DROP TABLE IF EXISTS `USERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USERS` (
  `user_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar_icon_file_name` varchar(255) NOT NULL,
  `refresh_token` varchar(800) NOT NULL,
  `created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` int(1) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USERS`
--

LOCK TABLES `USERS` WRITE;
/*!40000 ALTER TABLE `USERS` DISABLE KEYS */;
INSERT INTO `USERS` VALUES ('11a19fdb-2845-4dbd-9c29-c010b2aaf162','new','$2b$13$UaKIbxN2/42FKwiZrPCBRuSh9t7blp2T/1gmDNP3hRaIKnweSbLJy','f46c7e8ae5cbab3900ec7ccab08bba8f','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSZXN1bHQiOiJUaGlzIGlzIGEgcmVmcmVzaCB0b2tlbiIsImlhdCI6MTU3Nzc3OTk5OX0.Gq-_96RnGl3rUTGo93Gge0wOYEDlX_ToHgJVZjjvIFI','2019-12-31 08:13:19',0),('6f51a60c-67b6-42e5-bfb7-4f9fe626d451','abc','$2b$13$nHfnPVsUmuDFyuLYd29juuhMUhsgUPeUUZTj.BxnQ9VH1M.ei/g4O','7cd1528bbb367b97ac6009a43ae88575','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSZXN1bHQiOiJUaGlzIGlzIGEgcmVmcmVzaCB0b2tlbiIsImlhdCI6MTU3NjU4Mjk0OH0.pz_ttaCqyFpxWlzI2_NNii3Wuyomr2_LpO1aYIIJTuI','2019-12-17 11:42:28',0),('78848f75-7265-4152-a06c-4d714956cbbf','bac','$2b$13$OLraZIiX45590MGbSAsnNe5EkNltzncyT08YWPO2tpFiLZpBjcWyy','5aef16a12c371aa4c30daf0f6f8bbf12','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSZXN1bHQiOiJUaGlzIGlzIGEgcmVmcmVzaCB0b2tlbiIsImlhdCI6MTU3NjY1MDY1OH0.v0_DiN2X6S6fF_0GeLjkCDv2kPHlgPmOoYCpm0dfBvQ','2019-12-18 06:30:58',0),('79adf7fa-82e3-4f51-957c-971de438ed0a','bed','$2b$13$fpPZb6nV4RUVbGaom6cR1OgZrxdQ3QwUsw1jKZNhorsU7cVUarfBi','d01a2275153b905739775aa285b23bd7','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSZXN1bHQiOiJUaGlzIGlzIGEgcmVmcmVzaCB0b2tlbiIsImlhdCI6MTU3NjgxMTAyNX0.DvyDbWnreTqGCH9GjlkR3S1PbTRIzJuRQofuTplqToI','2019-12-20 03:03:45',0),('b8ebfe27-b5bc-4081-b166-8d4ec166c9bc','asd','$2b$13$OBX9kxiwk.U.7Y9uQTNkAujpFxKdzRRybFegdOp2mBEvWehw9N1uq','00cea62de3e0b1978d876a24f3a3dbfc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSZXN1bHQiOiJUaGlzIGlzIGEgcmVmcmVzaCB0b2tlbiIsImlhdCI6MTU3NjkyMTA1OX0.rY_s8ZJkz9KkhXohl9VbI8C0HuzGp262G3QvXyw1oOY','2019-12-21 09:37:39',0);
/*!40000 ALTER TABLE `USERS` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-01-02 13:14:27
