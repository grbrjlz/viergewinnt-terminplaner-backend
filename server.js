const express = require('express');
const app = express();
const admin = require('firebase-admin');
const firebase = require('firebase');
var cors = require('cors')

app.use(cors());

admin.initializeApp();

firebase.initializeApp({
    apiKey: "AIzaSyBJRoAs4F5OIv2Xij2PPWj0ad1UHaYKuBg",
    authDomain: "viergewinnt-terminplaner.firebaseapp.com",
    projectId: "viergewinnt-terminplaner",
    storageBucket: "viergewinnt-terminplaner.appspot.com",
    messagingSenderId: "59333616719",
    appId: "1:59333616719:web:5b84bb99d64282df4fb63a"
  });

async function verifyToken (request) {
  try {
    const token = await getToken(request);

    console.log("token: ", token);

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

async function getToken (request) {
  if (!request.headers.authorization) {
    return undefined;
  }

  const token = request.headers.authorization.replace(/^Bearer\s/, '');

  return token;
}

app.post('/Login', async function(req, res) {
    res.set("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
    res.set('Content-Type','application/json');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log("Function Started")
    console.log(req.method);
    verified = await verifyToken(req)
  
    console.log("verify response: ", verified);
    res.status(200).send(`Hello ${verified}`).end();
  
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});