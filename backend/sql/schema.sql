-- Create database
CREATE DATABASE IF NOT EXISTS study_group_finder;
USE study_group_finder;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    program VARCHAR(100) NOT NULL,
    year_of_study INT NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study groups table
CREATE TABLE IF NOT EXISTS study_groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    meeting_location VARCHAR(255) NOT NULL,
    meeting_type ENUM('physical', 'online') DEFAULT 'physical',
    leader_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Group members (junction table)
CREATE TABLE IF NOT EXISTS group_members (
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    session_date DATE NOT NULL,
    session_time VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    meeting_link VARCHAR(500),
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Discussions table
CREATE TABLE IF NOT EXISTS discussions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    author_id INT NOT NULL,
    content TEXT NOT NULL,
    type ENUM('announcement', 'question', 'general') DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    discussion_id INT NOT NULL,
    author_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Insert sample admin user (password is 'admin123' - you should change this)
-- To generate proper hash: use bcrypt.hashSync('admin123', 10)
INSERT INTO users (name, email, password, program, year_of_study, role) 
VALUES ('Admin User', 'admin@ucu.ac.ug', '$2a$10$rQp3qMqZqZqZqZqZqZqZqOqOqOqOqOqOqOqOqOqOqOqO', 'Administration', 0, 'admin');

-- Insert some sample faculties
INSERT INTO study_groups (name, course_name, course_code, faculty, description, meeting_location, meeting_type, leader_id) 
VALUES 
('Web Dev Masters', 'Web Development', 'CSC1202', 'Faculty of Computing', 'Study group for web development course', 'ICT Lab 3', 'physical', 1),
('Database Design Team', 'Database Systems', 'CSC2201', 'Faculty of Computing', 'Focus on SQL and database design', 'Library Room 204', 'physical', 1);