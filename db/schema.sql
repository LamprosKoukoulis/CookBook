CREATE TABLE `achievements` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text,
	`description` text,
	`points` integer
);
CREATE TABLE `user_learning_profile` (
	`user_id` integer PRIMARY KEY AUTOINCREMENT,
	`avg_score` real DEFAULT 0,
	`weak_topics` text,
	`preferred_difficulty` integer DEFAULT 1,
	CONSTRAINT `fk_user_learning_profile_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE TABLE `user_progress` (
	`user_id` integer,
	`module_id` integer,
	`completion_percent` integer DEFAULT 0,
	`last_accessed` numeric,
	CONSTRAINT `user_progress_pk` PRIMARY KEY(`user_id`, `module_id`),
	CONSTRAINT `fk_user_progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE TABLE `user_answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`user_id` integer NOT NULL,
	`question_id` integer NOT NULL,
	`answer` text NOT NULL,
	`is_correct` integer,
	`answered_at` numeric DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `fk_user_answers_question_id_questions_id_fk` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_user_answers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE TABLE `modules` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`course_id` integer,
	`title` text,
	`content` text,
	CONSTRAINT `fk_modules_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
);
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`email` text NOT NULL UNIQUE,
	`password_hash` text NOT NULL,
	`full_name` text,
	`role` text DEFAULT 'user',
	`created_at` numeric DEFAULT CURRENT_TIMESTAMP,
	`semester` integer DEFAULT 1
);
CREATE TABLE `user_achievements` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`user_id` integer,
	`achievement_id` integer,
	`earned_at` numeric,
	CONSTRAINT `fk_user_achievements_achievement_id_achievement_id_fk` FOREIGN KEY (`achievement_id`) REFERENCES `achievement`(`id`),
	CONSTRAINT `fk_user_achievements_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE TABLE `courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL UNIQUE,
	`description` text,
	`semester` integer NOT NULL UNIQUE,
	CONSTRAINT `unique_title_semester` UNIQUE(`title`,`semester`),
	CONSTRAINT "Check_semester" CHECK(semester BETWEEN 1 AND 4)
);
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`quiz_id` integer NOT NULL,
	`question` text,
	`type` text,
	`difficulty` integer DEFAULT 1
);
CREATE TABLE `quizzes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`course_id` integer NOT NULL,
	`module_id` integer NOT NULL,
	`title` text NOT NULL,
	CONSTRAINT `fk_quizzes_module_id_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`),
	CONSTRAINT `fk_quizzes_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`)
);
CREATE TABLE `question_answers` (
	`id` integer PRIMARY KEY,
	`question_id` integer,
	`option_text` text,
	`is_correct` integer,
	CONSTRAINT `constraint_1` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`)
);
CREATE TABLE `user_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`user_id` integer,
	`module_id` integer,
	`started_at` numeric,
	`ended_at` numeric,
	`quiz_id` integer,
	CONSTRAINT `constraint_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`),
	CONSTRAINT `fk_user_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	CONSTRAINT `constraint_1` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`)
);