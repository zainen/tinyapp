const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const helperFuctions = require('./helperFunctions')
// const password = 'purple-monkey-dinosaur';
// const hashedPassword = bcrypt.hashSync(password, 10); 

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession(
  {
    name: 'session',
    keys: ['something-secure'],
    maxAge: 24 * 60 * 60 * 1000 // 24hrs
  }
));

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", user_id: 'asdf' },
  "9sm5xK": { longURL: "http://www.google.com", user_id: 'asdf' }
};

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

let templateVars = {
  user_id: '',
  shortURL: '',
  longURL: '',
  urls: '',
  cookie: '',
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const generateRandomString = helperFuctions.generateRandomString
const checkObjEmails = helperFuctions.checkObjEmails
const findUserId = helperFuctions.findUserId
const checkUser = helperFuctions.checkUser
const checkObjPassword = helperFuctions.checkObjPassword

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// get requests
app.get('/urls', (req, res) => {
  let userID = req.session["user_id"];
  const urlsForuser = checkUser(userID)
  let templateVars = { urls: urlsForuser, user_id: userID };
  templateVars.user_id = userID
  res.render('urls_index', templateVars);
});

// connected to urls_new.ejs
app.get("/urls/new", (req, res) => {
  let userID = req.session["user_id"];
  let templateVars = { urls: urlDatabase, user_id: userID}
  if (!userID) {
    res.redirect('/login');
  }
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const userID = req.session.user_id
  templateVars['shortURL'] = req.params.shortURL;
  templateVars['longURL'] = urlDatabase[req.params.shortURL].longURL;
  templateVars.user_id = userID;
  res.render('urls_show', templateVars);
});

//added trying to get edit button on urls to redirect to short url
app.get('/urls/:shortURL/edit', (req, res) => {
  templateVars['shortURL'] = req.params.shortURL;
  templateVars['longURL'] = urlDatabase[req.params.shortURL].longURL;
  res.render('urls_show', templateVars);
});

app.get('/register', (req, res) => {
  res.render('urls_register', templateVars);
});

app.get('/login', (req, res) => {
  res.render('urls_login', templateVars);
});

app.get('/loginError', (req, res) => {
  res.render('urls_loginError', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// posts requests
app.post('/register', (req, res) => {
  const id = generateRandomString();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!req.body.email || !hashedPassword || !password) {
    req.body.email = undefined
    res.status(400).send("Please enter an Email Address and Password.");
  } else if (checkObjEmails(users, req.body.email)) {
    return res.status(400).send('Email already in use');
  }
  const email = req.body.email;
  users[id] = {id, email, hashedPassword};
  req.session.user_id = id;
  res.redirect('/urls');
  const ids = checkObjPassword(users, hashedPassword)
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10)
  let id = findUserId(users, email);
  if (checkObjEmails(users, email)) {
    if (bcrypt.compareSync(password, users[id].hashedPassword)) {
      req.session.user_id = id;
      res.redirect('/urls');
    } else {
      res.status(403).redirect('/loginError');
    }
  } else {
    res.status(403).redirect('/loginError');
  }
});

app.post('/logout', (req, res) => {
  templateVars.user_id = '';
  req.session = null;
  res.redirect('/urls');
});

app.post('/urls', (req, res) => {
  const userID = req.session.user_id
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = { longURL: req.body.longURL, user_id: userID};
  res.redirect(`/urls/${newShortURL}`);
});

// edit url function input saved longURL in urls_show
app.post('/u/:shortURL/edit', (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL
  if (urlDatabase[shortURL].user_id === userID) {
  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect('/urls')
  } else {
    res.redirect('/login')
  }
});

// delete
app.post('/urls/:shortURL/delete', (req, res) => {
  const userID = req.session.user_id
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].user_id === userID) {
  delete urlDatabase[shortURL];
  res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
// server listening
app.listen(PORT, () => {;
  console.log(`Example app listening on port ${PORT}`);
});

