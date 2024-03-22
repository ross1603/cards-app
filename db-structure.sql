CREATE DATABASE  IF NOT EXISTS `test_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `test_db`;
-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: test_db
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `analytics`
--

DROP TABLE IF EXISTS `analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `card_id` int NOT NULL,
  `vote` tinyint(1) NOT NULL,
  `user_id` int NOT NULL,
  `date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics`
--

LOCK TABLES `analytics` WRITE;
/*!40000 ALTER TABLE `analytics` DISABLE KEYS */;
INSERT INTO `analytics` VALUES (1,534,1,31,'2024-03-15 20:57:28'),(2,535,1,31,'2024-03-15 20:58:49'),(3,534,0,31,'2024-03-15 21:02:32'),(4,534,0,31,'2024-03-15 21:07:05'),(5,538,0,31,'2024-03-15 21:07:44'),(6,539,1,31,'2024-03-15 21:08:50'),(7,560,1,31,'2024-03-15 21:09:08'),(8,558,0,31,'2024-03-15 21:09:14'),(9,534,0,31,'2024-03-15 21:09:32'),(10,536,1,31,'2024-03-15 21:09:36'),(11,550,0,31,'2024-03-15 21:10:37'),(12,550,1,31,'2024-03-15 21:10:43'),(13,554,1,31,'2024-03-15 21:11:42'),(14,544,0,31,'2024-03-15 21:12:01'),(15,545,1,31,'2024-03-15 21:12:03'),(16,546,0,31,'2024-03-15 21:12:04'),(17,544,1,31,'2024-03-15 21:12:05'),(18,545,0,31,'2024-03-15 21:12:07'),(19,560,1,31,'2024-03-15 23:28:19'),(20,560,1,31,'2024-03-15 23:28:34'),(21,558,1,31,'2024-03-15 23:29:07'),(22,560,1,31,'2024-03-15 23:46:58'),(23,560,0,31,'2024-03-15 23:47:02'),(24,560,0,31,'2024-03-15 23:47:35'),(25,559,1,31,'2024-03-15 23:47:37'),(26,560,0,31,'2024-03-15 23:51:25'),(27,559,1,31,'2024-03-15 23:51:28'),(28,557,0,31,'2024-03-15 23:51:30'),(29,555,1,31,'2024-03-15 23:51:33'),(30,554,1,31,'2024-03-15 23:51:35'),(31,552,0,31,'2024-03-15 23:51:37'),(32,550,1,31,'2024-03-15 23:51:39'),(33,548,1,31,'2024-03-15 23:52:59'),(34,547,1,31,'2024-03-15 23:53:01'),(35,543,1,31,'2024-03-15 23:53:31'),(36,544,0,31,'2024-03-15 23:53:33'),(37,545,1,31,'2024-03-15 23:53:34'),(38,546,0,31,'2024-03-15 23:53:36'),(39,544,1,31,'2024-03-15 23:53:37'),(40,545,1,31,'2024-03-15 23:53:39'),(41,546,0,31,'2024-03-15 23:53:40'),(42,560,0,31,'2024-03-16 00:00:11'),(43,559,1,31,'2024-03-16 00:00:13'),(44,558,0,31,'2024-03-16 00:00:14'),(45,560,1,31,'2024-03-16 09:08:15'),(46,559,0,31,'2024-03-16 09:08:18'),(47,558,1,31,'2024-03-16 09:08:45'),(48,557,0,31,'2024-03-16 09:08:48'),(49,548,0,31,'2024-03-16 09:10:33'),(50,549,1,31,'2024-03-16 09:10:35'),(51,548,0,31,'2024-03-16 09:10:38'),(52,559,1,31,'2024-03-16 13:36:34'),(53,558,1,31,'2024-03-16 13:36:38'),(54,556,0,31,'2024-03-16 13:36:42'),(55,550,1,31,'2024-03-16 13:38:15'),(56,550,0,31,'2024-03-16 13:38:17'),(57,550,1,31,'2024-03-16 13:38:18'),(58,540,1,31,'2024-03-16 13:39:23'),(59,538,0,31,'2024-03-16 13:39:27'),(60,544,0,31,'2024-03-16 13:39:31'),(61,560,1,31,'2024-03-16 21:23:25'),(62,558,0,31,'2024-03-16 21:23:27'),(63,558,0,31,'2024-03-16 21:30:25'),(64,558,1,31,'2024-03-16 21:34:11'),(65,557,0,31,'2024-03-16 21:34:14'),(66,555,1,31,'2024-03-16 21:34:17'),(67,550,0,31,'2024-03-17 12:08:10'),(68,550,1,31,'2024-03-17 12:08:12'),(69,556,0,31,'2024-03-17 13:41:39'),(70,542,1,31,'2024-03-17 21:47:19'),(71,541,0,31,'2024-03-17 21:47:22'),(72,542,1,31,'2024-03-17 21:47:24'),(73,541,1,31,'2024-03-17 21:47:26'),(74,542,1,31,'2024-03-17 21:47:31'),(75,541,0,31,'2024-03-17 21:47:34'),(76,560,1,31,'2024-03-17 21:47:52'),(77,559,1,31,'2024-03-17 21:48:00'),(78,558,1,31,'2024-03-17 21:48:32'),(79,557,0,31,'2024-03-17 21:48:40'),(80,560,1,31,'2024-03-17 21:49:07'),(81,560,0,31,'2024-03-17 21:49:18'),(82,560,0,41,'2024-03-17 21:51:00'),(83,559,1,41,'2024-03-17 21:51:09'),(84,559,1,41,'2024-03-17 21:54:29'),(85,558,0,41,'2024-03-17 21:54:31'),(86,557,1,41,'2024-03-17 21:54:33'),(87,556,0,41,'2024-03-17 21:54:34'),(88,560,1,31,'2024-03-17 21:57:23'),(89,559,0,31,'2024-03-17 21:57:25'),(90,554,0,31,'2024-03-17 21:57:33'),(91,544,1,31,'2024-03-17 22:00:56'),(92,548,1,31,'2024-03-18 11:53:43'),(93,549,0,31,'2024-03-18 11:53:45'),(94,543,0,31,'2024-03-18 12:45:03'),(95,544,1,31,'2024-03-18 12:45:04'),(96,545,1,31,'2024-03-18 12:45:05'),(97,554,0,31,'2024-03-18 13:43:59'),(98,550,0,31,'2024-03-18 14:07:35'),(99,550,1,31,'2024-03-18 14:07:37'),(100,560,1,31,'2024-03-18 21:12:37'),(101,559,0,31,'2024-03-18 21:12:40'),(102,558,1,31,'2024-03-18 21:12:43'),(103,550,1,31,'2024-03-20 09:42:48'),(104,543,1,31,'2024-03-20 09:44:24'),(105,560,1,31,'2024-03-20 20:44:01'),(106,559,0,31,'2024-03-20 20:44:02'),(107,558,1,31,'2024-03-20 20:44:04'),(108,557,0,31,'2024-03-20 20:44:05'),(109,556,1,31,'2024-03-20 20:44:06'),(110,550,0,31,'2024-03-22 12:27:57'),(111,550,1,31,'2024-03-22 12:28:01'),(112,550,0,31,'2024-03-22 12:28:03'),(113,550,1,31,'2024-03-22 12:28:04'),(114,538,1,31,'2024-03-22 12:39:43');
/*!40000 ALTER TABLE `analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `front` varchar(100) DEFAULT NULL,
  `back` varchar(100) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT NULL,
  `collection_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `is_migrated` tinyint(1) NOT NULL DEFAULT '0',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_cards_collection` (`collection_id`),
  CONSTRAINT `fk_cards_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=739 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (380,'Front 3 C2','Back 3 C2',0,129,38,1,'2024-03-01 22:21:14'),(381,'Front 2 C2','Back 2 C2',0,129,38,1,'2024-03-01 22:21:14'),(382,'Front 1 C2','Back 1 C2',0,129,38,1,'2024-03-01 22:21:14'),(383,'Front 3 C1','Back 3 C1',0,130,38,1,'2024-03-01 22:21:14'),(384,'Front 2 C1','Back 2 C1',0,130,38,1,'2024-03-01 22:21:14'),(385,'Front 1 C1','Back 1 C1',0,130,38,1,'2024-03-01 22:21:14'),(534,'What is the capital of Bulgaria?','Sofia',1,186,31,0,'2024-03-10 09:41:07'),(535,'What is the capital of England?','London',1,186,31,0,'2024-03-10 09:41:24'),(536,'What is the capital of Spain?','Madrid',1,186,31,0,'2024-03-10 09:41:38'),(537,'What is the capital of France?','Paris',1,186,31,0,'2024-03-10 09:42:04'),(538,'Language','език',1,187,31,0,'2024-03-10 09:42:53'),(539,'tree','дърво',1,187,31,0,'2024-03-10 09:43:24'),(540,'happy','щастлив',1,187,31,0,'2024-03-10 09:43:51'),(541,'How do we declare variables in JS?','let / const / var',1,188,31,0,'2024-03-10 09:44:59'),(542,'Name a few loops in JS.','for , do while, while',1,188,31,0,'2024-03-10 09:46:37'),(543,'Name a few front end languages.','HTML , CSS , JS',1,189,31,0,'2024-03-10 09:48:36'),(544,'Name a few front end frameworks.','Angular, React',1,189,31,0,'2024-03-10 09:49:56'),(545,'Name a few examples of errors.','Syntax , runtime',1,189,31,0,'2024-03-10 09:51:54'),(546,'What are some common data structures used in programming?','Arrays, lists, hash tables',1,189,31,0,'2024-03-10 09:52:26'),(547,'What are some different types of exercises?','Cardio, strength training, flexibility training',1,190,31,0,'2024-03-10 09:53:59'),(548,'What are the main types of nutrients our body needs?','Macronutrients and micronutrients',1,191,31,0,'2024-03-10 09:54:57'),(549,'What are the three main types of macronutrients?','Proteins, fats and carbohydrates.',1,191,31,0,'2024-03-10 09:55:20'),(550,'What are some key features that Angular provides?','Component-based architecture, data binding, routing, dependency injection',1,192,31,0,'2024-03-10 09:57:01'),(551,'What is the distance of a marathon?','42.195 km ',1,193,31,0,'2024-03-10 13:05:06'),(552,'What are the different types of waves?','Electromagnetic and mechanical',1,194,31,0,'2024-03-10 13:06:18'),(553,'Rojo','red',1,195,31,0,'2024-03-10 13:07:21'),(554,'Verde','green',1,195,31,0,'2024-03-10 13:07:29'),(555,'Azul','blue',1,195,31,0,'2024-03-10 13:07:34'),(556,'Name a few different types of databases.','SQL & NoSQL',1,196,31,0,'2024-03-10 13:10:38'),(557,'What are proteins made from?','Amino acids ',1,197,31,0,'2024-03-10 13:10:54'),(558,'Name a few different types of growth.','Linear and exponential ',1,199,31,0,'2024-03-10 13:15:37');
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collections`
--

DROP TABLE IF EXISTS `collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `migration_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_collections_users` (`user_id`),
  KEY `fk_collections_migrations_idx` (`migration_id`),
  CONSTRAINT `fk_collections_migrations` FOREIGN KEY (`migration_id`) REFERENCES `migrations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_collections_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=272 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collections`
--

LOCK TABLES `collections` WRITE;
/*!40000 ALTER TABLE `collections` DISABLE KEYS */;
INSERT INTO `collections` VALUES (129,'Collection 2',38,'2024-03-01 22:21:14',NULL),(130,'Collection 1',38,'2024-03-01 22:21:14',NULL),(186,'Capitals',31,'2024-03-10 09:40:54',NULL),(187,'English',31,'2024-03-10 09:42:20',NULL),(188,'javascript',31,'2024-03-10 09:44:13',NULL),(189,'programming',31,'2024-03-10 09:48:13',NULL),(190,'Exercises',31,'2024-03-10 09:53:16',NULL),(191,'Nutrition',31,'2024-03-10 09:54:41',NULL),(192,'Angular',31,'2024-03-10 09:56:01',NULL),(193,'Sports',31,'2024-03-10 13:03:31',NULL),(194,'Physics',31,'2024-03-10 13:05:31',NULL),(195,'Spanish',31,'2024-03-10 13:07:03',NULL),(196,'Computer science',31,'2024-03-10 13:08:08',NULL),(197,'Biology',31,'2024-03-10 13:09:18',NULL),(199,'Mathematics',31,'2024-03-10 13:15:08',NULL);
/*!40000 ALTER TABLE `collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `migration_id` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `migration_id` (`migration_id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (31,'root','f177c593abb2d6d7bd8976e38549e91c73cfcf901f9dadc6ecac7ffefacd5dae','2024-02-20 09:47:34'),(38,'migration','934574baf73535631699c1a94f2fe6e2be5f682f1c53adbb10302573ac43706f','2024-03-01 09:58:22'),(39,'migration2','ce59ad32b2c439af89b9bb20cea8926c35ddba675c429d743730573d38b95a2e','2024-03-01 12:07:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-22 15:55:12
