const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4} = require('uuid');

const {graphqlHTTP} = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');


const app = express();

const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'images');
    },
    filename: (req,file,cb)=>{
        cb(null, uuidv4() + '-' +file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'images/jpeg' || file.mimetype=== 'image/jpg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(
    multer({ storage:fileStorage, fileFilter:fileFilter}).single('image')
);
app.use('/images', express.static(path.dirname(path.join(__dirname),'images')));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use((error,req,res,next)=>{
    const statusCode = error.statusCode || 500;
    console.log(error);
    return res.status(statusCode).json({message: error.message, data: error.data});
});

app.use('/graphql', graphqlHTTP({
    schema : graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}));


mongoose.connect('mongodb://127.0.0.1:27017/social-media')
    .then(()=>{
        app.listen(8080, ()=> console.log('Server Started at 8080'));
    })
    .catch(err=> console.log(err));