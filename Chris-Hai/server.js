'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// REVIEW: POST route needs to parse the body passed in with the request.
// POST middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile('./index.html', {root: "./public"});
});

app.get('/newarticle', (req, res) => {
  res.sendFile('./new.html', {root: "./public"});
});


app.post('/articles', (req, res) => {
  // REVIEW: This route will receive a new article from the form page, new.html, and log that form data to the console. We will wire this up soon to actually write a record to our persistence layer!
  console.log(req.body);
  res.status(201).json(req.body);
});

app.use((req, res) => {
  res.status(404).send('404 - File not Found');
});

app.listen(PORT, () => {
  console.log(`server.js listening on port ${PORT}`);
})