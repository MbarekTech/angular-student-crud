-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 14, 2025 at 12:18 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestion_etudiants`
--

-- --------------------------------------------------------

--
-- Table structure for table `etudiant`
--

DROP TABLE IF EXISTS `etudiant`;
CREATE TABLE IF NOT EXISTS `etudiant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `tel` varchar(15) NOT NULL,
  `date_naissance` date NOT NULL,
  `filiere` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `tel` (`tel`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `etudiant`
--

INSERT INTO `etudiant` (`id`, `nom`, `prenom`, `email`, `tel`, `date_naissance`, `filiere`) VALUES
(2, 'Mbarek', 'Ben', 'mbarek.ben@mail.local', '0615545679', '2000-01-15', 'Informatique'),
(3, 'Ali', 'Mohamed', 'ali.mohamed@mail.local', '0612345678', '2000-01-15', 'Informatique'),
(4, 'Fatima', 'Zahra', 'fatima.zahra@mail.local', '0698765432', '1999-05-22', 'Mathématiques'),
(5, 'Youssef', 'Ahmed', 'youssef.ahmed@mail.local', '0611223344', '2001-08-30', 'Physique'),
(6, 'Layla', 'Sara', 'layla.sara@mail.local', '0655667788', '2002-03-10', 'Chimie'),
(7, 'Khaled', 'Omar', 'khaled.omar@mail.local', '0699887766', '2000-11-25', 'Biologie'),
(8, 'Amine', 'Hassan', 'amine.hassan@mail.local', '0611223345', '2001-07-12', 'Informatique'),
(9, 'Nadia', 'Khalil', 'nadia.khalil@mail.local', '0699887767', '2000-09-18', 'Mathématiques'),
(10, 'Karim', 'Said', 'karim.said@mail.local', '0655667789', '2002-04-20', 'Physique'),
(11, 'Samira', 'Rachid', 'samira.rachid@mail.local', '0612345679', '1999-12-05', 'Chimie'),
(12, 'Hicham', 'Yassin', 'hicham.yassin@mail.local', '0698765433', '2001-03-25', 'Biologie'),
(13, 'Leila', 'Moussa', 'leila.moussa@mail.local', '0611223346', '2000-06-30', 'Informatique'),
(14, 'Omar', 'Fares', 'omar.fares@mail.local', '0699887768', '2002-08-15', 'Mathématiques'),
(15, 'Sanaa', 'Tarik', 'sanaa.tarik@mail.local', '0655667790', '2001-11-10', 'Physique');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
