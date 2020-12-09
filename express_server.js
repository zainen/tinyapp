const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
}

const templateVars = {
  user_id: '',
  shortURL: '',
  longURL: '',
  urls: '',
  cookie: '',
}

const generateRandomString = () => {
  let randomSix = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  while (randomSix.length < 6) {
    const randomChar = Math.floor(Math.random() * 62)
    randomSix += characters[randomChar]
  }
  return randomSix
}



app.get('/urls', (req, res) => {
  templateVars['urls'] = urlDatabase;
  res.render('urls_index', templateVars);
});

// connected to urls_new.ejs
app.get("/urls/new", (req, res) => {
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  templateVars['shortURL'] = req.params.shortURL;
  templateVars['longURL'] = urlDatabase[req.params.shortURL];
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//added trying to get edit button on urls to redirect to short url
app.get('/urls/:shortURL/edit', (req, res) => {
  templateVars['shortURL'] = req.params.shortURL;
  templateVars['longURL'] = urlDatabase[req.params.shortURL];
  res.render('urls_show', templateVars);
});

app.get('/registration', (req, res) => {
  res.render('urls_registration', templateVars)
})


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// adding posts
app.post('/registration', (req, res) => {
  const id = generateRandomString()
  const username = req.body.username
  const password = req.body.password
  users[id] = {id, username, password}
  templateVars.user_id = id
  res.cookie('user_id', id)
  
  console.log(id) // remove when completed
  res.redirect('/urls')
})

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  templateVars.users = users
  console.log(templateVars) // checking templateVars
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  templateVars.username = ''
  res.clearCookie('username')
  res.redirect('/urls')
})

app.post('/urls', (req, res) => {
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = req.body.longURL;
  res.redirect(`/urls/${newShortURL}`);
});

// edit url function input saved longURL in urls_show
app.post('/u/:shortURL/edit', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls')
});

// delete
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
// server listening
app.listen(PORT, () => {;
  console.log(`Example app listening on port ${PORT}`)
});

