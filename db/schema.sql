CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    semester INTEGER, -- 1 έως 8
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT -- π.χ. "Πρώτες Ύλες", "Τεχνική Μαγειρικής"
);

CREATE TABLE modules (
    id TEXT PRIMARY KEY,
    course_id TEXT,
    title TEXT,
    content TEXT, -- HTML ή markdown
    difficulty INTEGER, -- 1-5
    FOREIGN KEY(course_id) REFERENCES courses(id)
);

CREATE TABLE quizzes (
    id TEXT PRIMARY KEY,
    module_id TEXT,
    title TEXT,
    FOREIGN KEY(module_id) REFERENCES modules(id)
);

CREATE TABLE questions (
    id TEXT PRIMARY KEY,
    quiz_id TEXT,
    question TEXT,
    type TEXT, -- multiple_choice, true_false
    correct_answer TEXT
);

CREATE TABLE user_answers (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    question_id TEXT,
    answer TEXT,
    is_correct INTEGER,
    answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
);
DROP TABLE user_progress;
CREATE TABLE user_progress (
    user_id TEXT,
    module_id TEXT,
    completion_percent INTEGER DEFAULT 0,
    last_accessed DATETIME,
    PRIMARY KEY (user_id, module_id)
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    module_id TEXT,
    time_spent_seconds INTEGER DEFAULT 0,
    started_at DATETIME,
    ended_at DATETIME,

    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE user_learning_profile (
    user_id TEXT PRIMARY KEY,
    avg_score REAL DEFAULT 0,
    weak_topics TEXT, -- JSON string ή comma separated module_ids
    preferred_difficulty INTEGER DEFAULT 1,
    FOREIGN KEY(user_id) REFERENCES users(id)
);