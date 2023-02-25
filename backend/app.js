const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
require('dotenv').config();

const db = require('./util/database');

app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(routes);

mongoose.connect(process.env.MONGO_URI)
    .then(result => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT || 5000, () => {
            console.log("Server listening on port 5000...");
        })
    })
    .catch(err => {
        console.log("Error connecting to MongoDB")
    })