const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const booksArray = Object.values(books);

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let userExists = users.filter((user) => user.username === username);

  if (username && password) {
    if (userExists.length) {
      return res
        .status(404)
        .json({ message: `User '${username}' is already registered!` });
    } else {
      users.push({
        username: username,
        password: password,
      });

      return res.status(200).json({
        message: `User '${username}' successfully registered! You can login now!`,
      });
    }
  }

  return res.status(404).json({
    message: `Invalid username or password, failed to register. Try again.`,
  });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify({ books }, null, 4));
  
  // ASYNC METHOD

  // const getBooks = () => {
  //     return new Promise((res, rej) => {
  //       setTimeout(() => {
  //         res(books);
  //       }, 500);
  //     });
  //   };

  //   try {
  //     const booksList = await getBooks();
  //     res.send(JSON.stringify({ booksList }, null, 4));
  //   } catch (err) {
  //     res.status(500).json({ message: "Error getting books' list" });
  //   }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  res.send(books[req.params.isbn]);

  // ASYNC METHOD

  // const getBooks = () => {
  //     return new Promise((res, rej) => {
  //       setTimeout(() => {
  //         res(books);
  //       }, 500);
  //     });
  //   };

  //   try {
  //     const booksList = await getBooks();
  //     res.send(booksList[req.params.isbn]);
  //   } catch (err) {
  //     res
  //       .status(500)
  //       .json({ message: `Error getting book with isbn '${req.params.isbn}'` });
  //   }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  res.send(
    booksArray.filter(
      (book) =>
        book.author.split(" ").join("").toLowerCase() ==
        req.params.author.toLowerCase()
    )
  );

  // ASYNC METHOD

  // const getBooks = () => {
  //   return new Promise((res, rej) => {
  //     setTimeout(() => {
  //       res(booksArray);
  //     }, 500);
  //   });
  // };

  // try {
  //   const booksList = await getBooks()
  //   res.send(booksList.filter(book => book.author.replace(/ /g, "").toUpperCase() === req.params.author.toUpperCase()))
  // } catch (err) {
  //   res.status(500).json({message: `Error retrieving book: ${err}`})
  // }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  res.send(
    booksArray.filter(
      (book) =>
        book.title.replace(/ /g, "").toUpperCase() ===
        req.params.title.toUpperCase()
    )
  );

  // ASYNC METHOD

  // const getBooks = () => {
  //   return new Promise((res, rej) => {
  //     setTimeout(() => {
  //       res(booksArray);
  //     }, 500);
  //   });
  // };

  // try {
  //   const booksList = await getBooks()
  //   res.send(booksList.filter(book => book.title.replace(/ /g, "").toUpperCase() === req.params.title.toUpperCase()))
  // } catch (err) {
  //   res.status(500).json({message: `Error retrieving book: ${err}`})
  // }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  res.send(
    `Reviews for the book '${books[req.params.isbn].title}' : ${JSON.stringify(
      books[req.params.isbn].reviews,
      null,
      4
    )}`
  );
});

module.exports.general = public_users;
