const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const app = express();
 require('colors');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoute');
const productRoutes = require('./routes/productRoutes');
const dotenv = require('dotenv').config()
const cors=require('cors');
const path=require('path');
const url=require("url")
app.use(cors());

//midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"));

//database
connectDB()
//routes
app.use(authRoutes)
app.use(categoryRoutes)
app.use(productRoutes)

const port =process.env.PORT || 8080
app.listen(port,()=>{
    console.log(`Welcome to ${process.env.PORT}`)
})