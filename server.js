const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()

let mongoHost = process.env.MONGO_HOST; // localhost
let mongoPort = process.env.MONGO_PORT; // 27017
let dbName = process.env.MONGO_DB; // test
let appPort = process.env.PORT; // 3000

let isReady = false;

app.use(bodyParser.json());
console.log('App started!');

console.log('Registering routes');

app.use('/api', require('./routes/hotels'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/bookings'));
app.use('/api', require('./routes/rooms'));

app.use('/version', function(req, res) {
  res.status(200).send("version 0.0.4");
});

app.get('/health', (req, res) => {
  res.status(200);
});

app.get('/readiness', (req, res) => {
  let status = isReady ? 200 : 500;
  res.status(status);
});

app.use((err, req, res, next) => {
  res.status(422).send({error: err.message});
});

app.use((err, req, res, next) => {
  res.status(422).send({error: err.message});
});

// Database URL
let url = `mongodb://${mongoHost}:${mongoPort}/${dbName}`;

(async () => {
    try {
      await mongoose.connect(url, {
        "useNewUrlParser": true,
        "useUnifiedTopology": true,
        'serverSelectionTimeoutMS': 1000
      })
      console.log("Database connected!")
      mongoose.Promise = global.Promise;
      isReady = true;
    }
    catch (e) {
      console.log("Impossible to connect to database: test")
      process.exit();
    }
})()
  
app.listen(appPort, () => {
  console.log(`Example app listening at http://localhost:${appPort}`)
})
