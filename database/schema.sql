-- Student Management System Database Schema
-- Database: gestion_etudiants

CREATE DATABASE IF NOT EXISTS `gestion_etudiants` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gestion_etudiants`;

-- Table structure for table `etudiant`
DROP TABLE IF EXISTS `etudiant`;
CREATE TABLE `etudiant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL UNIQUE,
  `tel` varchar(15) NOT NULL,
  `date_naissance` date NOT NULL,
  `filiere` varchar(100) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nom` (`nom`),
  KEY `idx_filiere` (`filiere`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for testing
INSERT INTO `etudiant` (`nom`, `prenom`, `email`, `tel`, `date_naissance`, `filiere`) VALUES
('Alami', 'Ahmed', 'ahmed.alami@example.com', '0612345678', '2000-01-15', 'Informatique'),
('Benali', 'Fatima', 'fatima.benali@example.com', '0623456789', '1999-05-20', 'Mathématiques'),
('Cherkaoui', 'Omar', 'omar.cherkaoui@example.com', '0634567890', '2001-03-10', 'Physique'),
('Idrissi', 'Aisha', 'aisha.idrissi@example.com', '0645678901', '2000-08-25', 'Informatique'),
('Tazi', 'Youssef', 'youssef.tazi@example.com', '0656789012', '1998-12-05', 'Économie');
