-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2026 at 09:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hell_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `username`, `password`) VALUES
(1, 'Admin', '1234'),
(2, 'admin01', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `name`) VALUES
(1, 'อาหารจานหลัก'),
(2, 'ก๋วยเตี๋ยว'),
(3, 'ของทานเล่น'),
(4, 'เครื่องดื่ม'),
(5, 'ของหวาน');

-- --------------------------------------------------------

--
-- Table structure for table `cooks`
--

CREATE TABLE `cooks` (
  `cook_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('ACTIVE','DISABLED') DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cooks`
--

INSERT INTO `cooks` (`cook_id`, `username`, `password`, `status`) VALUES
(1, 'Cook', '1234', 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `menu_id` int(11) NOT NULL,
  `name_menu` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('AVAILABLE','UNAVAILABLE') DEFAULT 'AVAILABLE',
  `category_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`menu_id`, `name_menu`, `price`, `image_url`, `status`, `category_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(21, 'ก๋วยเตี๋ยวหมูน้ำใส', 50.00, 'https://images.unsplash.com/photo-1604908176997-431c7e6a1c89', 'AVAILABLE', 2, '2026-03-30 19:49:24', '2026-03-30 19:53:16', NULL),
(22, 'ก๋วยเตี๋ยวต้มยำหมู', 60.00, 'https://images.unsplash.com/photo-1604908176997-431c7e6a1c89', 'AVAILABLE', 2, '2026-03-30 19:49:24', '2026-03-30 19:53:16', NULL),
(23, 'ก๋วยเตี๋ยวเนื้อเปื่อย', 70.00, 'https://images.unsplash.com/photo-1604908176997-431c7e6a1c89', 'AVAILABLE', 2, '2026-03-30 19:49:24', '2026-03-30 19:53:16', NULL),
(24, 'เย็นตาโฟ', 65.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'AVAILABLE', 2, '2026-03-30 19:49:24', '2026-03-30 19:53:16', NULL),
(25, 'ข้าวกะเพราหมูไข่ดาว', 55.00, 'https://images.unsplash.com/photo-1604909052743-94e838986d24', 'AVAILABLE', 1, '2026-03-30 19:49:43', '2026-03-30 19:53:16', NULL),
(26, 'ข้าวผัดทะเล', 65.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'AVAILABLE', 1, '2026-03-30 19:49:43', '2026-03-30 19:53:16', NULL),
(27, 'ข้าวหมูทอดกระเทียม', 60.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'AVAILABLE', 1, '2026-03-30 19:49:43', '2026-03-30 19:53:16', NULL),
(28, 'ข้าวมันไก่', 50.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'AVAILABLE', 1, '2026-03-30 19:49:43', '2026-03-30 19:53:16', NULL),
(29, 'เฟรนช์ฟรายส์', 39.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349', 'AVAILABLE', 3, '2026-03-30 19:50:13', '2026-03-30 19:53:16', NULL),
(30, 'นักเก็ตไก่', 49.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'AVAILABLE', 3, '2026-03-30 19:50:13', '2026-03-30 19:53:16', NULL),
(31, 'ปีกไก่ทอด', 59.00, 'https://images.unsplash.com/photo-1562967916-eb82221dfb36', 'AVAILABLE', 3, '2026-03-30 19:50:13', '2026-03-30 19:53:16', NULL),
(32, 'ไส้กรอกทอด', 45.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'AVAILABLE', 3, '2026-03-30 19:50:13', '2026-03-30 19:53:16', NULL),
(33, 'ชาเย็น', 30.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699', 'AVAILABLE', 4, '2026-03-30 19:50:33', '2026-03-30 19:53:16', NULL),
(34, 'กาแฟเย็น', 35.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'AVAILABLE', 4, '2026-03-30 19:50:33', '2026-03-30 19:53:16', NULL),
(35, 'โกโก้เย็น', 35.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'AVAILABLE', 4, '2026-03-30 19:50:33', '2026-03-30 19:53:16', NULL),
(36, 'น้ำมะนาวโซดา', 30.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'AVAILABLE', 4, '2026-03-30 19:50:33', '2026-03-30 19:53:16', NULL);

--
-- Triggers `menu`
--
DELIMITER $$
CREATE TRIGGER `trg_check_price` BEFORE INSERT ON `menu` FOR EACH ROW BEGIN
  IF NEW.price <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Invalid price';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_check_price_update` BEFORE UPDATE ON `menu` FOR EACH ROW BEGIN
  IF NEW.price <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Invalid price';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `menu_option`
--

CREATE TABLE `menu_option` (
  `option_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_option`
--

INSERT INTO `menu_option` (`option_id`, `menu_id`, `name`) VALUES
(43, 21, 'ขนาด'),
(28, 21, 'ระดับความเผ็ด'),
(44, 22, 'ขนาด'),
(29, 22, 'ระดับความเผ็ด'),
(45, 23, 'ขนาด'),
(30, 23, 'ระดับความเผ็ด'),
(46, 24, 'ขนาด'),
(31, 24, 'ระดับความเผ็ด'),
(39, 25, 'ขนาด'),
(24, 25, 'ระดับความเผ็ด'),
(40, 26, 'ขนาด'),
(25, 26, 'ระดับความเผ็ด'),
(41, 27, 'ขนาด'),
(26, 27, 'ระดับความเผ็ด'),
(42, 28, 'ขนาด'),
(27, 28, 'ระดับความเผ็ด'),
(54, 29, 'ซอส'),
(55, 30, 'ซอส'),
(56, 31, 'ซอส'),
(57, 32, 'ซอส'),
(61, 33, 'ความหวาน'),
(62, 34, 'ความหวาน'),
(63, 35, 'ความหวาน'),
(64, 36, 'ความหวาน');

-- --------------------------------------------------------

--
-- Table structure for table `menu_option_value`
--

CREATE TABLE `menu_option_value` (
  `value_id` int(11) NOT NULL,
  `option_id` int(11) NOT NULL,
  `value` varchar(100) NOT NULL,
  `price_add` decimal(10,2) DEFAULT 0.00,
  `is_default` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_option_value`
--

INSERT INTO `menu_option_value` (`value_id`, `option_id`, `value`, `price_add`, `is_default`) VALUES
(52, 28, 'ไม่เผ็ด', 0.00, 0),
(53, 29, 'ไม่เผ็ด', 0.00, 0),
(54, 30, 'ไม่เผ็ด', 0.00, 0),
(55, 31, 'ไม่เผ็ด', 0.00, 0),
(56, 24, 'ไม่เผ็ด', 0.00, 0),
(57, 25, 'ไม่เผ็ด', 0.00, 0),
(58, 26, 'ไม่เผ็ด', 0.00, 0),
(59, 27, 'ไม่เผ็ด', 0.00, 0),
(67, 28, 'เผ็ดน้อย', 0.00, 0),
(68, 29, 'เผ็ดน้อย', 0.00, 0),
(69, 30, 'เผ็ดน้อย', 0.00, 0),
(70, 31, 'เผ็ดน้อย', 0.00, 0),
(71, 24, 'เผ็ดน้อย', 0.00, 0),
(72, 25, 'เผ็ดน้อย', 0.00, 0),
(73, 26, 'เผ็ดน้อย', 0.00, 0),
(74, 27, 'เผ็ดน้อย', 0.00, 0),
(82, 28, 'เผ็ดมาก', 0.00, 0),
(83, 29, 'เผ็ดมาก', 0.00, 0),
(84, 30, 'เผ็ดมาก', 0.00, 0),
(85, 31, 'เผ็ดมาก', 0.00, 0),
(86, 24, 'เผ็ดมาก', 0.00, 0),
(87, 25, 'เผ็ดมาก', 0.00, 0),
(88, 26, 'เผ็ดมาก', 0.00, 0),
(89, 27, 'เผ็ดมาก', 0.00, 0),
(97, 43, 'ธรรมดา', 0.00, 1),
(98, 44, 'ธรรมดา', 0.00, 1),
(99, 45, 'ธรรมดา', 0.00, 1),
(100, 46, 'ธรรมดา', 0.00, 1),
(101, 39, 'ธรรมดา', 0.00, 1),
(102, 40, 'ธรรมดา', 0.00, 1),
(103, 41, 'ธรรมดา', 0.00, 1),
(104, 42, 'ธรรมดา', 0.00, 1),
(112, 43, 'พิเศษ', 10.00, 0),
(113, 44, 'พิเศษ', 10.00, 0),
(114, 45, 'พิเศษ', 10.00, 0),
(115, 46, 'พิเศษ', 10.00, 0),
(116, 39, 'พิเศษ', 10.00, 0),
(117, 40, 'พิเศษ', 10.00, 0),
(118, 41, 'พิเศษ', 10.00, 0),
(119, 42, 'พิเศษ', 10.00, 0),
(127, 61, 'หวานน้อย', 0.00, 0),
(128, 62, 'หวานน้อย', 0.00, 0),
(129, 63, 'หวานน้อย', 0.00, 0),
(130, 64, 'หวานน้อย', 0.00, 0),
(134, 61, 'ปกติ', 0.00, 1),
(135, 62, 'ปกติ', 0.00, 1),
(136, 63, 'ปกติ', 0.00, 1),
(137, 64, 'ปกติ', 0.00, 1),
(141, 61, 'หวานมาก', 0.00, 0),
(142, 62, 'หวานมาก', 0.00, 0),
(143, 63, 'หวานมาก', 0.00, 0),
(144, 64, 'หวานมาก', 0.00, 0),
(148, 54, 'ซอสมะเขือเทศ', 0.00, 1),
(149, 55, 'ซอสมะเขือเทศ', 0.00, 1),
(150, 56, 'ซอสมะเขือเทศ', 0.00, 1),
(151, 57, 'ซอสมะเขือเทศ', 0.00, 1),
(155, 54, 'ชีส', 10.00, 0),
(156, 55, 'ชีส', 10.00, 0),
(157, 56, 'ชีส', 10.00, 0),
(158, 57, 'ชีส', 10.00, 0),
(162, 28, 'เผ็ดปกติ', 0.00, 1),
(163, 29, 'เผ็ดปกติ', 0.00, 1),
(164, 30, 'เผ็ดปกติ', 0.00, 1),
(165, 31, 'เผ็ดปกติ', 0.00, 1),
(166, 24, 'เผ็ดปกติ', 0.00, 1),
(167, 25, 'เผ็ดปกติ', 0.00, 1),
(168, 26, 'เผ็ดปกติ', 0.00, 1),
(169, 27, 'เผ็ดปกติ', 0.00, 1),
(170, 54, 'ซอสพริก', 0.00, 0),
(171, 54, 'มายองเนส', 0.00, 0),
(172, 55, 'ซอสพริก', 0.00, 0),
(173, 55, 'มายองเนส', 0.00, 0),
(174, 56, 'ซอสพริก', 0.00, 0),
(175, 56, 'มายองเนส', 0.00, 0),
(176, 57, 'ซอสพริก', 0.00, 0),
(177, 57, 'มายองเนส', 0.00, 0);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL,
  `customer_name` varchar(120) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `cook_id` int(11) DEFAULT NULL,
  `order_time` datetime DEFAULT current_timestamp(),
  `status` enum('PENDING','COOKING','SERVING','DONE','CANCELLED') DEFAULT 'PENDING',
  `total_price` decimal(10,2) DEFAULT 0.00,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `table_id`, `customer_name`, `session_id`, `cook_id`, `order_time`, `status`, `total_price`, `created_at`, `updated_at`) VALUES
(2, 1, NULL, NULL, NULL, '2026-03-31 15:31:17', 'DONE', 150.00, '2026-03-31 15:31:17', '2026-03-31 16:27:35'),
(3, 1, NULL, NULL, NULL, '2026-03-31 15:32:22', 'DONE', 90.00, '2026-03-31 15:32:22', '2026-03-31 16:27:32'),
(4, 1, NULL, NULL, NULL, '2026-03-31 15:49:40', 'DONE', 65.00, '2026-03-31 15:49:40', '2026-03-31 16:27:28'),
(5, 1, NULL, NULL, NULL, '2026-03-31 15:58:26', 'DONE', 65.00, '2026-03-31 15:58:26', '2026-03-31 16:27:23'),
(6, 1, NULL, NULL, NULL, '2026-03-31 16:07:06', 'DONE', 65.00, '2026-03-31 16:07:06', '2026-03-31 16:27:18'),
(7, 1, NULL, NULL, NULL, '2026-03-31 16:07:16', 'DONE', 420.00, '2026-03-31 16:07:16', '2026-03-31 16:27:15'),
(8, 1, NULL, NULL, NULL, '2026-03-31 16:11:08', 'DONE', 230.00, '2026-03-31 16:11:08', '2026-03-31 16:27:12'),
(9, 1, NULL, NULL, NULL, '2026-03-31 16:19:10', 'DONE', 495.00, '2026-03-31 16:19:10', '2026-03-31 16:35:37'),
(10, 1, NULL, NULL, NULL, '2026-03-31 16:34:53', 'DONE', 110.00, '2026-03-31 16:34:53', '2026-03-31 16:36:11'),
(11, 1, NULL, NULL, NULL, '2026-03-31 16:35:13', 'DONE', 230.00, '2026-03-31 16:35:13', '2026-03-31 16:36:11'),
(12, 2, NULL, NULL, NULL, '2026-04-01 01:23:14', 'DONE', 330.00, '2026-04-01 01:23:14', '2026-04-01 01:27:43'),
(13, 1, NULL, NULL, NULL, '2026-04-01 01:58:44', 'DONE', 65.00, '2026-04-01 01:58:44', '2026-04-01 02:16:42'),
(14, 1, NULL, NULL, NULL, '2026-04-01 02:03:18', 'DONE', 55.00, '2026-04-01 02:03:18', '2026-04-01 02:16:42'),
(15, 2, NULL, NULL, NULL, '2026-04-01 02:04:33', 'DONE', 55.00, '2026-04-01 02:04:33', '2026-04-01 02:16:42'),
(16, 2, 'Nam', NULL, NULL, '2026-04-01 02:15:32', 'DONE', 65.00, '2026-04-01 02:15:32', '2026-04-01 02:16:42');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `menu_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `note` text DEFAULT NULL,
  `item_status` enum('PENDING','COOKING','READY','SERVED') DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`order_item_id`, `order_id`, `menu_id`, `menu_name`, `quantity`, `price`, `subtotal`, `note`, `item_status`) VALUES
(1, 2, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 65.00, 'ไม่เอาใบกระเพรา', 'SERVED'),
(2, 2, 33, 'ชาเย็น', 1, 30.00, 30.00, NULL, 'SERVED'),
(3, 2, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(4, 3, 33, 'ชาเย็น', 1, 30.00, 30.00, NULL, 'SERVED'),
(5, 3, 33, 'ชาเย็น', 1, 30.00, 30.00, NULL, 'SERVED'),
(6, 3, 33, 'ชาเย็น', 1, 30.00, 30.00, NULL, 'SERVED'),
(7, 4, 26, 'ข้าวผัดทะเล', 1, 65.00, 65.00, NULL, 'SERVED'),
(8, 5, 26, 'ข้าวผัดทะเล', 1, 65.00, 65.00, NULL, 'SERVED'),
(9, 6, 26, 'ข้าวผัดทะเล', 1, 65.00, 65.00, NULL, 'SERVED'),
(10, 7, 27, 'ข้าวหมูทอดกระเทียม', 1, 60.00, 60.00, NULL, 'SERVED'),
(11, 7, 27, 'ข้าวหมูทอดกระเทียม', 1, 60.00, 60.00, NULL, 'SERVED'),
(12, 7, 27, 'ข้าวหมูทอดกระเทียม', 1, 60.00, 60.00, NULL, 'SERVED'),
(13, 7, 27, 'ข้าวหมูทอดกระเทียม', 1, 60.00, 60.00, NULL, 'SERVED'),
(14, 7, 27, 'ข้าวหมูทอดกระเทียม', 1, 60.00, 60.00, NULL, 'SERVED'),
(15, 7, 27, 'ข้าวหมูทอดกระเทียม', 1, 60.00, 60.00, NULL, 'SERVED'),
(16, 7, 27, 'ข้าวหมูทอดกระเทียม', 1, 60.00, 60.00, NULL, 'SERVED'),
(17, 8, 28, 'ข้าวมันไก่', 1, 50.00, 50.00, NULL, 'SERVED'),
(18, 8, 26, 'ข้าวผัดทะเล', 1, 65.00, 65.00, NULL, 'SERVED'),
(19, 8, 27, 'ข้าวหมูทอดกระเทียม', 1, 60.00, 60.00, NULL, 'SERVED'),
(20, 8, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(21, 9, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(22, 9, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(23, 9, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(24, 9, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(25, 9, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(26, 9, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(27, 9, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(28, 9, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(29, 9, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(30, 10, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(31, 10, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(32, 11, 26, 'ข้าวผัดทะเล', 1, 65.00, 65.00, NULL, 'SERVED'),
(33, 11, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(34, 11, 28, 'ข้าวมันไก่', 1, 50.00, 50.00, NULL, 'SERVED'),
(35, 11, 27, 'ข้าวหมูทอดกระเทียม', 1, 60.00, 60.00, NULL, 'SERVED'),
(36, 12, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(37, 12, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(38, 12, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(39, 12, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(40, 12, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(41, 12, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(42, 13, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 65.00, NULL, 'SERVED'),
(43, 14, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(44, 15, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 55.00, NULL, 'SERVED'),
(45, 16, 25, 'ข้าวกะเพราหมูไข่ดาว', 1, 55.00, 65.00, NULL, 'SERVED');

--
-- Triggers `order_item`
--
DELIMITER $$
CREATE TRIGGER `trg_add_total_price` AFTER INSERT ON `order_item` FOR EACH ROW BEGIN
  DECLARE current_options_sum DECIMAL(10,2) DEFAULT 0;

  -- ดึงผลรวมราคา Option (เผื่อกรณีที่มีการ Insert ข้อมูลที่มี Option ผูกมาแล้วในระบบอื่น)
  -- หรือเพื่อความเป็นมาตรฐานเดียวกับ Trigger ตัว Update
  SELECT COALESCE(SUM(price_add), 0) INTO current_options_sum 
  FROM order_item_option 
  WHERE order_item_id = NEW.order_item_id;

  -- อัปเดตยอดรวมในตาราง orders
  UPDATE orders
  SET total_price = total_price + ((NEW.price + current_options_sum) * NEW.quantity)
  WHERE order_id = NEW.order_id;
  
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_calc_item_subtotal_insert` BEFORE INSERT ON `order_item` FOR EACH ROW BEGIN
    -- จังหวะ insert ครั้งแรก subtotal จะเท่ากับ ราคา * จำนวน (เพราะยังไม่มี option)
    SET NEW.subtotal = NEW.price * NEW.quantity;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_check_quantity` BEFORE INSERT ON `order_item` FOR EACH ROW BEGIN
  IF NEW.quantity <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Invalid quantity';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_check_quantity_update` BEFORE UPDATE ON `order_item` FOR EACH ROW BEGIN
  IF NEW.quantity <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Invalid quantity';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_remove_total_price` AFTER DELETE ON `order_item` FOR EACH ROW BEGIN
  DECLARE options_sum DECIMAL(10,2) DEFAULT 0;
  
  -- หาผลรวมราคาของ Options ทั้งหมดที่ผูกกับรายการที่กำลังจะถูกลบ
  SELECT COALESCE(SUM(price_add), 0) INTO options_sum 
  FROM order_item_option 
  WHERE order_item_id = OLD.order_item_id;

  -- หักยอดเงินออกจากตาราง orders โดยรวมทั้งราคาอาหารหลักและราคา Options
  UPDATE orders
  SET total_price = GREATEST(
    total_price - ((OLD.price + options_sum) * OLD.quantity),
    0
  )
  WHERE order_id = OLD.order_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_snapshot_order_details` BEFORE INSERT ON `order_item` FOR EACH ROW BEGIN
    -- ดึงชื่อเมนูจากตาราง menu มาเก็บไว้ใน NEW.menu_name
    DECLARE fetched_name VARCHAR(255);
    
    SELECT name_menu INTO fetched_name 
    FROM menu 
    WHERE menu_id = NEW.menu_id;
    
    SET NEW.menu_name = fetched_name;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_snapshot_order_details_update` BEFORE UPDATE ON `order_item` FOR EACH ROW BEGIN
    -- เช็คว่าถ้ามีการเปลี่ยน ID เมนู ให้ไปดึงชื่อใหม่มาเก็บทันที
    IF OLD.menu_id <> NEW.menu_id THEN
        SELECT name_menu INTO @temp_name FROM menu WHERE menu_id = NEW.menu_id;
        SET NEW.menu_name = @temp_name;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_update_item_price` AFTER UPDATE ON `order_item` FOR EACH ROW BEGIN
  DECLARE old_options_sum DECIMAL(10,2) DEFAULT 0;
  DECLARE new_options_sum DECIMAL(10,2) DEFAULT 0;

  -- 1. หาผลรวมราคา Option ของรายการนี้ (เผื่อกรณีมีการแก้ไข)
  SELECT COALESCE(SUM(price_add), 0) INTO old_options_sum 
  FROM order_item_option WHERE order_item_id = OLD.order_item_id;
  
  SELECT COALESCE(SUM(price_add), 0) INTO new_options_sum 
  FROM order_item_option WHERE order_item_id = NEW.order_item_id;

  -- 2. หักยอดเก่าออก (ราคาอาหาร + ราคา Option รวม) * จำนวนเก่า
  UPDATE orders
  SET total_price = GREATEST(
    total_price - ((OLD.price + old_options_sum) * OLD.quantity), 
    0
  )
  WHERE order_id = OLD.order_id;

  -- 3. บวกยอดใหม่เข้าไป (ราคาอาหาร + ราคา Option รวม) * จำนวนใหม่
  UPDATE orders
  SET total_price = total_price + ((NEW.price + new_options_sum) * NEW.quantity)
  WHERE order_id = NEW.order_id;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `order_item_option`
--

CREATE TABLE `order_item_option` (
  `id` int(11) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `option_name` varchar(100) DEFAULT NULL,
  `option_value_name` varchar(100) DEFAULT NULL,
  `option_value_id` int(11) NOT NULL,
  `price_add` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item_option`
--

INSERT INTO `order_item_option` (`id`, `order_item_id`, `option_name`, `option_value_name`, `option_value_id`, `price_add`) VALUES
(2, 1, 'ระดับความเผ็ด', 'เผ็ดมาก', 86, 0.00),
(3, 1, 'ขนาด', 'พิเศษ', 116, 10.00),
(4, 2, 'ความหวาน', 'ปกติ', 134, 0.00),
(5, 42, 'ระดับความเผ็ด', 'เผ็ดน้อย', 71, 0.00),
(6, 42, 'ขนาด', 'พิเศษ', 116, 10.00),
(7, 43, 'ระดับความเผ็ด', 'เผ็ดปกติ', 166, 0.00),
(8, 43, 'ขนาด', 'ธรรมดา', 101, 0.00),
(9, 44, 'ระดับความเผ็ด', 'เผ็ดปกติ', 166, 0.00),
(10, 44, 'ขนาด', 'ธรรมดา', 101, 0.00),
(11, 45, 'ระดับความเผ็ด', 'เผ็ดน้อย', 71, 0.00),
(12, 45, 'ขนาด', 'พิเศษ', 116, 10.00);

--
-- Triggers `order_item_option`
--
DELIMITER $$
CREATE TRIGGER `trg_add_option_price` AFTER INSERT ON `order_item_option` FOR EACH ROW BEGIN
  UPDATE orders o
  JOIN order_item oi ON o.order_id = oi.order_id
  SET o.total_price = o.total_price + (NEW.price_add * oi.quantity)
  WHERE oi.order_item_id = NEW.order_item_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_remove_option_price` AFTER DELETE ON `order_item_option` FOR EACH ROW BEGIN
  UPDATE orders o
  JOIN order_item oi ON o.order_id = oi.order_id
  SET o.total_price = GREATEST(o.total_price - (OLD.price_add * oi.quantity), 0)
  WHERE oi.order_item_id = OLD.order_item_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_snapshot_option_details` BEFORE INSERT ON `order_item_option` FOR EACH ROW BEGIN
    DECLARE fetched_option_name VARCHAR(100);
    DECLARE fetched_value_name VARCHAR(100);

    -- แก้ไขชื่อ Column ให้ตรงตามโครงสร้างตารางจริง (mo.name และ mov.value)
    SELECT mo.name, mov.value 
    INTO fetched_option_name, fetched_value_name
    FROM menu_option_value mov
    JOIN menu_option mo ON mov.option_id = mo.option_id
    WHERE mov.value_id = NEW.option_value_id;

    -- นำชื่อที่ดึงได้มาใส่ใน Column Snapshot ของ order_item_option
    SET NEW.option_name = fetched_option_name;
    SET NEW.option_value_name = fetched_value_name;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_update_option_price` AFTER UPDATE ON `order_item_option` FOR EACH ROW BEGIN
  -- 1. ลบราคา Option เก่าออกก่อน
  UPDATE orders o
  JOIN order_item oi ON o.order_id = oi.order_id
  SET o.total_price = GREATEST(o.total_price - (OLD.price_add * oi.quantity), 0)
  WHERE oi.order_item_id = OLD.order_item_id;

  -- 2. บวกราคา Option ใหม่เข้าไป
  UPDATE orders o
  JOIN order_item oi ON o.order_id = oi.order_id
  SET o.total_price = o.total_price + (NEW.price_add * oi.quantity)
  WHERE oi.order_item_id = NEW.order_item_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_update_subtotal_on_option_add` AFTER INSERT ON `order_item_option` FOR EACH ROW BEGIN
    UPDATE order_item 
    SET subtotal = subtotal + (NEW.price_add * quantity)
    WHERE order_item_id = NEW.order_item_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_update_subtotal_on_option_delete` AFTER DELETE ON `order_item_option` FOR EACH ROW BEGIN
    UPDATE order_item 
    SET subtotal = GREATEST(subtotal - (OLD.price_add * quantity), 0)
    WHERE order_item_id = OLD.order_item_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_update_subtotal_on_option_update` AFTER UPDATE ON `order_item_option` FOR EACH ROW BEGIN
    UPDATE order_item 
    SET subtotal = GREATEST(subtotal - (OLD.price_add * quantity) + (NEW.price_add * quantity), 0)
    WHERE order_item_id = NEW.order_item_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_time` datetime DEFAULT current_timestamp(),
  `total_payment` decimal(10,2) NOT NULL,
  `status` enum('PENDING','PAID','FAILED') DEFAULT 'PENDING',
  `method` enum('CASH','QR','CARD','OTHER') NOT NULL DEFAULT 'CASH'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`payment_id`, `order_id`, `payment_time`, `total_payment`, `status`, `method`) VALUES
(1, 2, '2026-03-31 16:27:35', 150.00, 'PAID', 'CASH'),
(2, 3, '2026-03-31 16:27:32', 90.00, 'PAID', 'CASH'),
(3, 4, '2026-03-31 16:27:28', 65.00, 'PAID', 'CASH'),
(4, 5, '2026-03-31 16:27:23', 65.00, 'PAID', 'CASH'),
(5, 6, '2026-03-31 16:27:18', 65.00, 'PAID', 'CASH'),
(6, 7, '2026-03-31 16:27:15', 420.00, 'PAID', 'CASH'),
(7, 8, '2026-03-31 16:27:12', 230.00, 'PAID', 'CASH'),
(8, 9, '2026-03-31 16:27:05', 495.00, 'PAID', 'CASH'),
(17, 10, '2026-03-31 16:36:11', 110.00, 'PAID', 'CASH'),
(18, 11, '2026-03-31 16:36:11', 230.00, 'PAID', 'CASH'),
(21, 12, '2026-04-01 01:27:43', 330.00, 'PAID', 'CASH'),
(23, 13, '2026-04-01 02:16:42', 65.00, 'PAID', 'CASH'),
(24, 14, '2026-04-01 02:16:42', 55.00, 'PAID', 'CASH'),
(25, 15, '2026-04-01 02:16:42', 55.00, 'PAID', 'CASH'),
(26, 16, '2026-04-01 02:16:42', 65.00, 'PAID', 'CASH');

--
-- Triggers `payment`
--
DELIMITER $$
CREATE TRIGGER `trg_payment_complete` AFTER UPDATE ON `payment` FOR EACH ROW BEGIN
  IF NEW.status = 'PAID' THEN
    UPDATE orders
    SET status = 'DONE'
    WHERE order_id = NEW.order_id;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `review_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`review_id`, `order_id`, `menu_id`, `rating`, `comment`, `image_url`, `created_at`) VALUES
(1, 11, 26, 5, 'dddddddd', NULL, '2026-04-01 01:52:48'),
(2, 11, 25, 5, 'dddddd', NULL, '2026-04-01 01:52:50'),
(6, 16, 25, 5, 'DDDDDD', NULL, '2026-04-01 02:16:58');

--
-- Triggers `review`
--
DELIMITER $$
CREATE TRIGGER `trg_validate_review_status` BEFORE INSERT ON `review` FOR EACH ROW BEGIN
    DECLARE order_status VARCHAR(20);

    -- ไปดึงสถานะของออเดอร์นั้นมาเช็ค
    SELECT status INTO order_status 
    FROM orders 
    WHERE order_id = NEW.order_id;

    -- ถ้าสถานะไม่ใช่ DONE ให้ระงับการ Insert
    IF order_status <> 'DONE' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot review: Order must be completed (DONE) first';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `table_id` int(11) NOT NULL,
  `table_number` int(11) NOT NULL,
  `qr_token` varchar(100) DEFAULT NULL,
  `status` enum('AVAILABLE','OCCUPIED','RESERVED') DEFAULT 'AVAILABLE',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`table_id`, `table_number`, `qr_token`, `status`, `created_at`) VALUES
(1, 1, 'tkn_1abc', 'AVAILABLE', '2026-03-28 01:41:53'),
(2, 2, 'tkn_2abc', 'AVAILABLE', '2026-03-28 01:41:53'),
(3, 3, 'tkn_3abc', 'AVAILABLE', '2026-03-28 01:41:53'),
(4, 4, 'tkn_4abc', 'AVAILABLE', '2026-03-28 01:41:53'),
(5, 5, 'tkn_5abc', 'AVAILABLE', '2026-03-28 01:41:53'),
(6, 6, 'tkn_6abc', 'AVAILABLE', '2026-03-28 01:41:53'),
(7, 7, 'tkn_7abc', 'AVAILABLE', '2026-03-28 01:41:53'),
(8, 8, 'tkn_8abc', 'AVAILABLE', '2026-03-28 01:41:53'),
(9, 9, 'tkn_9abc', 'AVAILABLE', '2026-03-28 01:41:53'),
(10, 10, 'tkn_10abc', 'AVAILABLE', '2026-03-28 01:41:53');

-- --------------------------------------------------------

--
-- Table structure for table `table_session`
--

CREATE TABLE `table_session` (
  `session_id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `status` enum('ACTIVE','CLOSED') DEFAULT 'ACTIVE',
  `created_at` datetime DEFAULT current_timestamp(),
  `expired_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `table_session`
--
DELIMITER $$
CREATE TRIGGER `trg_prevent_active_session` BEFORE INSERT ON `table_session` FOR EACH ROW BEGIN
  IF EXISTS (
    SELECT 1 FROM table_session
    WHERE table_id = NEW.table_id 
      AND status = 'ACTIVE'
  ) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Table already has active session';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_prevent_active_session_update` BEFORE UPDATE ON `table_session` FOR EACH ROW BEGIN
    -- ถ้ากำลังจะเปลี่ยน status เป็น ACTIVE ให้เช็คก่อนว่ามี ACTIVE อื่นอยู่ไหม
    IF NEW.status = 'ACTIVE' AND OLD.status <> 'ACTIVE' THEN
        IF EXISTS (
            SELECT 1 FROM table_session
            WHERE table_id = NEW.table_id 
              AND status = 'ACTIVE'
              AND session_id <> NEW.session_id
        ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot activate: Table already has another active session';
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_orders_actual`
-- (See below for the actual view)
--
CREATE TABLE `view_orders_actual` (
`order_id` int(11)
,`table_id` int(11)
,`session_id` int(11)
,`cook_id` int(11)
,`order_time` datetime
,`status` enum('PENDING','COOKING','SERVING','DONE','CANCELLED')
,`total_price` decimal(10,2)
,`created_at` datetime
,`updated_at` datetime
,`actual_total` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Structure for view `view_orders_actual`
--
DROP TABLE IF EXISTS `view_orders_actual`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_orders_actual`  AS SELECT `o`.`order_id` AS `order_id`, `o`.`table_id` AS `table_id`, `o`.`session_id` AS `session_id`, `o`.`cook_id` AS `cook_id`, `o`.`order_time` AS `order_time`, `o`.`status` AS `status`, `o`.`total_price` AS `total_price`, `o`.`created_at` AS `created_at`, `o`.`updated_at` AS `updated_at`, (select sum(`order_item`.`subtotal`) from `order_item` where `order_item`.`order_id` = `o`.`order_id`) AS `actual_total` FROM `orders` AS `o` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `cooks`
--
ALTER TABLE `cooks`
  ADD PRIMARY KEY (`cook_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`menu_id`),
  ADD KEY `idx_menu_category` (`category_id`);

--
-- Indexes for table `menu_option`
--
ALTER TABLE `menu_option`
  ADD PRIMARY KEY (`option_id`),
  ADD UNIQUE KEY `unique_menu_option` (`menu_id`,`name`),
  ADD KEY `idx_option_menu` (`menu_id`);

--
-- Indexes for table `menu_option_value`
--
ALTER TABLE `menu_option_value`
  ADD PRIMARY KEY (`value_id`),
  ADD UNIQUE KEY `unique_option_value` (`option_id`,`value`),
  ADD KEY `idx_value_option` (`option_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `cook_id` (`cook_id`),
  ADD KEY `idx_orders_time` (`order_time`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_table` (`table_id`),
  ADD KEY `idx_orders_table_customer` (`table_id`,`customer_name`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexes for table `order_item_option`
--
ALTER TABLE `order_item_option`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_item_id` (`order_item_id`),
  ADD KEY `option_value_id` (`option_value_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `idx_payment_status` (`status`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`),
  ADD UNIQUE KEY `order_id` (`order_id`,`menu_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`table_id`),
  ADD UNIQUE KEY `table_number` (`table_number`),
  ADD UNIQUE KEY `qr_token` (`qr_token`);

--
-- Indexes for table `table_session`
--
ALTER TABLE `table_session`
  ADD PRIMARY KEY (`session_id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `idx_session_table` (`table_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cooks`
--
ALTER TABLE `cooks`
  MODIFY `cook_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `menu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `menu_option`
--
ALTER TABLE `menu_option`
  MODIFY `option_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `menu_option_value`
--
ALTER TABLE `menu_option_value`
  MODIFY `value_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=178;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `order_item_option`
--
ALTER TABLE `order_item_option`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `table_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `table_session`
--
ALTER TABLE `table_session`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`);

--
-- Constraints for table `menu_option`
--
ALTER TABLE `menu_option`
  ADD CONSTRAINT `menu_option_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_option_value`
--
ALTER TABLE `menu_option_value`
  ADD CONSTRAINT `menu_option_value_ibfk_1` FOREIGN KEY (`option_id`) REFERENCES `menu_option` (`option_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `table_session` (`session_id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`cook_id`) REFERENCES `cooks` (`cook_id`);

--
-- Constraints for table `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`);

--
-- Constraints for table `order_item_option`
--
ALTER TABLE `order_item_option`
  ADD CONSTRAINT `order_item_option_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_item` (`order_item_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_item_option_ibfk_2` FOREIGN KEY (`option_value_id`) REFERENCES `menu_option_value` (`value_id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`);

--
-- Constraints for table `table_session`
--
ALTER TABLE `table_session`
  ADD CONSTRAINT `table_session_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
