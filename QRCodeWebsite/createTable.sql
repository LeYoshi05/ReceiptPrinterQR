CREATE TABLE `tokens` (
  `token` varchar(64) NOT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `uses` int(11) NOT NULL DEFAULT 10
)