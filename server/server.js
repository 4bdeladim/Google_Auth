require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 7000
const auth = require('./routes/auth')
const mongoose = require('mongoose')

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use('/', auth)
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true },  () => {
    console.log("Mongo connected !")
});
app.listen(port,  () => console.log(`server running on port ${port}`));