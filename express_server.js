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
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// connected to urls_new.ejs
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL};
  res.render('urls_show', templateVars)
});

app.get('/hello', (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render('hello_world', templateVars);
  // res.send('<html><body>Hello<b>World</b></body></html>\n');
});

app.get('/set', (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get('/fetch', (req, res) => {;
  res.send(`a = ${a}`);
});

//adding posts

app.post('/urls', (req, res) => {
  const newShortURL = generateRandomString()
  urlDatabase[newShortURL] = req.body.longURL
  res.send(req.statusCode);
  // console.log(urlDatabase)
});

app.post('/urls/new', (req, res) => {
});


app.listen(PORT, () => {;
  console.log(`Example app listening on port ${PORT}`)
});
