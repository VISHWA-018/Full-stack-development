# Viva Preparation Guide: Automated Quiz Engine

This document is your ultimate cheat sheet for your Viva tomorrow. It breaks down the entire project architecture, the code we wrote, and the potential questions you might be asked.

---

## 1. Project Architecture (The Tech Stack)

When the examiner asks: *"What technologies did you use for this project?"*

**Your Answer:**
"This is a Full-Stack web application. 
- For the **Frontend**, I used **HTML5** for the structural layout, **CSS3** for the styling and animations, and **ES6 (Vanilla JavaScript)** for the dynamic DOM manipulation and asynchronous API fetching.
- For the **Backend**, I am running a **Node.js** server utilizing the **Express** framework. It acts as an API gateway.
- For the **Database**, I am using a relational **MySQL** database to persistently store quiz questions and user results."

### Key Libraries Used:
1. **`express`**: A minimal web framework for Node.js used to create the API endpoints (`/api/questions`, `/api/submit`).
2. **`mysql2`**: A promise-based Node.js driver to securely connect to the MySQL database and execute SQL queries asynchronously.
3. **`cors`**: Middleware to allow our Frontend (browser) to make API requests to our Backend without being blocked by Cross-Origin security policies.
4. **`pdfkit`**: A deeply powerful server-side PDF generation library for Node.js used to dynamically generate the Certificate of Completion!

---

## 2. Component Breakdown & Data Flow

*"Explain the data flow of your application."*

**Your Answer:**
1. **Fetching Questions**: When the user clicks 'Start Quiz', the Frontend `app.js` makes an asynchronous `fetch()` request to the Backend `GET /api/questions`. The Backend executes a `SELECT` statement in MySQL, retrieves the questions, and returns them as a JSON array.
2. **Taking the Quiz**: The ES6 logic dynamically injects the HTML with the question text and options. We store the user's selected answers in a JavaScript object (`userAnswers`).
3. **Submission & Grading**: When the user submits, we send a `POST /api/submit` request containing the user's answers. The Backend fetches the `correct_option` from the database, compares them against the user's answers, and calculates the score entirely on the server-side (this prevents cheating!). It then runs an `INSERT` statement to save the user's score to the database.
4. **Generating the Certificate**: The user clicks 'Download'. The Frontend hits `POST /api/certificate`. The Backend uses `pdfkit` to draw a customized PDF in memory using the user's name and score, and pipes that raw PDF data back to the browser as a downloadable blob.

---

## 3. Potential Viva Questions & Answers

### Q1. Why did you use `mysql2/promise` instead of the standard `mysql` module?
**Answer**: "Using the promise wrapper allows us to use modern `async/await` syntax in Node.js instead of nested callbacks. This makes the database queries look cleaner, prevents 'callback hell', and makes error handling much easier using `try/catch` blocks."

### Q2. How did you prevent SQL Injection in your application?
**Answer**: "When inserting the user's score into the `results` table, I used **Prepared Statements** (parameterized queries). Notice the `connection.execute('INSERT INTO results... VALUES (?, ?, ?)', [userName, score, total])`. The `mysql2` driver automatically escapes the inputs replacing the `?`, neutralizing any malicious SQL code entered by the user."

### Q3. How did you generate the PDF? Did the browser do it or the server?
**Answer**: "The PDF is generated completely on the backend Server using `PDFKit`. This is a much more robust approach because generating complex PDFs on the frontend can be heavy and inconsistent across different browsers. The server generates the PDF dynamically, sets the `Content-Type` to `application/pdf`, and streams it to the user as an attachment."

### Q4. What is DOM Manipulation and how did you use it?
**Answer**: "DOM manipulation is using JavaScript to dynamically change the HTML structure or CSS styles of a web page after it has loaded. In `app.js`, I do this frequently! For example, `document.getElementById('question-text').textContent = ...` updates the question on the screen without reloading the page. I also dynamically build `<div>` elements for the quiz options."

### Q5. What is the difference between `let` and `const` in ES6?
**Answer**: "`const` is used for variables that should never be reassigned (like my imported modules or DOM element references), while `let` is used for variables whose values will change over time (like the `currentQuestionIndex` or the `score`). Both are block-scoped, unlike the old `var` keyword."

---

## Good Luck! 
Remember, if something fails to start, **always verify that XAMPP/MySQL is running on port 3306**! You wrote an awesome system!
