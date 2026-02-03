/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.14-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: intelligent_tutor
-- ------------------------------------------------------
-- Server version	10.11.14-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES
(1,'Can add log entry',1,'add_logentry'),
(2,'Can change log entry',1,'change_logentry'),
(3,'Can delete log entry',1,'delete_logentry'),
(4,'Can view log entry',1,'view_logentry'),
(5,'Can add permission',3,'add_permission'),
(6,'Can change permission',3,'change_permission'),
(7,'Can delete permission',3,'delete_permission'),
(8,'Can view permission',3,'view_permission'),
(9,'Can add group',2,'add_group'),
(10,'Can change group',2,'change_group'),
(11,'Can delete group',2,'delete_group'),
(12,'Can view group',2,'view_group'),
(13,'Can add content type',4,'add_contenttype'),
(14,'Can change content type',4,'change_contenttype'),
(15,'Can delete content type',4,'delete_contenttype'),
(16,'Can view content type',4,'view_contenttype'),
(17,'Can add session',5,'add_session'),
(18,'Can change session',5,'change_session'),
(19,'Can delete session',5,'delete_session'),
(20,'Can view session',5,'view_session'),
(21,'Can add Utilisateur',9,'add_user'),
(22,'Can change Utilisateur',9,'change_user'),
(23,'Can delete Utilisateur',9,'delete_user'),
(24,'Can view Utilisateur',9,'view_user'),
(25,'Can add Notification',6,'add_notification'),
(26,'Can change Notification',6,'change_notification'),
(27,'Can delete Notification',6,'delete_notification'),
(28,'Can view Notification',6,'view_notification'),
(29,'Can add Profil Étudiant',7,'add_studentprofile'),
(30,'Can change Profil Étudiant',7,'change_studentprofile'),
(31,'Can delete Profil Étudiant',7,'delete_studentprofile'),
(32,'Can view Profil Étudiant',7,'view_studentprofile'),
(33,'Can add Profil Enseignant',8,'add_teacherprofile'),
(34,'Can change Profil Enseignant',8,'change_teacherprofile'),
(35,'Can delete Profil Enseignant',8,'delete_teacherprofile'),
(36,'Can view Profil Enseignant',8,'view_teacherprofile'),
(37,'Can add Matière',13,'add_subject'),
(38,'Can change Matière',13,'change_subject'),
(39,'Can delete Matière',13,'delete_subject'),
(40,'Can view Matière',13,'view_subject'),
(41,'Can add Cours',10,'add_course'),
(42,'Can change Cours',10,'change_course'),
(43,'Can delete Cours',10,'delete_course'),
(44,'Can view Cours',10,'view_course'),
(45,'Can add Leçon',12,'add_lesson'),
(46,'Can change Leçon',12,'change_lesson'),
(47,'Can delete Leçon',12,'delete_lesson'),
(48,'Can view Leçon',12,'view_lesson'),
(49,'Can add Inscription au cours',11,'add_courseenrollment'),
(50,'Can change Inscription au cours',11,'change_courseenrollment'),
(51,'Can delete Inscription au cours',11,'delete_courseenrollment'),
(52,'Can view Inscription au cours',11,'view_courseenrollment'),
(53,'Can add Catégorie d\'Exercice',16,'add_exercisecategory'),
(54,'Can change Catégorie d\'Exercice',16,'change_exercisecategory'),
(55,'Can delete Catégorie d\'Exercice',16,'delete_exercisecategory'),
(56,'Can view Catégorie d\'Exercice',16,'view_exercisecategory'),
(57,'Can add Exercice',14,'add_exercise'),
(58,'Can change Exercice',14,'change_exercise'),
(59,'Can delete Exercice',14,'delete_exercise'),
(60,'Can view Exercice',14,'view_exercise'),
(61,'Can add Tentative d\'Exercice',15,'add_exerciseattempt'),
(62,'Can change Tentative d\'Exercice',15,'change_exerciseattempt'),
(63,'Can delete Tentative d\'Exercice',15,'delete_exerciseattempt'),
(64,'Can view Tentative d\'Exercice',15,'view_exerciseattempt'),
(65,'Can add Quiz',17,'add_quiz'),
(66,'Can change Quiz',17,'change_quiz'),
(67,'Can delete Quiz',17,'delete_quiz'),
(68,'Can view Quiz',17,'view_quiz'),
(69,'Can add Tentative de Quiz',18,'add_quizattempt'),
(70,'Can change Tentative de Quiz',18,'change_quizattempt'),
(71,'Can delete Tentative de Quiz',18,'delete_quizattempt'),
(72,'Can view Tentative de Quiz',18,'view_quizattempt'),
(73,'Can add Succès',19,'add_achievement'),
(74,'Can change Succès',19,'change_achievement'),
(75,'Can delete Succès',19,'delete_achievement'),
(76,'Can view Succès',19,'view_achievement'),
(77,'Can add Chemin d\'Apprentissage',20,'add_learningpath'),
(78,'Can change Chemin d\'Apprentissage',20,'change_learningpath'),
(79,'Can delete Chemin d\'Apprentissage',20,'delete_learningpath'),
(80,'Can view Chemin d\'Apprentissage',20,'view_learningpath'),
(81,'Can add Analyse de Performance',22,'add_performanceanalysis'),
(82,'Can change Analyse de Performance',22,'change_performanceanalysis'),
(83,'Can delete Analyse de Performance',22,'delete_performanceanalysis'),
(84,'Can view Analyse de Performance',22,'view_performanceanalysis'),
(85,'Can add Progression de Leçon',21,'add_lessonprogress'),
(86,'Can change Progression de Leçon',21,'change_lessonprogress'),
(87,'Can delete Progression de Leçon',21,'delete_lessonprogress'),
(88,'Can view Progression de Leçon',21,'view_lessonprogress'),
(89,'Can add Succès Étudiant',23,'add_studentachievement'),
(90,'Can change Succès Étudiant',23,'change_studentachievement'),
(91,'Can delete Succès Étudiant',23,'delete_studentachievement'),
(92,'Can view Succès Étudiant',23,'view_studentachievement'),
(93,'Can add Moteur de Recommandation Adaptatif',24,'add_adaptiverecommendationengine'),
(94,'Can change Moteur de Recommandation Adaptatif',24,'change_adaptiverecommendationengine'),
(95,'Can delete Moteur de Recommandation Adaptatif',24,'delete_adaptiverecommendationengine'),
(96,'Can view Moteur de Recommandation Adaptatif',24,'view_adaptiverecommendationengine'),
(97,'Can add Recommandation de Contenu',25,'add_contentrecommendation'),
(98,'Can change Recommandation de Contenu',25,'change_contentrecommendation'),
(99,'Can delete Recommandation de Contenu',25,'delete_contentrecommendation'),
(100,'Can view Recommandation de Contenu',25,'view_contentrecommendation'),
(101,'Can add Analyse d\'Erreur',26,'add_erroranalysis'),
(102,'Can change Analyse d\'Erreur',26,'change_erroranalysis'),
(103,'Can delete Analyse d\'Erreur',26,'delete_erroranalysis'),
(104,'Can view Analyse d\'Erreur',26,'view_erroranalysis'),
(105,'Can add Élément de Révision Intelligente',27,'add_intelligentrevisionitem'),
(106,'Can change Élément de Révision Intelligente',27,'change_intelligentrevisionitem'),
(107,'Can delete Élément de Révision Intelligente',27,'delete_intelligentrevisionitem'),
(108,'Can view Élément de Révision Intelligente',27,'view_intelligentrevisionitem'),
(109,'Can add Profil de Style d\'Apprentissage',28,'add_learningstyleprofile'),
(110,'Can change Profil de Style d\'Apprentissage',28,'change_learningstyleprofile'),
(111,'Can delete Profil de Style d\'Apprentissage',28,'delete_learningstyleprofile'),
(112,'Can view Profil de Style d\'Apprentissage',28,'view_learningstyleprofile'),
(113,'Can add ml model version',29,'add_mlmodelversion'),
(114,'Can change ml model version',29,'change_mlmodelversion'),
(115,'Can delete ml model version',29,'delete_mlmodelversion'),
(116,'Can view ml model version',29,'view_mlmodelversion'),
(117,'Can add model evaluation',30,'add_modelevaluation'),
(118,'Can change model evaluation',30,'change_modelevaluation'),
(119,'Can delete model evaluation',30,'delete_modelevaluation'),
(120,'Can view model evaluation',30,'view_modelevaluation'),
(121,'Can add model prediction cache',31,'add_modelpredictioncache'),
(122,'Can change model prediction cache',31,'change_modelpredictioncache'),
(123,'Can delete model prediction cache',31,'delete_modelpredictioncache'),
(124,'Can view model prediction cache',31,'view_modelpredictioncache'),
(125,'Can add Retour sur Recommandation',32,'add_recommendationfeedback'),
(126,'Can change Retour sur Recommandation',32,'change_recommendationfeedback'),
(127,'Can delete Retour sur Recommandation',32,'delete_recommendationfeedback'),
(128,'Can view Retour sur Recommandation',32,'view_recommendationfeedback'),
(129,'Can add Explication Intelligente',33,'add_smartexplanation'),
(130,'Can change Explication Intelligente',33,'change_smartexplanation'),
(131,'Can delete Explication Intelligente',33,'delete_smartexplanation'),
(132,'Can view Explication Intelligente',33,'view_smartexplanation'),
(133,'Can add training log',34,'add_traininglog'),
(134,'Can change training log',34,'change_traininglog'),
(135,'Can delete training log',34,'delete_traininglog'),
(136,'Can view training log',34,'view_traininglog');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses_course`
--

DROP TABLE IF EXISTS `courses_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses_course` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `level` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `order` int(10) unsigned NOT NULL CHECK (`order` >= 0),
  `duration_hours` double NOT NULL,
  `difficulty_level` int(11) NOT NULL,
  `cover_image` varchar(100) DEFAULT NULL,
  `learning_objectives` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`learning_objectives`)),
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` bigint(20) DEFAULT NULL,
  `subject_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `courses_course_created_by_id_4c488f66_fk_users_user_id` (`created_by_id`),
  KEY `courses_course_subject_id_7a2c8100_fk_courses_subject_id` (`subject_id`),
  CONSTRAINT `courses_course_created_by_id_4c488f66_fk_users_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `users_user` (`id`),
  CONSTRAINT `courses_course_subject_id_7a2c8100_fk_courses_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `courses_subject` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses_course`
--

LOCK TABLES `courses_course` WRITE;
/*!40000 ALTER TABLE `courses_course` DISABLE KEYS */;
INSERT INTO `courses_course` VALUES
(1,'Mathématiques - CM1 (Primaire)','Cours de Mathématiques pour CM1 (Primaire)','primary_cm1','published',0,1,3,'','[]','2026-01-27 22:14:01.576637','2026-01-27 22:14:01.576670',NULL,1),
(2,'Mathématiques - CM2 (Primaire)','Cours de Mathématiques pour CM2 (Primaire)','primary_cm2','published',0,1,3,'','[]','2026-01-27 22:14:19.775542','2026-01-27 22:14:19.775579',NULL,1),
(3,'Mathématiques - 6ème (Collège)','Cours de Mathématiques pour 6ème (Collège)','secondary_6eme','published',0,1,3,'','[]','2026-01-27 22:14:19.799166','2026-01-27 22:14:19.799196',NULL,1),
(4,'Mathématiques - 5ème (Collège)','Cours de Mathématiques pour 5ème (Collège)','secondary_5eme','published',0,1,3,'','[]','2026-01-27 22:14:19.810552','2026-01-27 22:14:19.810582',NULL,1),
(5,'Français - CM1 (Primaire)','Cours de Français pour CM1 (Primaire)','primary_cm1','published',0,1,3,'','[]','2026-01-27 22:14:19.823154','2026-01-27 22:14:19.823191',NULL,2),
(6,'Français - CM2 (Primaire)','Cours de Français pour CM2 (Primaire)','primary_cm2','published',0,1,3,'','[]','2026-01-27 22:14:19.839089','2026-01-27 22:14:19.839121',NULL,2),
(7,'Français - 6ème (Collège)','Cours de Français pour 6ème (Collège)','secondary_6eme','published',0,1,3,'','[]','2026-01-27 22:14:19.853675','2026-01-27 22:14:19.853709',NULL,2),
(8,'Français - 5ème (Collège)','Cours de Français pour 5ème (Collège)','secondary_5eme','published',0,1,3,'','[]','2026-01-27 22:14:19.867698','2026-01-27 22:14:19.867751',NULL,2),
(9,'Sciences - CM1 (Primaire)','Cours de Sciences pour CM1 (Primaire)','primary_cm1','published',0,1,3,'','[]','2026-01-27 22:14:19.884763','2026-01-27 22:14:19.884811',NULL,3),
(10,'Sciences - CM2 (Primaire)','Cours de Sciences pour CM2 (Primaire)','primary_cm2','published',0,1,3,'','[]','2026-01-27 22:14:19.900579','2026-01-27 22:14:19.900616',NULL,3),
(11,'Sciences - 6ème (Collège)','Cours de Sciences pour 6ème (Collège)','secondary_6eme','published',0,1,3,'','[]','2026-01-27 22:14:19.914242','2026-01-27 22:14:19.914275',NULL,3),
(12,'Sciences - 5ème (Collège)','Cours de Sciences pour 5ème (Collège)','secondary_5eme','published',0,1,3,'','[]','2026-01-27 22:14:19.927935','2026-01-27 22:14:19.927967',NULL,3),
(35,'Français et culture burkinabè','Apprentissage du français à travers la culture locale','primary_cm2','published',0,1,1,'','[]','2026-01-27 22:25:22.936267','2026-01-27 22:25:22.936318',NULL,2),
(36,'Histoire et culture burkinabè','Apprentissage du histoire à travers la culture locale','primary_cm2','published',0,1,1,'','[]','2026-01-27 22:25:22.941384','2026-01-27 22:25:22.941433',NULL,5),
(37,'Géographie et culture burkinabè','Apprentissage du géographie à travers la culture locale','primary_cm2','published',0,1,1,'','[]','2026-01-27 22:25:22.961933','2026-01-27 22:25:22.961979',NULL,6),
(54,'Mathématiques - primaire_ce1','Cours FASO de Mathématiques','primary_ce1','published',0,7,2,'','[]','2026-01-27 22:28:52.234780','2026-01-27 22:28:52.234835',NULL,1),
(55,'Français - primaire_ce1','Cours FASO de Français','primary_ce1','published',0,5,2,'','[]','2026-01-27 22:28:52.284015','2026-01-27 22:28:52.284080',NULL,2),
(56,'Mathématiques - primaire_ce2','Cours FASO de Mathématiques','primary_ce2','published',0,7,2,'','[]','2026-01-27 22:28:52.328921','2026-01-27 22:28:52.328958',NULL,1),
(57,'Français - primaire_ce2','Cours FASO de Français','primary_ce2','published',0,5,2,'','[]','2026-01-27 22:28:52.381695','2026-01-27 22:28:52.381784',NULL,2),
(58,'Mathématiques - primaire_cm1','Cours FASO de Mathématiques','primary_cm1','published',0,7,2,'','[]','2026-01-27 22:28:52.418510','2026-01-27 22:28:52.418548',NULL,1),
(59,'Français - primaire_cm1','Cours FASO de Français','primary_cm1','published',0,5,2,'','[]','2026-01-27 22:28:52.470239','2026-01-27 22:28:52.470284',NULL,2),
(60,'Mathématiques - primaire_cm2','Cours FASO de Mathématiques','primary_cm2','published',0,7,2,'','[]','2026-01-27 22:28:52.499665','2026-01-27 22:28:52.499693',NULL,1),
(61,'Français - primaire_cm2','Cours FASO de Français','primary_cm2','published',0,5,2,'','[]','2026-01-27 22:28:52.542942','2026-01-27 22:28:52.542975',NULL,2),
(62,'Mathématiques - postprimaire_6e','Cours FASO de Mathématiques','secondary_6eme','published',0,7,2,'','[]','2026-01-27 22:28:52.572373','2026-01-27 22:28:52.572405',NULL,1),
(63,'Français - postprimaire_6e','Cours FASO de Français','secondary_6eme','published',0,5,2,'','[]','2026-01-27 22:28:52.623500','2026-01-27 22:28:52.623541',NULL,2),
(64,'Mathématiques - postprimaire_5e','Cours FASO de Mathématiques','secondary_5eme','published',0,7,2,'','[]','2026-01-27 22:28:52.657342','2026-01-27 22:28:52.657383',NULL,1),
(65,'Français - postprimaire_5e','Cours FASO de Français','secondary_5eme','published',0,5,2,'','[]','2026-01-27 22:28:52.707883','2026-01-27 22:28:52.707929',NULL,2),
(66,'Mathématiques - postprimaire_4e','Cours FASO de Mathématiques','secondary_4eme','published',0,7,2,'','[]','2026-01-27 22:28:52.750772','2026-01-27 22:28:52.750831',NULL,1),
(67,'Français - postprimaire_4e','Cours FASO de Français','secondary_4eme','published',0,5,2,'','[]','2026-01-27 22:28:52.809503','2026-01-27 22:28:52.809564',NULL,2),
(68,'Mathématiques - postprimaire_3e','Cours FASO de Mathématiques','secondary_3eme','published',0,7,2,'','[]','2026-01-27 22:28:52.855455','2026-01-27 22:28:52.855515',NULL,1),
(69,'Français - postprimaire_3e','Cours FASO de Français','secondary_3eme','published',0,5,2,'','[]','2026-01-27 22:28:52.907323','2026-01-27 22:28:52.907375',NULL,2),
(70,'Mathématiques - secondaire_2nde','Cours FASO de Mathématiques','lycee_2nde','published',0,7,2,'','[]','2026-01-27 22:28:52.944054','2026-01-31 00:45:32.360140',NULL,1),
(71,'Français - secondaire_2nde','Cours FASO de Français','lycee_2nde','published',0,5,2,'','[]','2026-01-27 22:28:52.994833','2026-01-31 00:45:32.358503',NULL,2),
(72,'Mathématiques - secondaire_1ere','Cours FASO de Mathématiques','lycee_1ere','published',0,7,2,'','[]','2026-01-27 22:28:53.054310','2026-01-31 00:45:32.356783',NULL,1),
(73,'Français - secondaire_1ere','Cours FASO de Français','lycee_1ere','published',0,5,2,'','[]','2026-01-27 22:28:53.141301','2026-01-31 00:45:32.354884',NULL,2),
(74,'Mathématiques - secondaire_tle','Cours FASO de Mathématiques','lycee_tles','published',0,7,2,'','[]','2026-01-27 22:28:53.210365','2026-01-31 00:45:32.363717',NULL,1),
(75,'Français - secondaire_tle','Cours FASO de Français','lycee_tles','published',0,5,2,'','[]','2026-01-27 22:28:53.304016','2026-01-31 00:45:32.362062',NULL,2);
/*!40000 ALTER TABLE `courses_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses_courseenrollment`
--

DROP TABLE IF EXISTS `courses_courseenrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses_courseenrollment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `status` varchar(20) NOT NULL,
  `progress_percentage` double NOT NULL,
  `enrolled_at` datetime(6) NOT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `last_accessed` datetime(6) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `courses_courseenrollment_student_id_course_id_49f16872_uniq` (`student_id`,`course_id`),
  KEY `courses_courseenrollment_course_id_300254e8_fk_courses_course_id` (`course_id`),
  CONSTRAINT `courses_courseenrollment_course_id_300254e8_fk_courses_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses_course` (`id`),
  CONSTRAINT `courses_courseenrollment_student_id_335c993d_fk_users_user_id` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses_courseenrollment`
--

LOCK TABLES `courses_courseenrollment` WRITE;
/*!40000 ALTER TABLE `courses_courseenrollment` DISABLE KEYS */;
INSERT INTO `courses_courseenrollment` VALUES
(1,'enrolled',0,'2026-01-27 23:02:49.509077',NULL,NULL,'2026-01-27 23:02:49.509286',55,2),
(2,'enrolled',0,'2026-01-31 00:46:17.338522',NULL,NULL,'2026-01-31 00:46:17.338722',75,9);
/*!40000 ALTER TABLE `courses_courseenrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses_lesson`
--

DROP TABLE IF EXISTS `courses_lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses_lesson` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `content` longtext NOT NULL,
  `order` int(10) unsigned NOT NULL CHECK (`order` >= 0),
  `duration_minutes` int(11) NOT NULL,
  `video_url` varchar(200) NOT NULL,
  `resources` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`resources`)),
  `learning_outcomes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`learning_outcomes`)),
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `courses_lesson_course_id_16bc4882_fk_courses_course_id` (`course_id`),
  CONSTRAINT `courses_lesson_course_id_16bc4882_fk_courses_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses_course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=425 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses_lesson`
--

LOCK TABLES `courses_lesson` WRITE;
/*!40000 ALTER TABLE `courses_lesson` DISABLE KEYS */;
INSERT INTO `courses_lesson` VALUES
(1,'Leçon 1: Mathématiques - Module 1','Contenu pédagogique de Mathématiques','<h2>Module 1</h2><p>Contenu détaillé du cours...</p>',1,30,'','[]','[]','2026-01-27 22:14:19.789149','2026-01-27 22:14:19.789181',2),
(2,'Leçon 2: Mathématiques - Module 2','Contenu pédagogique de Mathématiques','<h2>Module 2</h2><p>Contenu détaillé du cours...</p>',2,60,'','[]','[]','2026-01-27 22:14:19.792314','2026-01-27 22:14:19.792348',2),
(3,'Leçon 3: Mathématiques - Module 3','Contenu pédagogique de Mathématiques','<h2>Module 3</h2><p>Contenu détaillé du cours...</p>',3,90,'','[]','[]','2026-01-27 22:14:19.795650','2026-01-27 22:14:19.795681',2),
(4,'Leçon 1: Mathématiques - Module 1','Contenu pédagogique de Mathématiques','<h2>Module 1</h2><p>Contenu détaillé du cours...</p>',1,30,'','[]','[]','2026-01-27 22:14:19.801986','2026-01-27 22:14:19.802016',3),
(5,'Leçon 2: Mathématiques - Module 2','Contenu pédagogique de Mathématiques','<h2>Module 2</h2><p>Contenu détaillé du cours...</p>',2,60,'','[]','[]','2026-01-27 22:14:19.804779','2026-01-27 22:14:19.804808',3),
(6,'Leçon 3: Mathématiques - Module 3','Contenu pédagogique de Mathématiques','<h2>Module 3</h2><p>Contenu détaillé du cours...</p>',3,90,'','[]','[]','2026-01-27 22:14:19.807457','2026-01-27 22:14:19.807487',3),
(7,'Leçon 1: Mathématiques - Module 1','Contenu pédagogique de Mathématiques','<h2>Module 1</h2><p>Contenu détaillé du cours...</p>',1,30,'','[]','[]','2026-01-27 22:14:19.813318','2026-01-27 22:14:19.813348',4),
(8,'Leçon 2: Mathématiques - Module 2','Contenu pédagogique de Mathématiques','<h2>Module 2</h2><p>Contenu détaillé du cours...</p>',2,60,'','[]','[]','2026-01-27 22:14:19.816477','2026-01-27 22:14:19.816517',4),
(9,'Leçon 3: Mathématiques - Module 3','Contenu pédagogique de Mathématiques','<h2>Module 3</h2><p>Contenu détaillé du cours...</p>',3,90,'','[]','[]','2026-01-27 22:14:19.820032','2026-01-27 22:14:19.820061',4),
(10,'Leçon 1: Français - Module 1','Contenu pédagogique de Français','<h2>Module 1</h2><p>Contenu détaillé du cours...</p>',1,30,'','[]','[]','2026-01-27 22:14:19.827530','2026-01-27 22:14:19.827575',5),
(11,'Leçon 2: Français - Module 2','Contenu pédagogique de Français','<h2>Module 2</h2><p>Contenu détaillé du cours...</p>',2,60,'','[]','[]','2026-01-27 22:14:19.831772','2026-01-27 22:14:19.831808',5),
(12,'Leçon 3: Français - Module 3','Contenu pédagogique de Français','<h2>Module 3</h2><p>Contenu détaillé du cours...</p>',3,90,'','[]','[]','2026-01-27 22:14:19.835707','2026-01-27 22:14:19.835743',5),
(13,'Leçon 1: Français - Module 1','Contenu pédagogique de Français','<h2>Module 1</h2><p>Contenu détaillé du cours...</p>',1,30,'','[]','[]','2026-01-27 22:14:19.842128','2026-01-27 22:14:19.842161',6),
(14,'Leçon 2: Français - Module 2','Contenu pédagogique de Français','<h2>Module 2</h2><p>Contenu détaillé du cours...</p>',2,60,'','[]','[]','2026-01-27 22:14:19.845065','2026-01-27 22:14:19.845096',6),
(15,'Leçon 3: Français - Module 3','Contenu pédagogique de Français','<h2>Module 3</h2><p>Contenu détaillé du cours...</p>',3,90,'','[]','[]','2026-01-27 22:14:19.849499','2026-01-27 22:14:19.849549',6),
(16,'Leçon 1: Français - Module 1','Contenu pédagogique de Français','<h2>Module 1</h2><p>Contenu détaillé du cours...</p>',1,30,'','[]','[]','2026-01-27 22:14:19.856742','2026-01-27 22:14:19.856775',7),
(17,'Leçon 2: Français - Module 2','Contenu pédagogique de Français','<h2>Module 2</h2><p>Contenu détaillé du cours...</p>',2,60,'','[]','[]','2026-01-27 22:14:19.860172','2026-01-27 22:14:19.860206',7),
(18,'Leçon 3: Français - Module 3','Contenu pédagogique de Français','<h2>Module 3</h2><p>Contenu détaillé du cours...</p>',3,90,'','[]','[]','2026-01-27 22:14:19.863141','2026-01-27 22:14:19.863174',7),
(19,'Leçon 1: Français - Module 1','Contenu pédagogique de Français','<h2>Module 1</h2><p>Contenu détaillé du cours...</p>',1,30,'','[]','[]','2026-01-27 22:14:19.871111','2026-01-27 22:14:19.871147',8),
(20,'Leçon 2: Français - Module 2','Contenu pédagogique de Français','<h2>Module 2</h2><p>Contenu détaillé du cours...</p>',2,60,'','[]','[]','2026-01-27 22:14:19.874329','2026-01-27 22:14:19.874362',8),
(21,'Leçon 3: Français - Module 3','Contenu pédagogique de Français','<h2>Module 3</h2><p>Contenu détaillé du cours...</p>',3,90,'','[]','[]','2026-01-27 22:14:19.879351','2026-01-27 22:14:19.879399',8),
(22,'Leçon 1: Sciences - Module 1','Contenu pédagogique de Sciences','<h2>Module 1</h2><p>Contenu détaillé du cours...</p>',1,30,'','[]','[]','2026-01-27 22:14:19.888554','2026-01-27 22:14:19.888599',9),
(23,'Leçon 2: Sciences - Module 2','Contenu pédagogique de Sciences','<h2>Module 2</h2><p>Contenu détaillé du cours...</p>',2,60,'','[]','[]','2026-01-27 22:14:19.892334','2026-01-27 22:14:19.892371',9),
(24,'Leçon 3: Sciences - Module 3','Contenu pédagogique de Sciences','<h2>Module 3</h2><p>Contenu détaillé du cours...</p>',3,90,'','[]','[]','2026-01-27 22:14:19.895556','2026-01-27 22:14:19.895609',9),
(25,'Leçon 1: Sciences - Module 1','Contenu pédagogique de Sciences','<h2>Module 1</h2><p>Contenu détaillé du cours...</p>',1,30,'','[]','[]','2026-01-27 22:14:19.903939','2026-01-27 22:14:19.903974',10),
(26,'Leçon 2: Sciences - Module 2','Contenu pédagogique de Sciences','<h2>Module 2</h2><p>Contenu détaillé du cours...</p>',2,60,'','[]','[]','2026-01-27 22:14:19.907232','2026-01-27 22:14:19.907268',10),
(27,'Leçon 3: Sciences - Module 3','Contenu pédagogique de Sciences','<h2>Module 3</h2><p>Contenu détaillé du cours...</p>',3,90,'','[]','[]','2026-01-27 22:14:19.910495','2026-01-27 22:14:19.910548',10),
(28,'Leçon 1: Sciences - Module 1','Contenu pédagogique de Sciences','<h2>Module 1</h2><p>Contenu détaillé du cours...</p>',1,30,'','[]','[]','2026-01-27 22:14:19.917697','2026-01-27 22:14:19.917745',11),
(29,'Leçon 2: Sciences - Module 2','Contenu pédagogique de Sciences','<h2>Module 2</h2><p>Contenu détaillé du cours...</p>',2,60,'','[]','[]','2026-01-27 22:14:19.921323','2026-01-27 22:14:19.921359',11),
(30,'Leçon 3: Sciences - Module 3','Contenu pédagogique de Sciences','<h2>Module 3</h2><p>Contenu détaillé du cours...</p>',3,90,'','[]','[]','2026-01-27 22:14:19.924528','2026-01-27 22:14:19.924559',11),
(31,'Leçon 1: Sciences - Module 1','Contenu pédagogique de Sciences','<h2>Module 1</h2><p>Contenu détaillé du cours...</p>',1,30,'','[]','[]','2026-01-27 22:14:19.931554','2026-01-27 22:14:19.931589',12),
(32,'Leçon 2: Sciences - Module 2','Contenu pédagogique de Sciences','<h2>Module 2</h2><p>Contenu détaillé du cours...</p>',2,60,'','[]','[]','2026-01-27 22:14:19.934924','2026-01-27 22:14:19.934957',12),
(33,'Leçon 3: Sciences - Module 3','Contenu pédagogique de Sciences','<h2>Module 3</h2><p>Contenu détaillé du cours...</p>',3,90,'','[]','[]','2026-01-27 22:14:19.937786','2026-01-27 22:14:19.937819',12),
(167,'Les anciens royaumes du Burkina Faso','Leçon sur Les anciens royaumes du Burkina Faso','\n# Les anciens royaumes du Burkina Faso\n\n## Objectifs d\'apprentissage:\n- Comprendre les aspects importants de Les anciens royaumes du Burkina Faso\n- Découvrir la richesse culturelle du Burkina Faso\n- Appliquer ces connaissances dans la vie quotidienne\n\n## Contenu:\nLe Burkina Faso est un pays riche en histoire, culture et traditions. \nLes anciens royaumes du Burkina Faso est un élément clé de notre identité nationale.\n\n## Ressources locales:\n- Entretiens avec les anciens du village\n- Proverbes et histoires traditionnelles\n- Exemples concrets de la communauté locale\n',1,45,'','[]','[]','2026-01-27 22:25:22.945671','2026-01-27 22:25:22.945720',36),
(168,'Le Mossi et ses traditions','Leçon sur Le Mossi et ses traditions','\n# Le Mossi et ses traditions\n\n## Objectifs d\'apprentissage:\n- Comprendre les aspects importants de Le Mossi et ses traditions\n- Découvrir la richesse culturelle du Burkina Faso\n- Appliquer ces connaissances dans la vie quotidienne\n\n## Contenu:\nLe Burkina Faso est un pays riche en histoire, culture et traditions. \nLe Mossi et ses traditions est un élément clé de notre identité nationale.\n\n## Ressources locales:\n- Entretiens avec les anciens du village\n- Proverbes et histoires traditionnelles\n- Exemples concrets de la communauté locale\n',2,45,'','[]','[]','2026-01-27 22:25:22.950765','2026-01-27 22:25:22.950812',36),
(169,'La colonisation et l\'indépendance','Leçon sur La colonisation et l\'indépendance','\n# La colonisation et l\'indépendance\n\n## Objectifs d\'apprentissage:\n- Comprendre les aspects importants de La colonisation et l\'indépendance\n- Découvrir la richesse culturelle du Burkina Faso\n- Appliquer ces connaissances dans la vie quotidienne\n\n## Contenu:\nLe Burkina Faso est un pays riche en histoire, culture et traditions. \nLa colonisation et l\'indépendance est un élément clé de notre identité nationale.\n\n## Ressources locales:\n- Entretiens avec les anciens du village\n- Proverbes et histoires traditionnelles\n- Exemples concrets de la communauté locale\n',3,45,'','[]','[]','2026-01-27 22:25:22.955369','2026-01-27 22:25:22.955416',36),
(170,'Les régions du Burkina Faso','Leçon sur Les régions du Burkina Faso','\n# Les régions du Burkina Faso\n\n## Objectifs d\'apprentissage:\n- Comprendre les aspects importants de Les régions du Burkina Faso\n- Découvrir la richesse culturelle du Burkina Faso\n- Appliquer ces connaissances dans la vie quotidienne\n\n## Contenu:\nLe Burkina Faso est un pays riche en histoire, culture et traditions. \nLes régions du Burkina Faso est un élément clé de notre identité nationale.\n\n## Ressources locales:\n- Entretiens avec les anciens du village\n- Proverbes et histoires traditionnelles\n- Exemples concrets de la communauté locale\n',1,45,'','[]','[]','2026-01-27 22:25:22.966311','2026-01-27 22:25:22.966358',37),
(171,'Les fleuves et les ressources en eau','Leçon sur Les fleuves et les ressources en eau','\n# Les fleuves et les ressources en eau\n\n## Objectifs d\'apprentissage:\n- Comprendre les aspects importants de Les fleuves et les ressources en eau\n- Découvrir la richesse culturelle du Burkina Faso\n- Appliquer ces connaissances dans la vie quotidienne\n\n## Contenu:\nLe Burkina Faso est un pays riche en histoire, culture et traditions. \nLes fleuves et les ressources en eau est un élément clé de notre identité nationale.\n\n## Ressources locales:\n- Entretiens avec les anciens du village\n- Proverbes et histoires traditionnelles\n- Exemples concrets de la communauté locale\n',2,45,'','[]','[]','2026-01-27 22:25:22.970776','2026-01-27 22:25:22.970824',37),
(172,'Les zones climatiques','Leçon sur Les zones climatiques','\n# Les zones climatiques\n\n## Objectifs d\'apprentissage:\n- Comprendre les aspects importants de Les zones climatiques\n- Découvrir la richesse culturelle du Burkina Faso\n- Appliquer ces connaissances dans la vie quotidienne\n\n## Contenu:\nLe Burkina Faso est un pays riche en histoire, culture et traditions. \nLes zones climatiques est un élément clé de notre identité nationale.\n\n## Ressources locales:\n- Entretiens avec les anciens du village\n- Proverbes et histoires traditionnelles\n- Exemples concrets de la communauté locale\n',3,45,'','[]','[]','2026-01-27 22:25:22.974896','2026-01-27 22:25:22.974942',37),
(269,'Mathématiques CP1 : vocabulaire mathématiques','Mathématiques CP1 : vocabulaire mathématiques','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p1.html',1,30,'','[]','[]','2026-01-27 22:28:52.249154','2026-01-27 22:28:52.249188',54),
(270,'Mathématiques CP1 : étude des nombres de 1 à 12','Mathématiques CP1 : étude des nombres de 1 à 12','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p2.html',2,30,'','[]','[]','2026-01-27 22:28:52.252492','2026-01-27 22:28:52.252536',54),
(271,'Mathématiques CP1 : étude des nombres de 13 à 20','Mathématiques CP1 : étude des nombres de 13 à 20','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p3.html',3,30,'','[]','[]','2026-01-27 22:28:52.255848','2026-01-27 22:28:52.255882',54),
(272,'Fiches de mathématiques CP2 : 0 à 49','Fiches de mathématiques CP2 : 0 à 49','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p1.html',4,30,'','[]','[]','2026-01-27 22:28:52.259039','2026-01-27 22:28:52.259074',54),
(273,'Fiches de mathématiques CP2 : 50 à 90','Fiches de mathématiques CP2 : 50 à 90','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p2.html',5,30,'','[]','[]','2026-01-27 22:28:52.262435','2026-01-27 22:28:52.262467',54),
(274,'Fiches de mathématiques CP2 : 91 à 100','Fiches de mathématiques CP2 : 91 à 100','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p3.html',6,30,'','[]','[]','2026-01-27 22:28:52.265359','2026-01-27 22:28:52.265391',54),
(275,'Fiches de mathématiques CP1','Fiches de mathématiques CP1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-inclusives/fiches-api-inclusives-maths-cp1.html',7,30,'','[]','[]','2026-01-27 22:28:52.268791','2026-01-27 22:28:52.268825',54),
(276,'Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-cp1-exporale4.html',1,30,'','[]','[]','2026-01-27 22:28:52.291189','2026-01-27 22:28:52.291244',55),
(277,'Lecture CP1 : voyelles composées aux articulations','Lecture CP1 : voyelles composées aux articulations','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-lecture-cp1-vcomposees-articulations.html',2,30,'','[]','[]','2026-01-27 22:28:52.296498','2026-01-27 22:28:52.296553',55),
(278,'Fiches expression orale CP2 : partie 1','Fiches expression orale CP2 : partie 1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p1.html',3,30,'','[]','[]','2026-01-27 22:28:52.303976','2026-01-27 22:28:52.304079',55),
(279,'Fiches expression orale CP2 : partie 2','Fiches expression orale CP2 : partie 2','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p2.html',4,30,'','[]','[]','2026-01-27 22:28:52.308974','2026-01-27 22:28:52.309014',55),
(280,'Fiches expression orale CP2 : partie 3','Fiches expression orale CP2 : partie 3','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p3.html',5,30,'','[]','[]','2026-01-27 22:28:52.313255','2026-01-27 22:28:52.313295',55),
(281,'Mathématiques CP1 : vocabulaire mathématiques','Mathématiques CP1 : vocabulaire mathématiques','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p1.html',1,30,'','[]','[]','2026-01-27 22:28:52.332917','2026-01-27 22:28:52.332954',56),
(282,'Mathématiques CP1 : étude des nombres de 1 à 12','Mathématiques CP1 : étude des nombres de 1 à 12','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p2.html',2,30,'','[]','[]','2026-01-27 22:28:52.336968','2026-01-27 22:28:52.337024',56),
(283,'Mathématiques CP1 : étude des nombres de 13 à 20','Mathématiques CP1 : étude des nombres de 13 à 20','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p3.html',3,30,'','[]','[]','2026-01-27 22:28:52.340998','2026-01-27 22:28:52.341035',56),
(284,'Fiches de mathématiques CP2 : 0 à 49','Fiches de mathématiques CP2 : 0 à 49','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p1.html',4,30,'','[]','[]','2026-01-27 22:28:52.345746','2026-01-27 22:28:52.345799',56),
(285,'Fiches de mathématiques CP2 : 50 à 90','Fiches de mathématiques CP2 : 50 à 90','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p2.html',5,30,'','[]','[]','2026-01-27 22:28:52.350142','2026-01-27 22:28:52.350179',56),
(286,'Fiches de mathématiques CP2 : 91 à 100','Fiches de mathématiques CP2 : 91 à 100','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p3.html',6,30,'','[]','[]','2026-01-27 22:28:52.356702','2026-01-27 22:28:52.356755',56),
(287,'Fiches de mathématiques CP1','Fiches de mathématiques CP1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-inclusives/fiches-api-inclusives-maths-cp1.html',7,30,'','[]','[]','2026-01-27 22:28:52.361021','2026-01-27 22:28:52.361071',56),
(288,'Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-cp1-exporale4.html',1,30,'','[]','[]','2026-01-27 22:28:52.386870','2026-01-27 22:28:52.386911',57),
(289,'Lecture CP1 : voyelles composées aux articulations','Lecture CP1 : voyelles composées aux articulations','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-lecture-cp1-vcomposees-articulations.html',2,30,'','[]','[]','2026-01-27 22:28:52.390990','2026-01-27 22:28:52.391028',57),
(290,'Fiches expression orale CP2 : partie 1','Fiches expression orale CP2 : partie 1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p1.html',3,30,'','[]','[]','2026-01-27 22:28:52.395437','2026-01-27 22:28:52.395476',57),
(291,'Fiches expression orale CP2 : partie 2','Fiches expression orale CP2 : partie 2','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p2.html',4,30,'','[]','[]','2026-01-27 22:28:52.400045','2026-01-27 22:28:52.400099',57),
(292,'Fiches expression orale CP2 : partie 3','Fiches expression orale CP2 : partie 3','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p3.html',5,30,'','[]','[]','2026-01-27 22:28:52.404851','2026-01-27 22:28:52.404895',57),
(293,'Mathématiques CP1 : vocabulaire mathématiques','Mathématiques CP1 : vocabulaire mathématiques','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p1.html',1,30,'','[]','[]','2026-01-27 22:28:52.422710','2026-01-27 22:28:52.422748',58),
(294,'Mathématiques CP1 : étude des nombres de 1 à 12','Mathématiques CP1 : étude des nombres de 1 à 12','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p2.html',2,30,'','[]','[]','2026-01-27 22:28:52.426521','2026-01-27 22:28:52.426559',58),
(295,'Mathématiques CP1 : étude des nombres de 13 à 20','Mathématiques CP1 : étude des nombres de 13 à 20','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p3.html',3,30,'','[]','[]','2026-01-27 22:28:52.430288','2026-01-27 22:28:52.430324',58),
(296,'Fiches de mathématiques CP2 : 0 à 49','Fiches de mathématiques CP2 : 0 à 49','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p1.html',4,30,'','[]','[]','2026-01-27 22:28:52.435128','2026-01-27 22:28:52.435187',58),
(297,'Fiches de mathématiques CP2 : 50 à 90','Fiches de mathématiques CP2 : 50 à 90','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p2.html',5,30,'','[]','[]','2026-01-27 22:28:52.439874','2026-01-27 22:28:52.439926',58),
(298,'Fiches de mathématiques CP2 : 91 à 100','Fiches de mathématiques CP2 : 91 à 100','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p3.html',6,30,'','[]','[]','2026-01-27 22:28:52.445113','2026-01-27 22:28:52.445168',58),
(299,'Fiches de mathématiques CP1','Fiches de mathématiques CP1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-inclusives/fiches-api-inclusives-maths-cp1.html',7,30,'','[]','[]','2026-01-27 22:28:52.449836','2026-01-27 22:28:52.449890',58),
(300,'Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-cp1-exporale4.html',1,30,'','[]','[]','2026-01-27 22:28:52.474104','2026-01-27 22:28:52.474147',59),
(301,'Lecture CP1 : voyelles composées aux articulations','Lecture CP1 : voyelles composées aux articulations','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-lecture-cp1-vcomposees-articulations.html',2,30,'','[]','[]','2026-01-27 22:28:52.477537','2026-01-27 22:28:52.477578',59),
(302,'Fiches expression orale CP2 : partie 1','Fiches expression orale CP2 : partie 1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p1.html',3,30,'','[]','[]','2026-01-27 22:28:52.480997','2026-01-27 22:28:52.481039',59),
(303,'Fiches expression orale CP2 : partie 2','Fiches expression orale CP2 : partie 2','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p2.html',4,30,'','[]','[]','2026-01-27 22:28:52.484362','2026-01-27 22:28:52.484402',59),
(304,'Fiches expression orale CP2 : partie 3','Fiches expression orale CP2 : partie 3','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p3.html',5,30,'','[]','[]','2026-01-27 22:28:52.487570','2026-01-27 22:28:52.487607',59),
(305,'Mathématiques CP1 : vocabulaire mathématiques','Mathématiques CP1 : vocabulaire mathématiques','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p1.html',1,30,'','[]','[]','2026-01-27 22:28:52.502813','2026-01-27 22:28:52.502851',60),
(306,'Mathématiques CP1 : étude des nombres de 1 à 12','Mathématiques CP1 : étude des nombres de 1 à 12','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p2.html',2,30,'','[]','[]','2026-01-27 22:28:52.506855','2026-01-27 22:28:52.506904',60),
(307,'Mathématiques CP1 : étude des nombres de 13 à 20','Mathématiques CP1 : étude des nombres de 13 à 20','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p3.html',3,30,'','[]','[]','2026-01-27 22:28:52.510848','2026-01-27 22:28:52.510893',60),
(308,'Fiches de mathématiques CP2 : 0 à 49','Fiches de mathématiques CP2 : 0 à 49','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p1.html',4,30,'','[]','[]','2026-01-27 22:28:52.514649','2026-01-27 22:28:52.514695',60),
(309,'Fiches de mathématiques CP2 : 50 à 90','Fiches de mathématiques CP2 : 50 à 90','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p2.html',5,30,'','[]','[]','2026-01-27 22:28:52.519143','2026-01-27 22:28:52.519183',60),
(310,'Fiches de mathématiques CP2 : 91 à 100','Fiches de mathématiques CP2 : 91 à 100','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p3.html',6,30,'','[]','[]','2026-01-27 22:28:52.523573','2026-01-27 22:28:52.523648',60),
(311,'Fiches de mathématiques CP1','Fiches de mathématiques CP1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-inclusives/fiches-api-inclusives-maths-cp1.html',7,30,'','[]','[]','2026-01-27 22:28:52.527985','2026-01-27 22:28:52.528021',60),
(312,'Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-cp1-exporale4.html',1,30,'','[]','[]','2026-01-27 22:28:52.546388','2026-01-27 22:28:52.546421',61),
(313,'Lecture CP1 : voyelles composées aux articulations','Lecture CP1 : voyelles composées aux articulations','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-lecture-cp1-vcomposees-articulations.html',2,30,'','[]','[]','2026-01-27 22:28:52.549986','2026-01-27 22:28:52.550019',61),
(314,'Fiches expression orale CP2 : partie 1','Fiches expression orale CP2 : partie 1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p1.html',3,30,'','[]','[]','2026-01-27 22:28:52.553820','2026-01-27 22:28:52.553852',61),
(315,'Fiches expression orale CP2 : partie 2','Fiches expression orale CP2 : partie 2','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p2.html',4,30,'','[]','[]','2026-01-27 22:28:52.556905','2026-01-27 22:28:52.556935',61),
(316,'Fiches expression orale CP2 : partie 3','Fiches expression orale CP2 : partie 3','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p3.html',5,30,'','[]','[]','2026-01-27 22:28:52.560084','2026-01-27 22:28:52.560114',61),
(317,'Mathématiques CP1 : vocabulaire mathématiques','Mathématiques CP1 : vocabulaire mathématiques','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p1.html',1,30,'','[]','[]','2026-01-27 22:28:52.576213','2026-01-27 22:28:52.576257',62),
(318,'Mathématiques CP1 : étude des nombres de 1 à 12','Mathématiques CP1 : étude des nombres de 1 à 12','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p2.html',2,30,'','[]','[]','2026-01-27 22:28:52.581190','2026-01-27 22:28:52.581230',62),
(319,'Mathématiques CP1 : étude des nombres de 13 à 20','Mathématiques CP1 : étude des nombres de 13 à 20','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p3.html',3,30,'','[]','[]','2026-01-27 22:28:52.586691','2026-01-27 22:28:52.586744',62),
(320,'Fiches de mathématiques CP2 : 0 à 49','Fiches de mathématiques CP2 : 0 à 49','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p1.html',4,30,'','[]','[]','2026-01-27 22:28:52.591463','2026-01-27 22:28:52.591505',62),
(321,'Fiches de mathématiques CP2 : 50 à 90','Fiches de mathématiques CP2 : 50 à 90','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p2.html',5,30,'','[]','[]','2026-01-27 22:28:52.596353','2026-01-27 22:28:52.596413',62),
(322,'Fiches de mathématiques CP2 : 91 à 100','Fiches de mathématiques CP2 : 91 à 100','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p3.html',6,30,'','[]','[]','2026-01-27 22:28:52.601511','2026-01-27 22:28:52.601552',62),
(323,'Fiches de mathématiques CP1','Fiches de mathématiques CP1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-inclusives/fiches-api-inclusives-maths-cp1.html',7,30,'','[]','[]','2026-01-27 22:28:52.605682','2026-01-27 22:28:52.605721',62),
(324,'Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-cp1-exporale4.html',1,30,'','[]','[]','2026-01-27 22:28:52.627794','2026-01-27 22:28:52.627835',63),
(325,'Lecture CP1 : voyelles composées aux articulations','Lecture CP1 : voyelles composées aux articulations','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-lecture-cp1-vcomposees-articulations.html',2,30,'','[]','[]','2026-01-27 22:28:52.632510','2026-01-27 22:28:52.632550',63),
(326,'Fiches expression orale CP2 : partie 1','Fiches expression orale CP2 : partie 1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p1.html',3,30,'','[]','[]','2026-01-27 22:28:52.636546','2026-01-27 22:28:52.636605',63),
(327,'Fiches expression orale CP2 : partie 2','Fiches expression orale CP2 : partie 2','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p2.html',4,30,'','[]','[]','2026-01-27 22:28:52.640136','2026-01-27 22:28:52.640174',63),
(328,'Fiches expression orale CP2 : partie 3','Fiches expression orale CP2 : partie 3','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p3.html',5,30,'','[]','[]','2026-01-27 22:28:52.643737','2026-01-27 22:28:52.643778',63),
(329,'Mathématiques CP1 : vocabulaire mathématiques','Mathématiques CP1 : vocabulaire mathématiques','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p1.html',1,30,'','[]','[]','2026-01-27 22:28:52.661216','2026-01-27 22:28:52.661256',64),
(330,'Mathématiques CP1 : étude des nombres de 1 à 12','Mathématiques CP1 : étude des nombres de 1 à 12','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p2.html',2,30,'','[]','[]','2026-01-27 22:28:52.665043','2026-01-27 22:28:52.665083',64),
(331,'Mathématiques CP1 : étude des nombres de 13 à 20','Mathématiques CP1 : étude des nombres de 13 à 20','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p3.html',3,30,'','[]','[]','2026-01-27 22:28:52.669382','2026-01-27 22:28:52.669424',64),
(332,'Fiches de mathématiques CP2 : 0 à 49','Fiches de mathématiques CP2 : 0 à 49','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p1.html',4,30,'','[]','[]','2026-01-27 22:28:52.673735','2026-01-27 22:28:52.673774',64),
(333,'Fiches de mathématiques CP2 : 50 à 90','Fiches de mathématiques CP2 : 50 à 90','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p2.html',5,30,'','[]','[]','2026-01-27 22:28:52.677337','2026-01-27 22:28:52.677376',64),
(334,'Fiches de mathématiques CP2 : 91 à 100','Fiches de mathématiques CP2 : 91 à 100','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p3.html',6,30,'','[]','[]','2026-01-27 22:28:52.681033','2026-01-27 22:28:52.681073',64),
(335,'Fiches de mathématiques CP1','Fiches de mathématiques CP1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-inclusives/fiches-api-inclusives-maths-cp1.html',7,30,'','[]','[]','2026-01-27 22:28:52.685157','2026-01-27 22:28:52.685211',64),
(336,'Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-cp1-exporale4.html',1,30,'','[]','[]','2026-01-27 22:28:52.712542','2026-01-27 22:28:52.712583',65),
(337,'Lecture CP1 : voyelles composées aux articulations','Lecture CP1 : voyelles composées aux articulations','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-lecture-cp1-vcomposees-articulations.html',2,30,'','[]','[]','2026-01-27 22:28:52.716829','2026-01-27 22:28:52.716887',65),
(338,'Fiches expression orale CP2 : partie 1','Fiches expression orale CP2 : partie 1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p1.html',3,30,'','[]','[]','2026-01-27 22:28:52.721956','2026-01-27 22:28:52.722016',65),
(339,'Fiches expression orale CP2 : partie 2','Fiches expression orale CP2 : partie 2','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p2.html',4,30,'','[]','[]','2026-01-27 22:28:52.727577','2026-01-27 22:28:52.727663',65),
(340,'Fiches expression orale CP2 : partie 3','Fiches expression orale CP2 : partie 3','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p3.html',5,30,'','[]','[]','2026-01-27 22:28:52.732726','2026-01-27 22:28:52.732785',65),
(341,'Mathématiques CP1 : vocabulaire mathématiques','Mathématiques CP1 : vocabulaire mathématiques','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p1.html',1,30,'','[]','[]','2026-01-27 22:28:52.755833','2026-01-27 22:28:52.755890',66),
(342,'Mathématiques CP1 : étude des nombres de 1 à 12','Mathématiques CP1 : étude des nombres de 1 à 12','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p2.html',2,30,'','[]','[]','2026-01-27 22:28:52.760797','2026-01-27 22:28:52.760841',66),
(343,'Mathématiques CP1 : étude des nombres de 13 à 20','Mathématiques CP1 : étude des nombres de 13 à 20','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p3.html',3,30,'','[]','[]','2026-01-27 22:28:52.764876','2026-01-27 22:28:52.764916',66),
(344,'Fiches de mathématiques CP2 : 0 à 49','Fiches de mathématiques CP2 : 0 à 49','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p1.html',4,30,'','[]','[]','2026-01-27 22:28:52.769437','2026-01-27 22:28:52.769479',66),
(345,'Fiches de mathématiques CP2 : 50 à 90','Fiches de mathématiques CP2 : 50 à 90','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p2.html',5,30,'','[]','[]','2026-01-27 22:28:52.773339','2026-01-27 22:28:52.773380',66),
(346,'Fiches de mathématiques CP2 : 91 à 100','Fiches de mathématiques CP2 : 91 à 100','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p3.html',6,30,'','[]','[]','2026-01-27 22:28:52.777919','2026-01-27 22:28:52.777974',66),
(347,'Fiches de mathématiques CP1','Fiches de mathématiques CP1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-inclusives/fiches-api-inclusives-maths-cp1.html',7,30,'','[]','[]','2026-01-27 22:28:52.785863','2026-01-27 22:28:52.785918',66),
(348,'Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-cp1-exporale4.html',1,30,'','[]','[]','2026-01-27 22:28:52.814616','2026-01-27 22:28:52.814693',67),
(349,'Lecture CP1 : voyelles composées aux articulations','Lecture CP1 : voyelles composées aux articulations','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-lecture-cp1-vcomposees-articulations.html',2,30,'','[]','[]','2026-01-27 22:28:52.820010','2026-01-27 22:28:52.820073',67),
(350,'Fiches expression orale CP2 : partie 1','Fiches expression orale CP2 : partie 1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p1.html',3,30,'','[]','[]','2026-01-27 22:28:52.824993','2026-01-27 22:28:52.825056',67),
(351,'Fiches expression orale CP2 : partie 2','Fiches expression orale CP2 : partie 2','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p2.html',4,30,'','[]','[]','2026-01-27 22:28:52.829761','2026-01-27 22:28:52.829815',67),
(352,'Fiches expression orale CP2 : partie 3','Fiches expression orale CP2 : partie 3','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p3.html',5,30,'','[]','[]','2026-01-27 22:28:52.835223','2026-01-27 22:28:52.835309',67),
(353,'Mathématiques CP1 : vocabulaire mathématiques','Mathématiques CP1 : vocabulaire mathématiques','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p1.html',1,30,'','[]','[]','2026-01-27 22:28:52.860220','2026-01-27 22:28:52.860277',68),
(354,'Mathématiques CP1 : étude des nombres de 1 à 12','Mathématiques CP1 : étude des nombres de 1 à 12','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p2.html',2,30,'','[]','[]','2026-01-27 22:28:52.865023','2026-01-27 22:28:52.865087',68),
(355,'Mathématiques CP1 : étude des nombres de 13 à 20','Mathématiques CP1 : étude des nombres de 13 à 20','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-maths-cp1-p3.html',3,30,'','[]','[]','2026-01-27 22:28:52.870331','2026-01-27 22:28:52.870377',68),
(356,'Fiches de mathématiques CP2 : 0 à 49','Fiches de mathématiques CP2 : 0 à 49','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p1.html',4,30,'','[]','[]','2026-01-27 22:28:52.873909','2026-01-27 22:28:52.873954',68),
(357,'Fiches de mathématiques CP2 : 50 à 90','Fiches de mathématiques CP2 : 50 à 90','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p2.html',5,30,'','[]','[]','2026-01-27 22:28:52.877714','2026-01-27 22:28:52.877759',68),
(358,'Fiches de mathématiques CP2 : 91 à 100','Fiches de mathématiques CP2 : 91 à 100','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-maths-cp2-p3.html',6,30,'','[]','[]','2026-01-27 22:28:52.885159','2026-01-27 22:28:52.885205',68),
(359,'Fiches de mathématiques CP1','Fiches de mathématiques CP1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-inclusives/fiches-api-inclusives-maths-cp1.html',7,30,'','[]','[]','2026-01-27 22:28:52.888842','2026-01-27 22:28:52.888888',68),
(360,'Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Expression orale CP1 : des différentes parties du corps humain aux objets de la maison','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-api-cp1-exporale4.html',1,30,'','[]','[]','2026-01-27 22:28:52.912396','2026-01-27 22:28:52.912435',69),
(361,'Lecture CP1 : voyelles composées aux articulations','Lecture CP1 : voyelles composées aux articulations','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp1/fiches-lecture-cp1-vcomposees-articulations.html',2,30,'','[]','[]','2026-01-27 22:28:52.916453','2026-01-27 22:28:52.916524',69),
(362,'Fiches expression orale CP2 : partie 1','Fiches expression orale CP2 : partie 1','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p1.html',3,30,'','[]','[]','2026-01-27 22:28:52.920962','2026-01-27 22:28:52.921014',69),
(363,'Fiches expression orale CP2 : partie 2','Fiches expression orale CP2 : partie 2','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p2.html',4,30,'','[]','[]','2026-01-27 22:28:52.924944','2026-01-27 22:28:52.924989',69),
(364,'Fiches expression orale CP2 : partie 3','Fiches expression orale CP2 : partie 3','Source FASO: /espace-enseignants/fiches-aide-preparation/fiches-api-cp2/fiches-api-expression-orale-cp2-p3.html',5,30,'','[]','[]','2026-01-27 22:28:52.928882','2026-01-27 22:28:52.928923',69),
(401,'Le Roman et le récit','Analyse du roman et de ses formes.','<h1>Le Roman et le récit</h1><p>Analyse du roman et de ses formes.</p><p>Contenu du cours pour la classe de Terminale.</p>',1,60,'','[]','[]','2026-01-31 00:55:37.369718','2026-01-31 00:55:37.369755',75),
(402,'La Poésie','Étude des textes poétiques du XIXe au XXIe siècle.','<h1>La Poésie</h1><p>Étude des textes poétiques du XIXe au XXIe siècle.</p><p>Contenu du cours pour la classe de Terminale.</p>',2,60,'','[]','[]','2026-01-31 00:55:37.371156','2026-01-31 00:55:37.371183',75),
(403,'Le Théâtre','Le texte théâtral et sa représentation.','<h1>Le Théâtre</h1><p>Le texte théâtral et sa représentation.</p><p>Contenu du cours pour la classe de Terminale.</p>',3,60,'','[]','[]','2026-01-31 00:55:37.372477','2026-01-31 00:55:37.372503',75),
(404,'La Littérature d\'idées','Presse, débat et argumentation.','<h1>La Littérature d\'idées</h1><p>Presse, débat et argumentation.</p><p>Contenu du cours pour la classe de Terminale.</p>',4,60,'','[]','[]','2026-01-31 00:55:37.373718','2026-01-31 00:55:37.373744',75),
(405,'Méthodologie du commentaire','Techniques du commentaire de texte.','<h1>Méthodologie du commentaire</h1><p>Techniques du commentaire de texte.</p><p>Contenu du cours pour la classe de Terminale.</p>',5,60,'','[]','[]','2026-01-31 00:55:37.375018','2026-01-31 00:55:37.375048',75),
(406,'Méthodologie de la dissertation','Techniques de la dissertation littéraire.','<h1>Méthodologie de la dissertation</h1><p>Techniques de la dissertation littéraire.</p><p>Contenu du cours pour la classe de Terminale.</p>',6,60,'','[]','[]','2026-01-31 00:55:37.376539','2026-01-31 00:55:37.376596',75),
(407,'Limites et Continuité','Étude des limites de fonctions et continuité.','<h1>Limites et Continuité</h1><p>Étude des limites de fonctions et continuité.</p><p>Contenu du cours pour la classe de Terminale.</p>',1,60,'','[]','[]','2026-01-31 00:55:37.386904','2026-01-31 00:55:37.386945',74),
(408,'Dérivation et études de fonctions','Calculs de dérivées et variations.','<h1>Dérivation et études de fonctions</h1><p>Calculs de dérivées et variations.</p><p>Contenu du cours pour la classe de Terminale.</p>',2,60,'','[]','[]','2026-01-31 00:55:37.388308','2026-01-31 00:55:37.388352',74),
(409,'Nombres complexes','Introduction aux nombres complexes.','<h1>Nombres complexes</h1><p>Introduction aux nombres complexes.</p><p>Contenu du cours pour la classe de Terminale.</p>',3,60,'','[]','[]','2026-01-31 00:55:37.389846','2026-01-31 00:55:37.389875',74),
(410,'Fonctions logarithmes et exponentielles','Étude des fonctions ln et exp.','<h1>Fonctions logarithmes et exponentielles</h1><p>Étude des fonctions ln et exp.</p><p>Contenu du cours pour la classe de Terminale.</p>',4,60,'','[]','[]','2026-01-31 00:55:37.391187','2026-01-31 00:55:37.391228',74),
(411,'Intégration','Calcul intégral et primitives.','<h1>Intégration</h1><p>Calcul intégral et primitives.</p><p>Contenu du cours pour la classe de Terminale.</p>',5,60,'','[]','[]','2026-01-31 00:55:37.392953','2026-01-31 00:55:37.392999',74),
(412,'Probabilités','Lois de probabilité et statistiques.','<h1>Probabilités</h1><p>Lois de probabilité et statistiques.</p><p>Contenu du cours pour la classe de Terminale.</p>',6,60,'','[]','[]','2026-01-31 00:55:37.394538','2026-01-31 00:55:37.394570',74),
(413,'Chapitre 1: Programme de Première','Introduction au programme de Français.','<h1>Chapitre 1: Programme de Première</h1><p>Introduction au programme de Français.</p>',1,55,'','[]','[]','2026-01-31 00:55:37.405067','2026-01-31 00:55:37.405098',73),
(414,'Chapitre 2: Notions avancées','Développement des compétences.','<h1>Chapitre 2: Notions avancées</h1><p>Développement des compétences.</p>',2,55,'','[]','[]','2026-01-31 00:55:37.406378','2026-01-31 00:55:37.406406',73),
(415,'Chapitre 3: Exercices pratiques','Mise en application des connaissances.','<h1>Chapitre 3: Exercices pratiques</h1><p>Mise en application des connaissances.</p>',3,55,'','[]','[]','2026-01-31 00:55:37.407642','2026-01-31 00:55:37.407670',73),
(416,'Chapitre 1: Programme de Première','Introduction au programme de Mathématiques.','<h1>Chapitre 1: Programme de Première</h1><p>Introduction au programme de Mathématiques.</p>',1,55,'','[]','[]','2026-01-31 00:55:37.415874','2026-01-31 00:55:37.415905',72),
(417,'Chapitre 2: Notions avancées','Développement des compétences.','<h1>Chapitre 2: Notions avancées</h1><p>Développement des compétences.</p>',2,55,'','[]','[]','2026-01-31 00:55:37.417234','2026-01-31 00:55:37.417261',72),
(418,'Chapitre 3: Exercices pratiques','Mise en application des connaissances.','<h1>Chapitre 3: Exercices pratiques</h1><p>Mise en application des connaissances.</p>',3,55,'','[]','[]','2026-01-31 00:55:37.418580','2026-01-31 00:55:37.418608',72),
(419,'Chapitre 1: Programme de Seconde','Introduction au programme de Français.','<h1>Chapitre 1: Programme de Seconde</h1><p>Introduction au programme de Français.</p>',1,55,'','[]','[]','2026-01-31 00:55:37.426906','2026-01-31 00:55:37.426938',71),
(420,'Chapitre 2: Notions avancées','Développement des compétences.','<h1>Chapitre 2: Notions avancées</h1><p>Développement des compétences.</p>',2,55,'','[]','[]','2026-01-31 00:55:37.428247','2026-01-31 00:55:37.428275',71),
(421,'Chapitre 3: Exercices pratiques','Mise en application des connaissances.','<h1>Chapitre 3: Exercices pratiques</h1><p>Mise en application des connaissances.</p>',3,55,'','[]','[]','2026-01-31 00:55:37.429506','2026-01-31 00:55:37.429534',71),
(422,'Chapitre 1: Programme de Seconde','Introduction au programme de Mathématiques.','<h1>Chapitre 1: Programme de Seconde</h1><p>Introduction au programme de Mathématiques.</p>',1,55,'','[]','[]','2026-01-31 00:55:37.437868','2026-01-31 00:55:37.437902',70),
(423,'Chapitre 2: Notions avancées','Développement des compétences.','<h1>Chapitre 2: Notions avancées</h1><p>Développement des compétences.</p>',2,55,'','[]','[]','2026-01-31 00:55:37.439520','2026-01-31 00:55:37.439554',70),
(424,'Chapitre 3: Exercices pratiques','Mise en application des connaissances.','<h1>Chapitre 3: Exercices pratiques</h1><p>Mise en application des connaissances.</p>',3,55,'','[]','[]','2026-01-31 00:55:37.441276','2026-01-31 00:55:37.441310',70);
/*!40000 ALTER TABLE `courses_lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses_subject`
--

DROP TABLE IF EXISTS `courses_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses_subject` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` longtext NOT NULL,
  `icon` varchar(50) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses_subject`
--

LOCK TABLES `courses_subject` WRITE;
/*!40000 ALTER TABLE `courses_subject` DISABLE KEYS */;
INSERT INTO `courses_subject` VALUES
(1,'Mathématiques','math','Cours de Mathématiques','','2026-01-27 22:14:01.559897','2026-01-27 22:14:01.559939'),
(2,'Français','french','Cours de Français','','2026-01-27 22:14:01.562475','2026-01-27 22:14:01.562505'),
(3,'Sciences','science','Cours de Sciences','','2026-01-27 22:14:01.565319','2026-01-27 22:14:01.565347'),
(4,'Anglais','english','Cours de Anglais','','2026-01-27 22:14:01.567612','2026-01-27 22:14:01.567657'),
(5,'Histoire','history','Cours de Histoire','','2026-01-27 22:14:01.570056','2026-01-27 22:14:01.570087'),
(6,'Géographie','geography','Cours de Géographie','','2026-01-27 22:14:01.572516','2026-01-27 22:14:01.572547');
/*!40000 ALTER TABLE `courses_subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_users_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES
(1,'admin','logentry'),
(2,'auth','group'),
(3,'auth','permission'),
(4,'contenttypes','contenttype'),
(10,'courses','course'),
(11,'courses','courseenrollment'),
(12,'courses','lesson'),
(13,'courses','subject'),
(14,'exercises','exercise'),
(15,'exercises','exerciseattempt'),
(16,'exercises','exercisecategory'),
(17,'exercises','quiz'),
(18,'exercises','quizattempt'),
(19,'progress','achievement'),
(20,'progress','learningpath'),
(21,'progress','lessonprogress'),
(22,'progress','performanceanalysis'),
(23,'progress','studentachievement'),
(24,'recommendations','adaptiverecommendationengine'),
(25,'recommendations','contentrecommendation'),
(26,'recommendations','erroranalysis'),
(27,'recommendations','intelligentrevisionitem'),
(28,'recommendations','learningstyleprofile'),
(29,'recommendations','mlmodelversion'),
(30,'recommendations','modelevaluation'),
(31,'recommendations','modelpredictioncache'),
(32,'recommendations','recommendationfeedback'),
(33,'recommendations','smartexplanation'),
(34,'recommendations','traininglog'),
(5,'sessions','session'),
(6,'users','notification'),
(7,'users','studentprofile'),
(8,'users','teacherprofile'),
(9,'users','user');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES
(1,'contenttypes','0001_initial','2026-01-27 22:13:08.170180'),
(2,'contenttypes','0002_remove_content_type_name','2026-01-27 22:13:08.192124'),
(3,'auth','0001_initial','2026-01-27 22:13:08.265305'),
(4,'auth','0002_alter_permission_name_max_length','2026-01-27 22:13:08.279257'),
(5,'auth','0003_alter_user_email_max_length','2026-01-27 22:13:08.286663'),
(6,'auth','0004_alter_user_username_opts','2026-01-27 22:13:08.296702'),
(7,'auth','0005_alter_user_last_login_null','2026-01-27 22:13:08.305486'),
(8,'auth','0006_require_contenttypes_0002','2026-01-27 22:13:08.307062'),
(9,'auth','0007_alter_validators_add_error_messages','2026-01-27 22:13:08.315273'),
(10,'auth','0008_alter_user_username_max_length','2026-01-27 22:13:08.322235'),
(11,'auth','0009_alter_user_last_name_max_length','2026-01-27 22:13:08.328886'),
(12,'auth','0010_alter_group_name_max_length','2026-01-27 22:13:08.340175'),
(13,'auth','0011_update_proxy_permissions','2026-01-27 22:13:08.347834'),
(14,'auth','0012_alter_user_first_name_max_length','2026-01-27 22:13:08.356360'),
(15,'users','0001_initial','2026-01-27 22:13:08.530211'),
(16,'admin','0001_initial','2026-01-27 22:13:08.575316'),
(17,'admin','0002_logentry_remove_auto_add','2026-01-27 22:13:08.591060'),
(18,'admin','0003_logentry_add_action_flag_choices','2026-01-27 22:13:08.609858'),
(19,'courses','0001_initial','2026-01-27 22:13:08.762029'),
(20,'exercises','0001_initial','2026-01-27 22:13:08.989453'),
(21,'progress','0001_initial','2026-01-27 22:13:09.412674'),
(22,'recommendations','0001_initial','2026-01-27 22:13:10.670562'),
(23,'sessions','0001_initial','2026-01-27 22:13:10.697787'),
(24,'courses','0002_alter_course_level','2026-01-31 00:40:28.364868');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises_exercise`
--

DROP TABLE IF EXISTS `exercises_exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises_exercise` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `question` longtext NOT NULL,
  `type` varchar(20) NOT NULL,
  `difficulty` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `estimated_time_minutes` int(11) NOT NULL,
  `correct_answer` longtext NOT NULL,
  `explanation` longtext NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`options`)),
  `hints` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`hints`)),
  `order` int(10) unsigned NOT NULL CHECK (`order` >= 0),
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `lesson_id` bigint(20) NOT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exercises_exercise_lesson_id_cf1a3ebf_fk_courses_lesson_id` (`lesson_id`),
  KEY `exercises_exercise_category_id_1dc10060_fk_exercises` (`category_id`),
  CONSTRAINT `exercises_exercise_category_id_1dc10060_fk_exercises` FOREIGN KEY (`category_id`) REFERENCES `exercises_exercisecategory` (`id`),
  CONSTRAINT `exercises_exercise_lesson_id_cf1a3ebf_fk_courses_lesson_id` FOREIGN KEY (`lesson_id`) REFERENCES `courses_lesson` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises_exercise`
--

LOCK TABLES `exercises_exercise` WRITE;
/*!40000 ALTER TABLE `exercises_exercise` DISABLE KEYS */;
INSERT INTO `exercises_exercise` VALUES
(1,'Exercice 1 - Leçon 1: Mathématiques - Module 1','Exercice de pratique 1','Question 1 du module Leçon 1: Mathématiques - Module 1?','short_answer',1,10,5,'Réponse correcte 1','Explication pour la question 1','[]','[]',0,1,'2026-01-27 22:15:25.533019','2026-01-27 22:15:25.533058',1,2),
(2,'Exercice 2 - Leçon 1: Mathématiques - Module 1','Exercice de pratique 2','Question 2 du module Leçon 1: Mathématiques - Module 1?','short_answer',2,20,5,'Réponse correcte 2','Explication pour la question 2','[]','[]',0,1,'2026-01-27 22:15:25.536333','2026-01-27 22:15:25.536364',1,3),
(3,'Exercice 3 - Leçon 1: Mathématiques - Module 1','Exercice de pratique 3','Question 3 du module Leçon 1: Mathématiques - Module 1?','short_answer',3,30,5,'Réponse correcte 3','Explication pour la question 3','[]','[]',0,1,'2026-01-27 22:15:25.539219','2026-01-27 22:15:25.539249',1,1),
(4,'Exercice 1 - Leçon 1: Mathématiques - Module 1','Exercice de pratique 1','Question 1 du module Leçon 1: Mathématiques - Module 1?','short_answer',1,10,5,'Réponse correcte 1','Explication pour la question 1','[]','[]',0,1,'2026-01-27 22:15:25.542562','2026-01-27 22:15:25.542591',4,2),
(5,'Exercice 2 - Leçon 1: Mathématiques - Module 1','Exercice de pratique 2','Question 2 du module Leçon 1: Mathématiques - Module 1?','short_answer',2,20,5,'Réponse correcte 2','Explication pour la question 2','[]','[]',0,1,'2026-01-27 22:15:25.545355','2026-01-27 22:15:25.545386',4,3),
(6,'Exercice 3 - Leçon 1: Mathématiques - Module 1','Exercice de pratique 3','Question 3 du module Leçon 1: Mathématiques - Module 1?','short_answer',3,30,5,'Réponse correcte 3','Explication pour la question 3','[]','[]',0,1,'2026-01-27 22:15:25.548703','2026-01-27 22:15:25.548735',4,1),
(7,'Exercice 1 - Leçon 1: Mathématiques - Module 1','Exercice de pratique 1','Question 1 du module Leçon 1: Mathématiques - Module 1?','short_answer',1,10,5,'Réponse correcte 1','Explication pour la question 1','[]','[]',0,1,'2026-01-27 22:15:25.551835','2026-01-27 22:15:25.551870',7,2),
(8,'Exercice 2 - Leçon 1: Mathématiques - Module 1','Exercice de pratique 2','Question 2 du module Leçon 1: Mathématiques - Module 1?','short_answer',2,20,5,'Réponse correcte 2','Explication pour la question 2','[]','[]',0,1,'2026-01-27 22:15:25.554883','2026-01-27 22:15:25.554912',7,3),
(9,'Exercice 3 - Leçon 1: Mathématiques - Module 1','Exercice de pratique 3','Question 3 du module Leçon 1: Mathématiques - Module 1?','short_answer',3,30,5,'Réponse correcte 3','Explication pour la question 3','[]','[]',0,1,'2026-01-27 22:15:25.557825','2026-01-27 22:15:25.557855',7,1),
(10,'Exercice 1 - Leçon 1: Français - Module 1','Exercice de pratique 1','Question 1 du module Leçon 1: Français - Module 1?','short_answer',1,10,5,'Réponse correcte 1','Explication pour la question 1','[]','[]',0,1,'2026-01-27 22:15:25.560810','2026-01-27 22:15:25.560840',10,2),
(11,'Exercice 2 - Leçon 1: Français - Module 1','Exercice de pratique 2','Question 2 du module Leçon 1: Français - Module 1?','short_answer',2,20,5,'Réponse correcte 2','Explication pour la question 2','[]','[]',0,1,'2026-01-27 22:15:25.563712','2026-01-27 22:15:25.563744',10,3),
(12,'Exercice 3 - Leçon 1: Français - Module 1','Exercice de pratique 3','Question 3 du module Leçon 1: Français - Module 1?','short_answer',3,30,5,'Réponse correcte 3','Explication pour la question 3','[]','[]',0,1,'2026-01-27 22:15:25.567333','2026-01-27 22:15:25.567366',10,1),
(13,'Exercice 1 - Leçon 1: Français - Module 1','Exercice de pratique 1','Question 1 du module Leçon 1: Français - Module 1?','short_answer',1,10,5,'Réponse correcte 1','Explication pour la question 1','[]','[]',0,1,'2026-01-27 22:15:25.570529','2026-01-27 22:15:25.570562',13,2),
(14,'Exercice 2 - Leçon 1: Français - Module 1','Exercice de pratique 2','Question 2 du module Leçon 1: Français - Module 1?','short_answer',2,20,5,'Réponse correcte 2','Explication pour la question 2','[]','[]',0,1,'2026-01-27 22:15:25.573518','2026-01-27 22:15:25.573546',13,3),
(15,'Exercice 3 - Leçon 1: Français - Module 1','Exercice de pratique 3','Question 3 du module Leçon 1: Français - Module 1?','short_answer',3,30,5,'Réponse correcte 3','Explication pour la question 3','[]','[]',0,1,'2026-01-27 22:15:25.576426','2026-01-27 22:15:25.576459',13,1),
(28,'Cycle de l\'eau en climat sahélien','Explique l\'importance de la pluie au Burkina Faso','Décris les différentes étapes du cycle de l\'eau spécifique au Sahel','essay',2,20,5,'Évaporation, condensation, précipitation, infiltration, ruissellement','','[]','[]',0,1,'2026-01-27 22:25:23.019124','2026-01-27 22:25:23.019176',22,9),
(29,'Les royaumes Mossi','Questions sur les anciens royaumes du Burkina','Quels sont les trois principaux royaumes Mossi historiques?','multiple_choice',1,10,5,'Ouagadougou, Bobo-Dioulasso, Gourma','','[]','[]',0,1,'2026-01-27 22:25:23.033530','2026-01-27 22:25:23.033579',167,10),
(30,'Positions géographiques des villes','Situe les villes principales sur une carte','Localise Ouagadougou, Bobo-Dioulasso, Gaoua et Dori','matching',1,10,5,'Centre, Ouest, Sud-ouest, Nord','','[]','[]',0,1,'2026-01-27 22:25:23.047961','2026-01-27 22:25:23.048007',170,11);
/*!40000 ALTER TABLE `exercises_exercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises_exerciseattempt`
--

DROP TABLE IF EXISTS `exercises_exerciseattempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises_exerciseattempt` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `status` varchar(20) NOT NULL,
  `student_answer` longtext NOT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `time_spent_seconds` int(11) NOT NULL,
  `hints_used` int(11) NOT NULL,
  `feedback` longtext NOT NULL,
  `started_at` datetime(6) NOT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `graded_at` datetime(6) DEFAULT NULL,
  `exercise_id` bigint(20) NOT NULL,
  `graded_by_id` bigint(20) DEFAULT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `exercises_exerciseat_exercise_id_21526ace_fk_exercises` (`exercise_id`),
  KEY `exercises_exerciseattempt_graded_by_id_fa90e08f_fk_users_user_id` (`graded_by_id`),
  KEY `exercises_exerciseattempt_student_id_931b85ba_fk_users_user_id` (`student_id`),
  CONSTRAINT `exercises_exerciseat_exercise_id_21526ace_fk_exercises` FOREIGN KEY (`exercise_id`) REFERENCES `exercises_exercise` (`id`),
  CONSTRAINT `exercises_exerciseattempt_graded_by_id_fa90e08f_fk_users_user_id` FOREIGN KEY (`graded_by_id`) REFERENCES `users_user` (`id`),
  CONSTRAINT `exercises_exerciseattempt_student_id_931b85ba_fk_users_user_id` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises_exerciseattempt`
--

LOCK TABLES `exercises_exerciseattempt` WRITE;
/*!40000 ALTER TABLE `exercises_exerciseattempt` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercises_exerciseattempt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises_exercisecategory`
--

DROP TABLE IF EXISTS `exercises_exercisecategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises_exercisecategory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises_exercisecategory`
--

LOCK TABLES `exercises_exercisecategory` WRITE;
/*!40000 ALTER TABLE `exercises_exercisecategory` DISABLE KEYS */;
INSERT INTO `exercises_exercisecategory` VALUES
(1,'QCM',''),
(2,'Réponse courte',''),
(3,'Essai',''),
(4,'math','Exercices de math'),
(5,'french','Exercices de french'),
(6,'science','Exercices de science'),
(7,'Pratique - Mathématiques','Exercices pratiques de Mathématiques'),
(8,'Pratique - Français','Exercices pratiques de Français'),
(9,'Pratique - Sciences','Exercices pratiques de Sciences'),
(10,'Pratique - Histoire','Exercices pratiques de Histoire'),
(11,'Pratique - Géographie','Exercices pratiques de Géographie');
/*!40000 ALTER TABLE `exercises_exercisecategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises_quiz`
--

DROP TABLE IF EXISTS `exercises_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises_quiz` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `passing_score` int(11) NOT NULL,
  `time_limit_minutes` int(11) DEFAULT NULL,
  `is_mandatory` tinyint(1) NOT NULL,
  `allow_retake` tinyint(1) NOT NULL,
  `max_attempts` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `lesson_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `exercises_quiz_lesson_id_658ff9cf_fk_courses_lesson_id` (`lesson_id`),
  CONSTRAINT `exercises_quiz_lesson_id_658ff9cf_fk_courses_lesson_id` FOREIGN KEY (`lesson_id`) REFERENCES `courses_lesson` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises_quiz`
--

LOCK TABLES `exercises_quiz` WRITE;
/*!40000 ALTER TABLE `exercises_quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercises_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises_quizattempt`
--

DROP TABLE IF EXISTS `exercises_quizattempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises_quizattempt` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `status` varchar(20) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `percentage` double DEFAULT NULL,
  `passed` tinyint(1) DEFAULT NULL,
  `time_spent_seconds` int(11) NOT NULL,
  `started_at` datetime(6) NOT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `quiz_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `exercises_quizattempt_quiz_id_22c4d5a2_fk_exercises_quiz_id` (`quiz_id`),
  KEY `exercises_quizattempt_student_id_26b0ad60_fk_users_user_id` (`student_id`),
  CONSTRAINT `exercises_quizattempt_quiz_id_22c4d5a2_fk_exercises_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `exercises_quiz` (`id`),
  CONSTRAINT `exercises_quizattempt_student_id_26b0ad60_fk_users_user_id` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises_quizattempt`
--

LOCK TABLES `exercises_quizattempt` WRITE;
/*!40000 ALTER TABLE `exercises_quizattempt` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercises_quizattempt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress_achievement`
--

DROP TABLE IF EXISTS `progress_achievement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress_achievement` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `category` varchar(20) NOT NULL,
  `badge_image` varchar(100) NOT NULL,
  `condition_rule` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`condition_rule`)),
  `points_reward` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress_achievement`
--

LOCK TABLES `progress_achievement` WRITE;
/*!40000 ALTER TABLE `progress_achievement` DISABLE KEYS */;
/*!40000 ALTER TABLE `progress_achievement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress_learningpath`
--

DROP TABLE IF EXISTS `progress_learningpath`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress_learningpath` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `current_level` varchar(20) NOT NULL,
  `courses_completed` int(11) NOT NULL,
  `lessons_completed` int(11) NOT NULL,
  `exercises_completed` int(11) NOT NULL,
  `total_study_time_seconds` bigint(20) NOT NULL,
  `average_score` double NOT NULL,
  `last_learning_date` date DEFAULT NULL,
  `learning_streak_days` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`),
  CONSTRAINT `progress_learningpath_student_id_9c1eba4f_fk_users_user_id` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress_learningpath`
--

LOCK TABLES `progress_learningpath` WRITE;
/*!40000 ALTER TABLE `progress_learningpath` DISABLE KEYS */;
INSERT INTO `progress_learningpath` VALUES
(1,'',0,0,0,0,0,NULL,0,'2026-01-27 23:09:23.958793','2026-01-27 23:09:23.958993',2);
/*!40000 ALTER TABLE `progress_learningpath` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress_lessonprogress`
--

DROP TABLE IF EXISTS `progress_lessonprogress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress_lessonprogress` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `status` varchar(20) NOT NULL,
  `progress_percentage` double NOT NULL,
  `exercises_completed` int(11) NOT NULL,
  `exercises_correct` int(11) NOT NULL,
  `average_exercise_score` double NOT NULL,
  `time_spent_seconds` int(11) NOT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `last_accessed` datetime(6) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `lesson_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `progress_lessonprogress_student_id_lesson_id_f1568439_uniq` (`student_id`,`lesson_id`),
  KEY `progress_lessonprogress_lesson_id_703d9f2e_fk_courses_lesson_id` (`lesson_id`),
  CONSTRAINT `progress_lessonprogress_lesson_id_703d9f2e_fk_courses_lesson_id` FOREIGN KEY (`lesson_id`) REFERENCES `courses_lesson` (`id`),
  CONSTRAINT `progress_lessonprogress_student_id_6e3a3a1e_fk_users_user_id` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress_lessonprogress`
--

LOCK TABLES `progress_lessonprogress` WRITE;
/*!40000 ALTER TABLE `progress_lessonprogress` DISABLE KEYS */;
/*!40000 ALTER TABLE `progress_lessonprogress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress_performanceanalysis`
--

DROP TABLE IF EXISTS `progress_performanceanalysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress_performanceanalysis` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `analysis_date` date NOT NULL,
  `overall_score` double NOT NULL,
  `subjects_scores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`subjects_scores`)),
  `strengths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`strengths`)),
  `weaknesses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`weaknesses`)),
  `recommendations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`recommendations`)),
  `suggested_focus_areas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`suggested_focus_areas`)),
  `improvement_trends` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`improvement_trends`)),
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `progress_performance_student_id_06494d15_fk_users_use` (`student_id`),
  CONSTRAINT `progress_performance_student_id_06494d15_fk_users_use` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress_performanceanalysis`
--

LOCK TABLES `progress_performanceanalysis` WRITE;
/*!40000 ALTER TABLE `progress_performanceanalysis` DISABLE KEYS */;
/*!40000 ALTER TABLE `progress_performanceanalysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress_studentachievement`
--

DROP TABLE IF EXISTS `progress_studentachievement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress_studentachievement` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `earned_at` datetime(6) NOT NULL,
  `achievement_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `progress_studentachievem_student_id_achievement_i_87c68c87_uniq` (`student_id`,`achievement_id`),
  KEY `progress_studentachi_achievement_id_baf1d0ad_fk_progress_` (`achievement_id`),
  CONSTRAINT `progress_studentachi_achievement_id_baf1d0ad_fk_progress_` FOREIGN KEY (`achievement_id`) REFERENCES `progress_achievement` (`id`),
  CONSTRAINT `progress_studentachievement_student_id_064ce97b_fk_users_user_id` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress_studentachievement`
--

LOCK TABLES `progress_studentachievement` WRITE;
/*!40000 ALTER TABLE `progress_studentachievement` DISABLE KEYS */;
/*!40000 ALTER TABLE `progress_studentachievement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations_adaptiverecommendationengine`
--

DROP TABLE IF EXISTS `recommendations_adaptiverecommendationengine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations_adaptiverecommendationengine` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `performance_weight` double NOT NULL,
  `interest_weight` double NOT NULL,
  `learning_style_weight` double NOT NULL,
  `engagement_weight` double NOT NULL,
  `recommendation_frequency_hours` int(11) NOT NULL,
  `max_recommendations_per_session` int(11) NOT NULL,
  `algorithm_version` varchar(50) NOT NULL,
  `last_recommendation_generated` datetime(6) DEFAULT NULL,
  `total_recommendations_generated` int(11) NOT NULL,
  `average_recommendation_quality` double NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`),
  CONSTRAINT `recommendations_adap_student_id_cc3f5fb3_fk_users_use` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations_adaptiverecommendationengine`
--

LOCK TABLES `recommendations_adaptiverecommendationengine` WRITE;
/*!40000 ALTER TABLE `recommendations_adaptiverecommendationengine` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations_adaptiverecommendationengine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations_contentrecommendation`
--

DROP TABLE IF EXISTS `recommendations_contentrecommendation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations_contentrecommendation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content_type` varchar(20) NOT NULL,
  `content_id` int(11) NOT NULL,
  `content_title` varchar(255) NOT NULL,
  `confidence_score` double NOT NULL,
  `reason` longtext NOT NULL,
  `recommendation_factors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`recommendation_factors`)),
  `is_viewed` tinyint(1) NOT NULL,
  `is_accepted` tinyint(1) NOT NULL,
  `user_rating` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `viewed_at` datetime(6) DEFAULT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recommendat_student_5afb16_idx` (`student_id`,`created_at` DESC),
  KEY `recommendat_student_ce48bb_idx` (`student_id`,`is_viewed`),
  CONSTRAINT `recommendations_cont_student_id_81946193_fk_users_use` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations_contentrecommendation`
--

LOCK TABLES `recommendations_contentrecommendation` WRITE;
/*!40000 ALTER TABLE `recommendations_contentrecommendation` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations_contentrecommendation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations_erroranalysis`
--

DROP TABLE IF EXISTS `recommendations_erroranalysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations_erroranalysis` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `error_type` varchar(20) NOT NULL,
  `concept_involved` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `student_answer` longtext NOT NULL,
  `correct_answer` longtext NOT NULL,
  `concept_understanding_level` varchar(20) NOT NULL,
  `misconception_identified` longtext NOT NULL,
  `root_cause` longtext NOT NULL,
  `partial_credit` double NOT NULL,
  `suggested_topics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`suggested_topics`)),
  `similar_past_errors` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `exercise_id` bigint(20) NOT NULL,
  `exercise_attempt_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recommendat_student_0abed2_idx` (`student_id`,`created_at` DESC),
  KEY `recommendat_error_t_72202c_idx` (`error_type`),
  KEY `recommendations_erro_exercise_id_0359b1b7_fk_exercises` (`exercise_id`),
  KEY `recommendations_erro_exercise_attempt_id_66f9038b_fk_exercises` (`exercise_attempt_id`),
  CONSTRAINT `recommendations_erro_exercise_attempt_id_66f9038b_fk_exercises` FOREIGN KEY (`exercise_attempt_id`) REFERENCES `exercises_exerciseattempt` (`id`),
  CONSTRAINT `recommendations_erro_exercise_id_0359b1b7_fk_exercises` FOREIGN KEY (`exercise_id`) REFERENCES `exercises_exercise` (`id`),
  CONSTRAINT `recommendations_erro_student_id_1c35af2b_fk_users_use` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations_erroranalysis`
--

LOCK TABLES `recommendations_erroranalysis` WRITE;
/*!40000 ALTER TABLE `recommendations_erroranalysis` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations_erroranalysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations_intelligentrevisionitem`
--

DROP TABLE IF EXISTS `recommendations_intelligentrevisionitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations_intelligentrevisionitem` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `concept` varchar(255) NOT NULL,
  `reason` longtext NOT NULL,
  `priority_score` double NOT NULL,
  `error_count` int(11) NOT NULL,
  `last_error` datetime(6) DEFAULT NULL,
  `related_exercises` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`related_exercises`)),
  `related_lessons` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`related_lessons`)),
  `custom_tips` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`custom_tips`)),
  `status` varchar(20) NOT NULL,
  `revision_attempts` int(11) NOT NULL,
  `mastery_score` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `recommendations_intellig_student_id_concept_8a2920a8_uniq` (`student_id`,`concept`),
  KEY `recommendat_student_c999c2_idx` (`student_id`,`status`),
  KEY `recommendat_priorit_e95e63_idx` (`priority_score` DESC),
  CONSTRAINT `recommendations_inte_student_id_1e1a3a99_fk_users_use` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations_intelligentrevisionitem`
--

LOCK TABLES `recommendations_intelligentrevisionitem` WRITE;
/*!40000 ALTER TABLE `recommendations_intelligentrevisionitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations_intelligentrevisionitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations_learningstyleprofile`
--

DROP TABLE IF EXISTS `recommendations_learningstyleprofile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations_learningstyleprofile` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `primary_style` varchar(20) NOT NULL,
  `secondary_style` varchar(20) NOT NULL,
  `visual_preference` double NOT NULL,
  `auditory_preference` double NOT NULL,
  `kinesthetic_preference` double NOT NULL,
  `reading_writing_preference` double NOT NULL,
  `pace_preference` double NOT NULL,
  `difficulty_preference` int(11) NOT NULL,
  `last_updated` datetime(6) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`),
  CONSTRAINT `recommendations_lear_student_id_e29d1f20_fk_users_use` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations_learningstyleprofile`
--

LOCK TABLES `recommendations_learningstyleprofile` WRITE;
/*!40000 ALTER TABLE `recommendations_learningstyleprofile` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations_learningstyleprofile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations_mlmodelversion`
--

DROP TABLE IF EXISTS `recommendations_mlmodelversion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations_mlmodelversion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `model_type` varchar(50) NOT NULL,
  `version` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `accuracy` double DEFAULT NULL,
  `precision` double DEFAULT NULL,
  `recall` double DEFAULT NULL,
  `f1_score` double DEFAULT NULL,
  `rmse` double DEFAULT NULL,
  `mae` double DEFAULT NULL,
  `r2` double DEFAULT NULL,
  `training_samples` int(11) NOT NULL,
  `training_duration_seconds` int(11) NOT NULL,
  `feature_count` int(11) NOT NULL,
  `hyperparameters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`hyperparameters`)),
  `model_path` varchar(255) NOT NULL,
  `scaler_path` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `trained_at` datetime(6) DEFAULT NULL,
  `deployed_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `recommendat_model_t_de7c0e_idx` (`model_type`,`trained_at` DESC),
  KEY `recommendat_status_a0c04e_idx` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations_mlmodelversion`
--

LOCK TABLES `recommendations_mlmodelversion` WRITE;
/*!40000 ALTER TABLE `recommendations_mlmodelversion` DISABLE KEYS */;
INSERT INTO `recommendations_mlmodelversion` VALUES
(5,'recommendation','2.0.0_gb','failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,'{\"n_estimators\": 200, \"learning_rate\": 0.08, \"max_depth\": 7, \"min_samples_split\": 5, \"min_samples_leaf\": 2, \"subsample\": 0.8, \"random_state\": 42}','','','2026-01-27 22:29:59.217793',NULL,NULL),
(6,'recommendation','2.0.0_rf','failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,'{\"n_estimators\": 300, \"max_depth\": 15, \"min_samples_split\": 5, \"min_samples_leaf\": 2, \"random_state\": 42, \"n_jobs\": -1}','','','2026-01-27 22:29:59.237026',NULL,NULL),
(7,'correction','20260131_011111','training_complete',0.8421052631578947,0.6756756756756757,0.8928571428571429,0.7692307692307693,NULL,NULL,NULL,445,0,0,'{\"train_samples\": 445, \"model\": \"RandomForest\"}','/home/tanou/Bur/projetWeb/intelligent_tutor/trained_models/correction_20260131_011111.pkl','/home/tanou/Bur/projetWeb/intelligent_tutor/trained_models/correction_vectorizer_20260131_011111.pkl','2026-01-31 01:11:11.813891','2026-01-31 01:11:11.809355',NULL),
(8,'error_analysis','20260131_011121','training_complete',0.8526315789473684,0.899640768588137,0.8526315789473684,0.8637048079592284,NULL,NULL,NULL,445,0,0,'{\"train_samples\": 445, \"model\": \"GradientBoosting\"}','/home/tanou/Bur/projetWeb/intelligent_tutor/trained_models/error_analysis_20260131_011121.pkl','/home/tanou/Bur/projetWeb/intelligent_tutor/trained_models/error_analysis_vectorizer_20260131_011121.pkl','2026-01-31 01:11:21.954423','2026-01-31 01:11:21.952990',NULL),
(9,'correction','1_011233','training_complete',0.8421052631578947,0.6756756756756757,0.8928571428571429,0.7692307692307693,NULL,NULL,NULL,445,0,0,'{\"train_samples\": 445, \"model\": \"RandomForest\"}','/home/tanou/Bur/projetWeb/intelligent_tutor/trained_models/correction_20260131_011233.pkl','/home/tanou/Bur/projetWeb/intelligent_tutor/trained_models/correction_vectorizer_20260131_011233.pkl','2026-01-31 01:12:33.232246','2026-01-31 01:12:33.230759',NULL),
(10,'error_analysis','1_011238','training_complete',0.8526315789473684,0.899640768588137,0.8526315789473684,0.8637048079592284,NULL,NULL,NULL,445,0,0,'{\"train_samples\": 445, \"model\": \"GradientBoosting\"}','/home/tanou/Bur/projetWeb/intelligent_tutor/trained_models/error_analysis_20260131_011238.pkl','/home/tanou/Bur/projetWeb/intelligent_tutor/trained_models/error_analysis_vectorizer_20260131_011238.pkl','2026-01-31 01:12:38.868576','2026-01-31 01:12:38.866884',NULL);
/*!40000 ALTER TABLE `recommendations_mlmodelversion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations_modelevaluation`
--

DROP TABLE IF EXISTS `recommendations_modelevaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations_modelevaluation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `test_set_size` int(11) NOT NULL,
  `test_set_percentage` double NOT NULL,
  `confusion_matrix` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`confusion_matrix`)),
  `class_report` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`class_report`)),
  `residuals_mean` double DEFAULT NULL,
  `residuals_std` double DEFAULT NULL,
  `cv_scores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`cv_scores`)),
  `cv_mean` double DEFAULT NULL,
  `cv_std` double DEFAULT NULL,
  `feature_importance` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`feature_importance`)),
  `shap_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`shap_values`)),
  `evaluated_at` datetime(6) NOT NULL,
  `model_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `model_id` (`model_id`),
  CONSTRAINT `recommendations_mode_model_id_30040234_fk_recommend` FOREIGN KEY (`model_id`) REFERENCES `recommendations_mlmodelversion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations_modelevaluation`
--

LOCK TABLES `recommendations_modelevaluation` WRITE;
/*!40000 ALTER TABLE `recommendations_modelevaluation` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations_modelevaluation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations_modelpredictioncache`
--

DROP TABLE IF EXISTS `recommendations_modelpredictioncache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations_modelpredictioncache` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `input_hash` varchar(64) NOT NULL,
  `prediction` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`prediction`)),
  `confidence` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `model_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `recommendations_modelpre_model_id_input_hash_9cb93904_uniq` (`model_id`,`input_hash`),
  KEY `recommendat_input_h_393a1c_idx` (`input_hash`,`expires_at`),
  KEY `recommendations_modelpredictioncache_input_hash_85409d5a` (`input_hash`),
  CONSTRAINT `recommendations_mode_model_id_7469a514_fk_recommend` FOREIGN KEY (`model_id`) REFERENCES `recommendations_mlmodelversion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations_modelpredictioncache`
--

LOCK TABLES `recommendations_modelpredictioncache` WRITE;
/*!40000 ALTER TABLE `recommendations_modelpredictioncache` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations_modelpredictioncache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations_recommendationfeedback`
--

DROP TABLE IF EXISTS `recommendations_recommendationfeedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations_recommendationfeedback` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `feedback_type` varchar(20) NOT NULL,
  `comment` longtext NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `recommendation_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recommendations_reco_recommendation_id_bbfb4c1f_fk_recommend` (`recommendation_id`),
  CONSTRAINT `recommendations_reco_recommendation_id_bbfb4c1f_fk_recommend` FOREIGN KEY (`recommendation_id`) REFERENCES `recommendations_contentrecommendation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations_recommendationfeedback`
--

LOCK TABLES `recommendations_recommendationfeedback` WRITE;
/*!40000 ALTER TABLE `recommendations_recommendationfeedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations_recommendationfeedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations_smartexplanation`
--

DROP TABLE IF EXISTS `recommendations_smartexplanation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations_smartexplanation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `explanation_type` varchar(20) NOT NULL,
  `content` longtext NOT NULL,
  `is_interactive` tinyint(1) NOT NULL,
  `uses_examples` tinyint(1) NOT NULL,
  `uses_analogies` tinyint(1) NOT NULL,
  `student_rating` int(11) DEFAULT NULL,
  `was_helpful` tinyint(1) DEFAULT NULL,
  `follow_up_score` double DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `viewed_at` datetime(6) DEFAULT NULL,
  `exercise_attempt_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recommendat_student_d77b2f_idx` (`student_id`,`created_at` DESC),
  KEY `recommendat_explana_9df2ed_idx` (`explanation_type`),
  KEY `recommendations_smar_exercise_attempt_id_c7d45d25_fk_exercises` (`exercise_attempt_id`),
  CONSTRAINT `recommendations_smar_exercise_attempt_id_c7d45d25_fk_exercises` FOREIGN KEY (`exercise_attempt_id`) REFERENCES `exercises_exerciseattempt` (`id`),
  CONSTRAINT `recommendations_smar_student_id_bc566113_fk_users_use` FOREIGN KEY (`student_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations_smartexplanation`
--

LOCK TABLES `recommendations_smartexplanation` WRITE;
/*!40000 ALTER TABLE `recommendations_smartexplanation` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations_smartexplanation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations_traininglog`
--

DROP TABLE IF EXISTS `recommendations_traininglog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations_traininglog` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `epoch` int(11) NOT NULL,
  `loss` double DEFAULT NULL,
  `val_loss` double DEFAULT NULL,
  `metrics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`metrics`)),
  `timestamp` datetime(6) NOT NULL,
  `model_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recommendations_trai_model_id_6e637876_fk_recommend` (`model_id`),
  CONSTRAINT `recommendations_trai_model_id_6e637876_fk_recommend` FOREIGN KEY (`model_id`) REFERENCES `recommendations_mlmodelversion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations_traininglog`
--

LOCK TABLES `recommendations_traininglog` WRITE;
/*!40000 ALTER TABLE `recommendations_traininglog` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations_traininglog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_notification`
--

DROP TABLE IF EXISTS `users_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_notification` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` longtext NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `created_at` datetime(6) NOT NULL,
  `read_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_notification_user_id_fed360c8_fk_users_user_id` (`user_id`),
  CONSTRAINT `users_notification_user_id_fed360c8_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_notification`
--

LOCK TABLES `users_notification` WRITE;
/*!40000 ALTER TABLE `users_notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_studentprofile`
--

DROP TABLE IF EXISTS `users_studentprofile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_studentprofile` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `learning_style` varchar(50) NOT NULL,
  `interests` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`interests`)),
  `learning_speed` double NOT NULL,
  `total_study_hours` double NOT NULL,
  `last_activity` datetime(6) DEFAULT NULL,
  `strengths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`strengths`)),
  `weaknesses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`weaknesses`)),
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `users_studentprofile_user_id_d0e95184_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_studentprofile`
--

LOCK TABLES `users_studentprofile` WRITE;
/*!40000 ALTER TABLE `users_studentprofile` DISABLE KEYS */;
INSERT INTO `users_studentprofile` VALUES
(1,'','[]',1,0,NULL,'[]','[]','2026-01-27 22:37:31.698752','2026-01-27 22:37:31.698840',7),
(2,'','[]',1,0,NULL,'[]','[]','2026-01-27 22:39:26.707798','2026-01-27 22:39:26.707938',8),
(3,'','[]',1,0,NULL,'[]','[]','2026-01-31 00:34:08.532383','2026-01-31 00:34:08.532414',9);
/*!40000 ALTER TABLE `users_studentprofile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_teacherprofile`
--

DROP TABLE IF EXISTS `users_teacherprofile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_teacherprofile` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `specialization` varchar(100) NOT NULL,
  `qualification` longtext NOT NULL,
  `experience_years` int(11) NOT NULL,
  `is_verified_teacher` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `users_teacherprofile_user_id_976ceafc_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_teacherprofile`
--

LOCK TABLES `users_teacherprofile` WRITE;
/*!40000 ALTER TABLE `users_teacherprofile` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_teacherprofile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user`
--

DROP TABLE IF EXISTS `users_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `email` varchar(254) NOT NULL,
  `role` varchar(20) NOT NULL,
  `level` varchar(20) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `profile_image` varchar(100) DEFAULT NULL,
  `bio` longtext NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `last_login_ip` char(39) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user`
--

LOCK TABLES `users_user` WRITE;
/*!40000 ALTER TABLE `users_user` DISABLE KEYS */;
INSERT INTO `users_user` VALUES
(1,'pbkdf2_sha256$1200000$HYrJVe93gnLNg1qxiKnkrQ$IoIREZ1PVHiame9+WP/f1yTrg964qoyR7JXk1dqFPNk=',NULL,1,'admin@example.com','Admin','System',1,'2026-01-27 22:16:39.809197','admin@example.com','admin',NULL,'','','',NULL,0,NULL,1,'2026-01-27 22:16:40.814288','2026-01-27 22:16:40.867576'),
(2,'pbkdf2_sha256$1200000$pvgzRBUk4SJseuXgZxvwn2$Nid7VCiaobyNt+1mMCYEZSg2Yk5yuYn6MSBI5gpzOjU=',NULL,0,'student1@example.com','Ahmed','Hassan',0,'2026-01-27 22:16:40.870299','student1@example.com','student',NULL,'','','',NULL,0,NULL,1,'2026-01-27 22:16:41.875451','2026-01-27 22:16:41.886889'),
(3,'pbkdf2_sha256$1200000$6OItO1QWE0kxnflEuM1nwZ$/AM6IvatCiel1ZgdkdDJR5rSIa7HKEOVVOJbbsWnYEA=',NULL,0,'student2@example.com','Fatima','Diallo',0,'2026-01-27 22:16:41.889180','student2@example.com','student',NULL,'','','',NULL,0,NULL,1,'2026-01-27 22:16:42.914262','2026-01-27 22:16:42.925941'),
(4,'pbkdf2_sha256$1200000$7ZaKDVLroRaqR13RyBPFWc$O0pJkM1iWFwGJrRa83BNYQ81dYNXTtMnKDscuUpQ9Hs=',NULL,0,'student3@example.com','Moussa','Toure',0,'2026-01-27 22:16:42.928386','student3@example.com','student',NULL,'','','',NULL,0,NULL,1,'2026-01-27 22:16:43.897703','2026-01-27 22:16:43.909556'),
(5,'pbkdf2_sha256$1200000$2Kvf2kneSK7NhCwGCbo7JP$n2Lm1KRoufdL5u5En0PWP9AzaIv4n9TdYJLIMq4ZnvE=',NULL,0,'student4@example.com','Aïcha','Ba',0,'2026-01-27 22:16:43.912312','student4@example.com','student',NULL,'','','',NULL,0,NULL,1,'2026-01-27 22:16:44.884907','2026-01-27 22:16:44.896927'),
(6,'pbkdf2_sha256$1200000$g3moywyJG4kUfwOO41bglK$OUEUEzcs6dOsMR52dsMV0CqvQUc1Fm74VgKB2ghqniA=',NULL,0,'student5@example.com','Ismail','Sow',0,'2026-01-27 22:16:44.899528','student5@example.com','student',NULL,'','','',NULL,0,NULL,1,'2026-01-27 22:16:45.856543','2026-01-27 22:16:45.866548'),
(7,'pbkdf2_sha256$1200000$oGnNANfBhCdx4IcSoSWto8$zw6ivMSJqNUhGg7VbgyfzPjTS5F5qzNVF4iGvUyeyZY=',NULL,0,'tester@test.com','Test','User',0,'2026-01-27 22:37:29.353741','tester@test.com','student','primary_cm1','','','',NULL,0,NULL,1,'2026-01-27 22:37:31.658161','2026-01-27 22:37:31.658182'),
(8,'pbkdf2_sha256$1200000$gRjNAfJJJATwdX83d6RQMz$GoW9nXz0xEBWQtQPAZjwoj1A56lniMWkGcfJAFT6So0=',NULL,0,'nouveau_user@test.com','Nouveau','User',0,'2026-01-27 22:39:23.787377','nouveau_user@test.com','student','primary_cm1','+2260123456','','',NULL,0,NULL,1,'2026-01-27 22:39:26.666554','2026-01-27 22:39:26.666595'),
(9,'pbkdf2_sha256$1200000$bRyHY41yu6MQdUVJXoJOvs$NEZjuVegL5Vvsmd4KCqyVXMQ+wpYpuQlRUoa19adiQg=',NULL,0,'tanou@gmail.com','Nour','Tanou',0,'2026-01-31 00:34:07.425623','tanou@gmail.com','student','lycee_tles','08000000','','',NULL,0,NULL,1,'2026-01-31 00:34:08.508020','2026-01-31 00:34:08.508052');
/*!40000 ALTER TABLE `users_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_groups`
--

DROP TABLE IF EXISTS `users_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_groups_user_id_group_id_b88eab82_uniq` (`user_id`,`group_id`),
  KEY `users_user_groups_group_id_9afc8d0e_fk_auth_group_id` (`group_id`),
  CONSTRAINT `users_user_groups_group_id_9afc8d0e_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `users_user_groups_user_id_5f6f5a90_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_groups`
--

LOCK TABLES `users_user_groups` WRITE;
/*!40000 ALTER TABLE `users_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_user_permissions`
--

DROP TABLE IF EXISTS `users_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_user_permissions_user_id_permission_id_43338c45_uniq` (`user_id`,`permission_id`),
  KEY `users_user_user_perm_permission_id_0b93982e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `users_user_user_perm_permission_id_0b93982e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `users_user_user_permissions_user_id_20aca447_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_user_permissions`
--

LOCK TABLES `users_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `users_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-31  1:19:53
