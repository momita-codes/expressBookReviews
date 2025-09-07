const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.filter(user => user.username === username).length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validUser = users.find(user => user.username === username && user.password === password);
return validUser ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT token
    let accessToken = jwt.sign(
      { username: username },
      "access", // Secret key
      { expiresIn: "1h" }
    );

    // Save session
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "Login successful", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid login credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;
  
  if (books[isbn]) {
      books[isbn].reviews[username] = review;
      return res.send("Review added/updated successfully");
  }
  res.status(404).send("Book not found");
});

//Delete a Book Review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    if (!books[isbn] || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
