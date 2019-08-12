const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const products = require('./app/routes/products');
const orders = require('./app/routes/orders');
const users = require('./app/routes/users');

//mongoose db connection
mongoose.connect(
    "mongodb+srv://expressbasic:" + process.env.DB_PASSWORD + "@toriqahmad-nuokt.mongodb.net/test?retryWrites=true&w=majority",
    {
        useNewUrlParser: true
    }
);

mongoose.Promise = global.Promise;

//logging with morgan
app.use(morgan('dev'));

//for accessing static file
app.use('/uploads', express.static('uploads'));

//handle request body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json();
    }

    next();
});

//handling all routes
app.use('/products', products);
app.use('/orders', orders);
app.use('/users', users);

//handling error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;

    //pass const error to next middleware
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app;