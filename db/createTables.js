const  query = require("./query");

async function initDB(){
    // await query("PRAGMA foreign_keys = ON;");
    console.log("this works fine!");

    //  USERS (auth handled externally, but we keep role)
    await query(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT,
        role TEXT NOT NULL CHECK(role IN ('admin', 'student'))
        )`);
        
    // await query(`CREATE TABLE IF NOT EXISTS users(
    //     id INTEGER)`);
    // STUDENTS
    await query(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        degree TEXT,
        university TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
        
    // CV
    await query(`
        CREATE TABLE IF NOT EXISTS cv (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            summary TEXT,
            experience TEXT,
            education TEXT,
            FOREIGN KEY (student_id) REFERENCES students(id)
            );
    `);
                    
    // SKILLS
    await query(`
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
            );
    `);
            
    // STUDENT_SKILLS (MANY TO MANY)
    await query(`
        CREATE TABLE IF NOT EXISTS student_skills (
            student_id INTEGER NOT NULL,
            skill_id INTEGER NOT NULL,
            PRIMARY KEY (student_id, skill_id),
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (skill_id) REFERENCES skills(id)
            );
    `);
            
    // KEYWORDS
    await query(`
        CREATE TABLE IF NOT EXISTS keywords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
            );
    `);

    // STUDENT_KEYWORDS (MANY TO MANY)
    await query(`
        CREATE TABLE IF NOT EXISTS student_keywords (
            student_id INTEGER NOT NULL,
            keyword_id INTEGER NOT NULL,
            PRIMARY KEY (student_id, keyword_id),
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (keyword_id) REFERENCES keywords(id)
            );
    `);
    console.log("Tables created!");
}
initDB().catch((err) => {
  console.error("DB init failed:", err.message);
});