-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 05, 2020 at 10:29 AM
-- Server version: 5.7.28-0ubuntu0.18.04.4
-- PHP Version: 7.2.24-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `patient`
--

-- --------------------------------------------------------

--
-- Table structure for table `app_informations`
--

CREATE TABLE `app_informations` (
  `id` int(11) NOT NULL,
  `key` varchar(128) NOT NULL DEFAULT '',
  `value` text NOT NULL,
  `created` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `licenses`
--

CREATE TABLE `licenses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `licenses_name` varchar(50) NOT NULL DEFAULT '',
  `first_name` varchar(128) NOT NULL DEFAULT '',
  `last_name` varchar(128) NOT NULL DEFAULT '',
  `dob` varchar(16) NOT NULL DEFAULT '',
  `place_birth` varchar(50) NOT NULL DEFAULT '',
  `release_date` varchar(50) NOT NULL DEFAULT '',
  `expiry_date` int(11) NOT NULL DEFAULT '0',
  `licenses_image` varchar(50) NOT NULL DEFAULT '',
  `license_number` varchar(128) NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `created` int(11) NOT NULL,
  `modified` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT '',
  `email` varchar(128) NOT NULL DEFAULT '',
  `tax_code` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(40) NOT NULL DEFAULT '',
  `profile` varchar(50) NOT NULL DEFAULT '',
  `authorization_key` varchar(40) NOT NULL DEFAULT '',
  `device_type` tinyint(1) NOT NULL DEFAULT '1',
  `device_token` varchar(255) NOT NULL DEFAULT '',
  `otp` int(5) NOT NULL DEFAULT '0',
  `last_login` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created` int(11) NOT NULL,
  `modified` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_informations`
--
ALTER TABLE `app_informations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `licenses`
--
ALTER TABLE `licenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `app_informations`
--
ALTER TABLE `app_informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `licenses`
--
ALTER TABLE `licenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
