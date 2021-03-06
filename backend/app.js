const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
var cors = require('cors')

const userRoutes = require('./routes/user')
const saucesRoutes = require('./routes/sauces')

const app = express()

mongoose.connect('mongodb+srv://Roger:13467982@clustertestoc.6hw4h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  

app.use(bodyParser.json())
app.use(cors())

app.use('/images', express.static(path.join(__dirname, 'images')))


app.use('/api/auth', userRoutes)
app.use('/api/sauces', saucesRoutes)


module.exports = app;