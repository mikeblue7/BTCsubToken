const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const Router = require('../backend/routes');


// Define PORT
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));


const dbPath = "mongodb://localhost:27017/btcprice";
mongoose.connect(dbPath, {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", () => {
    console.log("Error occurred from the database");
});
db.once("open", () => {
    console.log("Successfully opened the database");
});
    
// Routes
app.use('/', Router);


app.listen(port, () => {
    console.log(`Server is runing on ${port}`)
});