CREATE DATABASE IF NOT EXISTS quiz_engine;
USE quiz_engine;

DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS attempts;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_text VARCHAR(500) NOT NULL,
  question_type ENUM('mcq','truefalse') DEFAULT 'mcq',
  option_a VARCHAR(255),
  option_b VARCHAR(255),
  option_c VARCHAR(255),
  option_d VARCHAR(255),
  correct_option CHAR(1) NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  difficulty ENUM('Easy','Medium','Hard') DEFAULT 'Medium',
  points INT DEFAULT 1
);

CREATE TABLE attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  streak INT DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  time_taken INT DEFAULT 0,
  date_taken TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id INT NOT NULL,
  user_id INT NOT NULL,
  cert_code VARCHAR(20) UNIQUE NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id) REFERENCES attempts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@quiz.com', 'admin123', 'admin');

INSERT INTO questions (question_text, question_type, option_a, option_b, option_c, option_d, correct_option, category, difficulty, points) VALUES

-- ── DSA ────────────────────────────────────────────────────────────
('What is the time complexity of binary search?', 'mcq', 'O(n)', 'O(log n)', 'O(n log n)', 'O(1)', 'B', 'DSA', 'Easy', 1),
('Which data structure uses LIFO (Last In First Out)?', 'mcq', 'Queue', 'Array', 'Stack', 'Linked List', 'C', 'DSA', 'Easy', 1),
('What is the worst-case time complexity of QuickSort?', 'mcq', 'O(n log n)', 'O(n)', 'O(n²)', 'O(log n)', 'C', 'DSA', 'Medium', 2),
('Which traversal of a Binary Search Tree gives sorted output?', 'mcq', 'Pre-order', 'Post-order', 'Level-order', 'In-order', 'D', 'DSA', 'Medium', 2),
('Which data structure is used in BFS traversal of a graph?', 'mcq', 'Stack', 'Queue', 'Priority Queue', 'Heap', 'B', 'DSA', 'Medium', 2),
('What is the space complexity of Merge Sort?', 'mcq', 'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'C', 'DSA', 'Hard', 3),
('A stack is used for implementing recursion.', 'truefalse', 'True', 'False', NULL, NULL, 'A', 'DSA', 'Easy', 1),
('In a min-heap, the parent node is always greater than its children.', 'truefalse', 'True', 'False', NULL, NULL, 'B', 'DSA', 'Medium', 2),

-- ── Java ────────────────────────────────────────────────────────────
('Which keyword is used to prevent method overriding in Java?', 'mcq', 'static', 'private', 'final', 'abstract', 'C', 'Java', 'Easy', 1),
('What is the default value of an int variable in Java?', 'mcq', 'null', '1', '-1', '0', 'D', 'Java', 'Easy', 1),
('Which collection class allows key-value pairs and allows null keys in Java?', 'mcq', 'TreeMap', 'HashMap', 'LinkedHashMap', 'Hashtable', 'B', 'Java', 'Medium', 2),
('What is the purpose of the "super" keyword in Java?', 'mcq', 'Access current class methods', 'Access parent class methods/constructors', 'Create a new instance', 'Define an interface', 'B', 'Java', 'Medium', 2),
('Java supports multiple inheritance through classes.', 'truefalse', 'True', 'False', NULL, NULL, 'B', 'Java', 'Easy', 1),
('The "finally" block in Java always executes regardless of exceptions.', 'truefalse', 'True', 'False', NULL, NULL, 'A', 'Java', 'Medium', 2),
('Which Java keyword is used to define an interface?', 'mcq', 'abstract', 'implements', 'interface', 'extends', 'C', 'Java', 'Easy', 1),
('What does JVM stand for?', 'mcq', 'Java Variable Machine', 'Java Virtual Machine', 'Java Verified Model', 'Joint Virtual Memory', 'B', 'Java', 'Easy', 1),

-- ── Full Stack ──────────────────────────────────────────────────────
('What does REST stand for in web development?', 'mcq', 'Real-time Efficient State Transfer', 'Representational State Transfer', 'Remote Execution and Service Transfer', 'Reliable Entity State Transfer', 'B', 'Full Stack', 'Easy', 1),
('Which Node.js framework is most commonly used to build REST APIs?', 'mcq', 'Django', 'Flask', 'Express', 'Spring Boot', 'C', 'Full Stack', 'Easy', 1),
('What is the purpose of a foreign key in SQL?', 'mcq', 'Speed up queries', 'Link two tables by referencing another table primary key', 'Store binary data', 'Prevent duplicate rows', 'B', 'Full Stack', 'Medium', 2),
('Which HTTP status code indicates the resource was successfully created?', 'mcq', '200', '301', '201', '404', 'C', 'Full Stack', 'Medium', 2),
('What does CORS stand for?', 'mcq', 'Cross-Origin Resource Sharing', 'Client Origin Request Service', 'Cross Object Routing System', 'Common Object Resource Sharing', 'A', 'Full Stack', 'Medium', 2),
('In Node.js, npm stands for Node Package Manager.', 'truefalse', 'True', 'False', NULL, NULL, 'A', 'Full Stack', 'Easy', 1),
('`async/await` is built on top of Promises in JavaScript.', 'truefalse', 'True', 'False', NULL, NULL, 'A', 'Full Stack', 'Medium', 2),
('Which SQL command retrieves data without permanently deleting it?', 'mcq', 'DROP', 'DELETE', 'TRUNCATE', 'SELECT', 'D', 'Full Stack', 'Easy', 1),
('What is middleware in Express.js?', 'mcq', 'A database layer', 'A function that runs between request and response', 'A frontend library', 'An HTML template engine', 'B', 'Full Stack', 'Medium', 2),

-- ── DBMS / OS / Networking ──────────────────────────────────────────
('What does ACID stand for in databases?', 'mcq', 'Atomicity Consistency Isolation Durability', 'Accuracy Concurrency Isolation Durability', 'Atomicity Correctness Isolation Data', 'Access Control Integrity Design', 'A', 'DBMS', 'Medium', 2),
('Which SQL command is used to remove a table completely?', 'mcq', 'DELETE', 'REMOVE', 'DROP', 'CLEAR', 'C', 'DBMS', 'Easy', 1),
('What is a deadlock in Operating Systems?', 'mcq', 'High CPU usage', 'System shutdown', 'Two processes waiting for each other forever', 'Out of memory error', 'C', 'OS', 'Medium', 2),
('What does HTTP stand for?', 'mcq', 'HyperText Transfer Protocol', 'High Tech Transfer Protocol', 'Hyper Transfer Text Protocol', 'HyperText Transmission Protocol', 'A', 'Networking', 'Easy', 1),
('Which OSI layer handles routing of packets?', 'mcq', 'Data Link', 'Transport', 'Network', 'Application', 'C', 'Networking', 'Medium', 2),
('SQL Injection attacks exploit unsanitized user inputs in database queries.', 'truefalse', 'True', 'False', NULL, NULL, 'A', 'Security', 'Medium', 2);
