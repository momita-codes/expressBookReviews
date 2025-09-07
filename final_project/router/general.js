const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  }
  return res.status(400).json({ message: "Username and password required" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]); });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let filteredBooks = {};
  for (let key in books) {
      if (books[key].author === author) {
          filteredBooks[key] = books[key];
      }
  }
  res.send(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let filteredBooks = {};
  for (let key in books) {
      if (books[key].title === title) {
          filteredBooks[key] = books[key];
      }
  }
  res.send(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});



// Get the list of books (with async/await)
public_users.get('/async/books', async (req, res) => {
    try {
      const response = await axios.get("http://localhost:5000/");
      res.send(response.data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  

  // Get book details by ISBN (with async/await)
  public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      res.send(response.data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  

  // Get book details by Author (with async/await)
  public_users.get('/async/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      res.send(response.data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  

  // Get book details by Title (with async/await)
  public_users.get('/async/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      res.send(response.data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });


module.exports.general = public_users;
