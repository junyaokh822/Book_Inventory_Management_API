const express = require("express");
const app = express();
const port = 4000;
const books = require("./books");
const { query } = require('./database');
require("dotenv").config();

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`)
  res.on("finish", () => {
    
    console.log(`Response status: ${res.statusCode}`);
  });
  next();
});
app.use(express.json());

function getNextIdFromCollection(collection) {
    if (collection.length === 0) return 1;
    const lastRecord = collection[collection.length - 1];
    return lastRecord.id + 1;
  }
    console.log()
  app.get("/", (req, res) => {
    res.send("Welcome to the Book_inventory management API!!!!");
  });


// Get all the books
app.get("/books", async (req, res) => {
    try {
      const allbooks = await query("SELECT * FROM book_inventory");
  
      res.status(200).json(allbooks.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Get a specific book
  app.get("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id, 10);
  
    try {
      const book = await query("SELECT * FROM book_inventory WHERE id = $1", [bookId]);
  
      if (book.rows.length > 0) {
        res.status(200).json(book.rows[0]);
      } else {
        res.status(404).send({ message: "Book not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

  // Create a new book
  app.post("/books", async (req, res) => {
    const { title, price, author, genre, quantity, postLocation, releaseDate } = req.body;
  
    try {
      const newbooks = await query(
        `INSERT INTO book_inventory (title, price, author, genre, quantity, postLocation, releaseDate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, price, author, genre, quantity, postLocation, releaseDate]
      );
        console.log(newbooks);
      res.status(201).json(newbooks.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

  // Update a specific book
  app.patch("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id, 10);
  
    const fieldNames = [
      "title",
      "price",
      "author",
      "genre",
      "quantity",
      "postLocation",
      "releaseDate",
      "bookId",
    ].filter((name) => req.body[name]);
  
    let updatedValues = fieldNames.map(name => req.body[name]);
    const setValuesSQL = fieldNames.map((name, i) => {
      return `${name} = $${i + 1}`
    }).join(', ');
  
    try {
      const UpdatedBooks = await query(
        `UPDATE book_inventory SET ${setValuesSQL} WHERE id = $${fieldNames.length+1} RETURNING *`,
        [...updatedValues, bookId]
      );
  
      if (UpdatedBooks.rows.length > 0) {
        res.status(200).json(UpdatedBooks.rows[0]);
      } else {
        res.status(404).send({ message: "Book not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
  // Delete a specific book
  app.delete("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id, 10);
  
    try {
      const deleteOp = await query("DELETE FROM book_inventory WHERE id = $1", [bookId]);
  
      if (deleteOp.rowCount > 0) {
        res.status(200).send({ message: "Book deleted successfully" });
      } else {
        res.status(404).send({ message: "Book not found" });
      }
    }catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.listen(4000, function () {
    console.log('Example app listening on port 8000!');
   });