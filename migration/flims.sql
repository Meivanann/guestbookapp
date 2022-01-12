-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 12, 2022 at 07:07 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dfx_flims`
--

-- --------------------------------------------------------

--
-- Table structure for table `flims`
--

CREATE TABLE `flims` (
  `flim_id` int(11) NOT NULL,
  `flim_name` varchar(500) NOT NULL,
  `descripation` text NOT NULL,
  `rating` int(20) NOT NULL,
  `relase_date` varchar(255) NOT NULL,
  `ticket_price` int(20) NOT NULL,
  `country` varchar(250) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `flim_slug_name` text NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '0-->Active1--Deleted'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `flims`
--

INSERT INTO `flims` (`flim_id`, `flim_name`, `descripation`, `rating`, `relase_date`, `ticket_price`, `country`, `genre`, `flim_slug_name`, `image_path`, `create_date`, `status`) VALUES
(3, 'mukar', 'When Thors evil brother, Loki (Tom Hiddleston), gains access to the unlimited power of the energy cube called the Tesseract, Nick Fury (Samuel L. Jackson), director of S.H.I.E.L.D.,', 5, '2022-01-30', 200, 'India', 'action', 'mukar', 'uploads/flim_image.jpg,uploads/flim_image.png', '2022-01-09 05:28:42', 0),
(4, 'avergers', 'When Thors evil brother, Loki (Tom Hiddleston), gains access to the unlimited power of the energy cube called the Tesseract, Nick Fury (Samuel L. Jackson), director of S.H.I.E.L.D.,', 5, '2022-01-30', 200, 'India', 'action', 'avergers', 'uploads/flim_image.jpg,uploads/flim_image.png', '2022-01-09 05:41:03', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `flims`
--
ALTER TABLE `flims`
  ADD PRIMARY KEY (`flim_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `flims`
--
ALTER TABLE `flims`
  MODIFY `flim_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
