-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 13, 2022 at 01:58 AM
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

-- --------------------------------------------------------

--
-- Table structure for table `flims_comments`
--

CREATE TABLE `flims_comments` (
  `comment_id` int(11) NOT NULL,
  `flim_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `descriptation` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '0-->Active 1-->Deleted',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `parent_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `flims_comments`
--

INSERT INTO `flims_comments` (`comment_id`, `flim_id`, `user_id`, `descriptation`, `status`, `created_date`, `parent_id`) VALUES
(1, 4, 1, 'nice movie  after so many days i wll laugh seeing this movie', 0, '2022-01-09 05:49:55', 0),
(2, 4, 1, 'nice movie  after so many days i wll laugh seeing this movie', 0, '2022-01-12 11:02:28', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(200) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '0-->Active,1-->Deleted',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `email`, `password`, `status`, `created_date`) VALUES
(1, 'john', 'beginners4rock@gmail.com', '$2a$10$R.Nh5KaJhFpSVkj.DywsPObRY2VVQt421TX/PRMW1Ls3A2I/cEe72', 0, '2022-01-09 04:31:46'),
(2, 'John', 'mukesh@gmail.com', '$2a$10$mFQbzXWrhbk2oYuovIivluOTmEI2.ri5G851/rZXqOdCmVK2L1kH6', 0, '2022-01-09 11:32:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `flims`
--
ALTER TABLE `flims`
  ADD PRIMARY KEY (`flim_id`);

--
-- Indexes for table `flims_comments`
--
ALTER TABLE `flims_comments`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `flims`
--
ALTER TABLE `flims`
  MODIFY `flim_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `flims_comments`
--
ALTER TABLE `flims_comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
