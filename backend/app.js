const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(routes);


app.listen(5000, () => {
    console.log("Server listening on port 5000...");
})