-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- 主机： localhost:3306
-- 生成日期： 2024-07-22 19:32:07
-- 服务器版本： 5.7.24
-- PHP 版本： 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `tp2`
--

-- --------------------------------------------------------

--
-- 表的结构 `card`
--

CREATE TABLE `card` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `card`
--

INSERT INTO `card` (`id`, `name`, `artist`, `category_id`, `user_id`, `date`, `description`, `url`) VALUES
(1, 'Thriller', 'Michael Jackson', 1, 3, '1982-11-30', 'Best-selling album of all time.', 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/32/4f/fd/324ffda2-9e51-8f6a-0c2d-c6fd2b41ac55/074643811224.jpg/1400x1400bb.jpg'),
(2, 'Back in Black', 'AC/DC', 2, 3, '1980-07-25', 'Second best-selling album of all time.', 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1e/14/58/1e145814-281a-58e0-3ab1-145f5d1af421/886443673441.jpg/1400x1400bb.jpg'),
(3, 'The Dark Side of the Moon', 'Pink Floyd', 3, 3, '1973-03-01', 'One of the best-selling albums worldwide.', 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/1400x1400bb.jpg'),
(4, 'The Bodyguard', 'Whitney Houston', 4, 3, '1992-11-17', 'Best-selling soundtrack album.', 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/82/f3/e9/82f3e968-8174-c5eb-7fc5-36384d050129/dj.mdauihuy.jpg/1400x1400bb.jpg'),
(5, 'Rumours', 'Fleetwood Mac', 5, 3, '1977-02-04', 'Classic rock album.', 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4d/13/ba/4d13bac3-d3d5-7581-2c74-034219eadf2b/081227970949.jpg/1400x1400bb.jpg'),
(6, 'Saturday Night Fever', 'Bee Gees', 6, 3, '1977-11-15', 'Best-selling soundtrack.', 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/74/c1/73/74c17380-b75d-4d74-31d8-99f8e8b20c36/17UM1IM27905.rgb.jpg/1400x1400bb.jpg'),
(7, 'Hotel California', 'Eagles', 7, 3, '1976-12-08', 'Best-selling album in the US.', 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/88/16/2c/88162c3d-46db-8321-61f3-3a47404cfe76/075596050920.jpg/1400x1400bb.jpg'),
(8, '21', 'Adele', 8, 3, '2011-01-24', 'Best-selling album of the 21st century.', 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d8/e3/f9/d8e3f9ea-d6fe-9a1b-9f13-109983d3062e/191404113868.png/1400x1400bb.jpg'),
(9, 'Come On Over', 'Shania Twain', 9, 3, '1997-11-04', 'Best-selling country album.', 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/1e/2f/98/1e2f98c2-3fa6-9601-9825-6a6d19a99cf3/06UMGIM07033.rgb.jpg/1400x1400bb.jpg'),
(10, 'Abbey Road', 'The Beatles', 10, 3, '1969-09-26', 'Classic rock album by The Beatles.', 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/df/db/61/dfdb615d-47f8-06e9-9533-b96daccc029f/18UMGIM31076.rgb.jpg/1400x1400bb.jpg'),
(11, 'Born in the USA', 'Bruce Springsteen', 11, 3, '1984-06-04', 'One of Springsteen\'s most successful albums.', 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/32/72/68/327268ba-b9dd-b322-2a16-bdd0212df48c/074643865326.jpg/1400x1400bb.jpg'),
(12, 'Bad', 'Michael Jackson', 1, 3, '1987-08-31', 'Follow-up to Thriller.', 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/8d/97/f4/8d97f427-2d17-1a51-1714-324483eb5fc1/886443546264.jpg/1400x1400bb.jpg'),
(13, 'Jagged Little Pill', 'Alanis Morissette', 12, 3, '1995-06-13', 'Breakthrough album for Morissette.', 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/78/6a/5e/786a5eb8-e00f-c2af-89ec-36adb97dfefc/603497845958.jpg/1400x1400bb.jpg'),
(14, 'Nevermind', 'Nirvana', 13, 3, '1991-09-24', 'Defined the grunge era.', 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/fd/b9/95fdb9b2-6d2b-92a6-97f2-51c1a6d77f1a/00602527874609.rgb.jpg/1400x1400bb.jpg'),
(15, 'Appetite for Destruction', 'Guns N\' Roses', 14, 3, '1987-07-21', 'Debut album by Guns N\' Roses.', 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a0/4d/c4/a04dc484-03cc-02aa-fa82-5334fcb4bc16/18UMGIM24878.rgb.jpg/1400x1400bb.jpg'),
(16, 'Slowdive', 'Slowdive', 9, 6, '2017-05-05', 'Sugar for the pill', 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/81/42/f5/8142f595-dc02-1b4f-0cea-b265ac6c85f3/656605143262.jpg/1400x1400bb.jpg'),
(17, 'Fragile', 'Yes', 2, 6, '1972-01-04', 'Supergroup', 'images/Yes_Fragile.jpg');

-- --------------------------------------------------------

--
-- 表的结构 `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Pop'),
(2, 'Rock'),
(3, 'Progressive Rock'),
(4, 'Soundtrack'),
(5, 'Classic Rock'),
(6, 'Disco'),
(7, 'Country'),
(8, 'Soul'),
(9, 'Alternative Rock'),
(10, 'Hip Hop'),
(11, 'Jazz'),
(12, 'Blues'),
(13, 'Grunge'),
(14, 'Heavy Metal');

-- --------------------------------------------------------

--
-- 表的结构 `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'user',
  `authToken` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `authToken`) VALUES
(3, 'zangyilin1997@gmail.com', 'zangyilin1997@gmail.com', '$2b$10$QsQMU/WReyJx83WFYYeyO.5rAsK9Z6dcBQFAvSFquSAB8T9cJOAYe', 'user', NULL),
(4, 'jjd1024@foxmail.com', 'jjd1024@foxmail.com', '$2b$10$KY.2DZZAMuSwhcj.d9EiQu/1pj49NSj3tZAD2AuRqfQME6O.sNLJu', 'user', NULL),
(5, 'admin', 'admin@admin.com', '$2b$10$2lxB/IYHiaZLHKB2sBCzL.OlyCm59RVtwE1vGsZmdPykBsdoSViPS', 'admin', NULL),
(6, 'j@j.com', 'j@j.com', '$2b$10$7mMSbITZeO7bMPwnKJxI7eG4eyla.AcGnnWiIodxmagJLpblTHX3C', 'user', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6ImpAai5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcyMTY3NjA1MCwiZXhwIjoxNzIxNzYyNDUwfQ.wSe-Kf9yebRBN-5AiydFkUENa8Yvrz8t5JzAiSTD-HE'),
(7, 'q@q.com', 'q@q.com', '$2b$10$WqryBTUTyh7mJq.e6TZ2buSx3Te0IJqcn/jfGFUTGiDNCVJx/DouG', 'user', NULL),
(8, '1@qq.com', '1@qq.com', '$2b$10$HX26pOxaIeAS5ye9oJ5n6eS2QYhSjUThGV7t3FTv2itzluQAFvj1e', 'user', NULL);

--
-- 转储表的索引
--

--
-- 表的索引 `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `user_id` (`user_id`);

--
-- 表的索引 `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `card`
--
ALTER TABLE `card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- 使用表AUTO_INCREMENT `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- 使用表AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- 限制导出的表
--

--
-- 限制表 `card`
--
ALTER TABLE `card`
  ADD CONSTRAINT `card_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `card_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
