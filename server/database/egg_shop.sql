-- =======================================================
-- Egg Shop E-Commerce Database Schema
-- Compatible with MySQL 5.7+ / 8.0+ / MariaDB
-- =======================================================

CREATE DATABASE IF NOT EXISTS `egg_shop` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `egg_shop`;

-- Drop existing tables to ensure clean state if re-running
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- -------------------------------------------------------
-- 1. Users Table
-- -------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `postal_code` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('customer', 'admin') DEFAULT 'customer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- 2. Products Table
-- -------------------------------------------------------
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `pack_size` VARCHAR(50) NOT NULL DEFAULT '6 pcs',
  `category` VARCHAR(50) NOT NULL DEFAULT 'Country Hen',
  `stock` INT NOT NULL DEFAULT 50,
  `rating` DECIMAL(3, 1) DEFAULT 4.8,
  `num_reviews` INT DEFAULT 12,
  `image_url` TEXT NOT NULL,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- 3. Orders Table
-- -------------------------------------------------------
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `payment_method` ENUM('COD', 'UPI', 'CARD') DEFAULT 'COD',
  `payment_status` ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
  `order_status` ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  `delivery_slot` VARCHAR(100) DEFAULT 'Morning (7:00 AM - 10:00 AM)',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- 4. Order Items Table
-- -------------------------------------------------------
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT DEFAULT NULL,
  `name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `image_url` TEXT DEFAULT NULL,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- Seed Initial Data
-- -------------------------------------------------------

-- Passwords:
-- admin@eggshop.com -> admin123 (hashed: $2a$10$w8T0MhD2r0F0V1lI9LqgxeK99iPvhQe2F05M89H1sT18YfH8Z1uWe)
-- john@example.com  -> user123  (hashed: $2a$10$9sS3U7f0bJgO/wQkO7sRBeK44yLuhSe2M14G99H3vS28XfH9Z2vXe)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `city`, `postal_code`, `role`) VALUES
(1, 'Egg Shop Admin', 'admin@eggshop.com', '$2a$10$VbYg66R9Lph1O6d2j49.nOdCeqV7fS53lY/qBszu.Y37k6b2Yqf5.', '+91 98401 23456', '124 Farm Gate Road, Anna Nagar', 'Chennai', '600040', 'admin'),
(2, 'John Doe', 'john@example.com', '$2a$10$vD2hQ/TjXkM2j9k6n4VbgeRffw4iN3rM1wJzB8p0aH20i1nK5uHve', '+91 98765 43210', 'No. 42, 2nd Main Road, Gandhi Nagar', 'Chennai', '600028', 'customer');

-- Products (White Egg, Country Egg, Duck Egg, Quail Egg with English & Tamil names)
INSERT INTO `products` (`id`, `name`, `description`, `price`, `pack_size`, `category`, `stock`, `rating`, `num_reviews`, `image_url`, `is_featured`) VALUES
(1, 'Farm Fresh White Eggs | பண்ணை வெள்ளை முட்டை', 'Daily collected farm fresh white table eggs. Graded, washed, UV-sanitized, and high in clean protein for your daily fitness and breakfast. புதிய பண்ணை வெள்ளைக் கோழி முட்டை.', 90.00, '12 pcs', 'White Egg', 120, 4.8, 98, '/images/white_egg.png', 1),
(2, 'Country Hen Eggs | நாட்டுக் கோழி முட்டை', 'Authentic heritage free-range country chicken eggs (Nattu Kozhi). Rich in protein, deep orange yolks, and traditional natural nourishment. தூய நாட்டுக் கோழி முட்டை.', 180.00, '10 pcs', 'Country Hen', 65, 5.0, 114, '/images/country_egg.png', 1),
(3, 'Heritage Duck Eggs | பண்ணை வாத்து முட்டை', 'Large, rich, and creamy farm fresh duck eggs. Prized for baking, fluffy omelettes, and rich micronutrients. சுவையான இயற்கை பண்ணை வாத்து முட்டை.', 210.00, '6 pcs', 'Duck Egg', 40, 4.8, 42, '/images/duck_egg.jpg', 1),
(4, 'Gourmet Quail Eggs | சத்து நிறைந்த காடை முட்டை', 'Healthy, nutrient-dense speckled quail eggs. Packed with iron, calcium, and vitamin B12. உடலுக்கு அதிக ஊட்டச்சத்து தரும் புதிய காடை முட்டை.', 120.00, '18 pcs', 'Quail Egg', 55, 4.9, 63, '/images/quail_egg.jpg', 1);

-- Orders (Values in Indian Rupees ₹)
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `shipping_address`, `city`, `postal_code`, `phone`, `payment_method`, `payment_status`, `order_status`, `delivery_slot`, `notes`) VALUES
(1, 2, 390.00, '742 Anna Salai', 'Chennai', '600002', '+91 98765 43210', 'UPI', 'Paid', 'Delivered', 'Morning (7:00 AM - 10:00 AM)', 'Please ring the bell gently.'),
(2, 2, 270.00, '742 Anna Salai', 'Chennai', '600002', '+91 98765 43210', 'COD', 'Pending', 'Processing', 'Evening (4:00 PM - 7:00 PM)', 'Leave with security if not answered.');

-- Order Items
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `name`, `price`, `quantity`, `image_url`) VALUES
(1, 1, 2, 'Country Hen Eggs | நாட்டுக் கோழி முட்டை', 180.00, 1, '/images/country_egg.png'),
(2, 1, 3, 'Heritage Duck Eggs | பண்ணை வாத்து முட்டை', 210.00, 1, '/images/duck_egg.jpg'),
(3, 2, 1, 'Farm Fresh White Eggs | பண்ணை வெள்ளை முட்டை', 90.00, 1, '/images/white_egg.png'),
(4, 2, 4, 'Gourmet Quail Eggs | சத்து நிறைந்த காடை முட்டை', 120.00, 1, '/images/quail_egg.jpg');
