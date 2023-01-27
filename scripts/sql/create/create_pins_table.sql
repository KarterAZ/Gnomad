CREATE TABLE `pins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `longitude` int NOT NULL,
  `latitude` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `tag_bathroom` int DEFAULT '0',
  `tag_wifi` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;