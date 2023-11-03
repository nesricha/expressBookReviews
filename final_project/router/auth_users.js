const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

let booksArray = Object.values(books)

const isValid = (username) => { //returns boolean

    let isValid = users.filter(user => user.username === username)

    if (isValid.length) {

        return true

    }
    else {

        return false

    }
}

const authenticatedUser = (username, password) => { //returns boolean

    let userPwdMatch = users.filter(user => user.username === username && user.password === password)

    if (userPwdMatch.length) {

        return true

    }
    else {

        return false

    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {

    let username = req.query.username
    let password = req.query.password

    if (isValid(username)) {

        if (authenticatedUser(username, password)) {

            let accessToken = jwt.sign({
                data: password,
                username: username
            }, 'access', { expiresIn: 60 * 60 });

            req.session.authorization = {
                accessToken
            }

            return res.status(200).json({ message: `User '${username}' successfully logged in!` })
        }
        else {

            return res.status(208).json({ message: `Wrong password! Try again` })

        }
    }

    return res.status(404).json({ message: `User not registered` })

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const filteredBook = books[req.params.isbn]

    if (filteredBook) {

        const username = req.session.authorization.username

        if (req.query.review) {

            let reviews = Array.from(filteredBook.reviews)
            let reviewExists = reviews.filter(review => review.username === username)

            if (reviewExists.length) {

                reviews = reviews.filter(review => review.username !== username)
                reviews.push({ username, "review": req.query.review })
                filteredBook.reviews = reviews
                return res.status(200).json({ message: `'${filteredBook.title}' book has a review update ( user: '${username}' )` })

            } else {

                reviews.push({ username, "review": req.query.review })
                filteredBook.reviews = reviews
                return res.status(200).json({ message: `'${filteredBook.title}' book has a new review ( user: '${username}' )` })

            }
        } else {

            return res.status(404).json({ message: `Unable to add reviews to '${filteredBook.title}'` })

        }
    } else {

        return res.status(404).json({ message: `No book was found with isbn '${req.params.isbn}'` })

    }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {

    let filteredBook = books[req.params.isbn]

    if (filteredBook) {

        const username = req.session.authorization.username

        let reviews = Array.from(filteredBook.reviews)
        let reviewExists = reviews.filter(review => review.username === username)

        if (reviewExists.length) { 

            filteredBook.reviews = reviews.filter(rev => rev.username !== username)
            return res.status(200).json({ message: `Deleted review from user '${username}'` })

        } else {

            return res.status(404).json({ message: `No review available to delete for user '${username}'` })

        }

    } else {

        return res.status(404).json({ message: `No book was found with isbn '${req.params.isbn}'` })

    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
