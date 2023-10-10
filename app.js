require('dotenv').config();
const express = require('express');
const app = express();
const https = require('https')
const mongoose = require('mongoose');
const cors = require('cors');
const hsts = require('./middlware/hsts')
const fs = require('fs');


//DATABASE
mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log('DB connected.....'));

//MIDDLEWARE
app.use(cors({origin: 'https://localhost:4000', optionsSuccessStatus: 200}))
app.use(express.json());
app.use(hsts);

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

//45 LAB GUIDE
app.use((reg, res, next) => {
    res.setHeader('Access-Control-Allow-Orgin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods','*');
    next();
});

//LISTEN
https.createServer({
    key: fs.readFileSync('./keys/privatekey.pem'),
    cert: fs.readFileSync('./keys/certificate.pem'),
},
app
).listen(4000);
