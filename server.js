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

  app.get("/", (req, res) => {
    res.send("Welcome to the Book_inventory management API!!!!");
  });

  