const express = require('express');
const app = express();
const firebase = require('firebase');
const admin = require('firebase-admin')
var cors = require('cors')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(cookieParser())

var urlencodedParser = bodyParser.urlencoded({ extended: false })

admin.initializeApp();
firebase.initializeApp({
    apiKey: "AIzaSyBJRoAs4F5OIv2Xij2PPWj0ad1UHaYKuBg",
    authDomain: "viergewinnt-terminplaner.firebaseapp.com",
    projectId: "viergewinnt-terminplaner",
    storageBucket: "viergewinnt-terminplaner.appspot.com",
    messagingSenderId: "59333616719",   
    appId: "1:59333616719:web:5b84bb99d64282df4fb63a"
  });

// Sign-In with Google verify
async function verifyToken (request) {
  try {
    const token = await getToken(request);

    //console.log("token: ", token);

    if (!token) {
      return false;
    }

    const payload = await admin.auth().verifyIdToken(token);
    console.log(payload);
    return payload !== null;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Sign-In with Google token
async function getToken (request) {
  if (!request.headers.authorization) {
    return undefined;
  }

  const token = request.headers.authorization.replace(/^Bearer\s/, '');

  return token;
}

// TODO: JWT Token erstellen -> im cookie speichern -> 
//       cookie in browser speichern -> von function auslesen 

// generate JWT Token
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

// authenticate JWT Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user
    console.log(user)
    next()
  })
}

// REST API
app.post('/Login', async function(req, res) {
  res.set("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
  res.set('Content-Type','application/json');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

  verified = await verifyToken(req)
  console.log("verify response: ", verified);
  res.status(200).send(`Hello ${verified}`).end();
});

app.post('/create', urlencodedParser, async function(req,res) {
  const jwttoken = generateAccessToken({username: req.body.username});
  res.writeHead(200, {
      "Set-Cookie": `token=${jwttoken}; HttpOnly`,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "http://localhost:4200" // für live auf bucket url ändern
  })
  .send();
})

app.get('/check', (req, res) => {
  console.log(req.cookies)
  if (!req.cookies.token) {
    return res.status(401).send()
  } else {
    return res.send('cookie gesetzt')
  }
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});