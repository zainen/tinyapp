const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
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

let templateVars = {
  user_id: '',
  shortURL: '',
  longURL: '',
  urls: '',
  cookie: '',
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// functions
const generateRandomString = () => {
  let randomSix = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  while (randomSix.length < 6) {
    const randomChar = Math.floor(Math.random() * 62)
    randomSix += characters[randomChar]
  }
  return randomSix
}
const checkObjEmails = (obj, email) => {
  for (let ids in obj) {
    console.log(obj[ids])
    if (obj[ids].email === email) {
      return true
    }
  }
}
const checkObjPassword = (obj, password) => {
  for (let ids in obj) {
    if (obj[ids].password === password) {
      return true
    }
  }
}
const findUserId = (obj, email) => {
  for (let ids in obj) {
    if(obj[ids].email === email) {
      return ids
    }
  }
} 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// get requests
app.get('/urls', (req, res) => {
  let userId = req.cookies["user_id"];
  let templateVars = { urls: urlDatabase, user_id: userId}
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

app.get('/register', (req, res) => {
  res.render('urls_register', templateVars)
})

app.get('/login', (req, res) => {
  res.render('urls_login', templateVars)
})

app.get('/loginError', (req, res) => {
  res.render('urls_loginError', templateVars)
})



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// posts requests
app.post('/register', (req, res) => {
  const id = generateRandomString()
  const email = req.body.email
  const password = req.body.password
  if (!email || !password) {
    res.status(400).send("Username or Password not found")
  }
  if (checkObjEmails(users, email)) {
    return res.status(400).send('Email already in use')
  }
  users[id] = {id, email, password}
  templateVars.user_id = id
  templateVars
  res.cookie('user_id', id)
  res.redirect('/urls')
})

app.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (checkObjEmails(users, email)) {
    if (checkObjPassword(users, password)) {
      let id = findUserId(users, email)
      // templateVars.users = users
      res.cookie('user_id', id);
      res.redirect('/urls');
    } else {
      res.status(403).redirect('/loginError')
    }
  } else {
    res.status(403).redirect('/loginError')
  }
});

app.post('/logout', (req, res) => {
  templateVars.user_id = ''
  res.clearCookie('user_id')
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

