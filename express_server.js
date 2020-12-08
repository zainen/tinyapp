const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs')


const generateRandomString = () => {
  let randomSix = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  while (randomSix.length < 6) {
    const randomChar = Math.floor(Math.random() * 62)
    randomSix += characters[randomChar]
  }
  return randomSix
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get('/urls', (req, res) => {
  // console.log(urlDatabase) // to be removed later
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// connected to urls_new.ejs

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render('urls_show', templateVars)
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


//adding posts

app.post('/urls', (req, res) => {
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = req.body.longURL;
  // res.send('ok');
  res.redirect(`/urls/${newShortURL}`);
  // console.log(urlDatabase);
});

app.post('/u/:shortURL/edit', (req, res) => {
  console.log(':updated')
  console.log(urlDatabase[req.params.shortURL])
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls/');
  console.log(shortURL); //removed later
});

// server listening

app.listen(PORT, () => {;
  console.log(`Example app listening on port ${PORT}`)
});


// unneeded

// app.get("/", (req, res) => {
//   res.send("Hello");
// });

// app.get('/hello', (req, res) => {
//   const templateVars = { greeting: 'Hello World!' };
//   res.render('hello_world', templateVars);
//   // res.send('<html><body>Hello<b>World</b></body></html>\n');
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get('/set', (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });
// doesnt work since out of scope
// app.get('/fetch', (req, res) => {;
//   res.send(`a = ${a}`);
// });

// app.get('/u/:shortURL', (req, res) => {
//   // console.log(req)
// })