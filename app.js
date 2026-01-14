const express = require('express');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/', require('./routes/accounts'));

app.listen(process.env.PORT, () =>
    console.log(`Running on http://localhost:${process.env.PORT}`)
);
