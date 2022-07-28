const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const compression = require('compression');
require('dotenv').config();

const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const image = require('./controllers/image');
const compression = require('compression');

const databasePassword = process.env.DATABASE_PASSWORD;
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : databasePassword,
      database : 'smartbrain'
    }
  });


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(compression());


app.get('/', (req, res) => {
    knex.select('*').from('users')
    .then(users => {
        res.json(users);
    })
})

// handles the users sign in and verifies the password
app.post('/signin', (req, res) => {signIn.handleSignIn(req, res, knex, bcrypt)})

// add a new user to the database and encrypts the users password
app.post('/register', (req, res) => {register.handleRegistration(req, res, knex, bcrypt)})

// accesses the user info
app.get('/profile/:id', (req, res) => {profileId.handleAccessProfileData(req, res, knex)})

// update entries count when the user submits a new image
app.put('/image', (req, res) => {image.handleImageEntry(req, res, knex)})

// calls the clarifai api to use the face recognition software
app.post('/imageUrl', (req, res) => {image.handleClarifaiApiCall(req, res)})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../smartbrain/build'))
}

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})
