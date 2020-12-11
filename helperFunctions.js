const generateRandomString = () => {
  let randomSix = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  while (randomSix.length < 6) {
    const randomChar = Math.floor(Math.random() * 62);
    randomSix += characters[randomChar];
  }
  return randomSix;
};
const checkObjEmails = (obj, email) => {
  for (let ids in obj) {
    if (obj[ids].email === email) {
      return true;
    }
  }
  return false;
};
const findUserId = (obj, email) => {
  for (let ids in obj) {
    if (obj[ids].email === email) {
      return ids;
    }
  }
  return undefined;
};
const checkUser = (userID, urlDatabase) => {
  let urlsForuser = {};
  for (let shorts in urlDatabase) {
    if (urlDatabase[shorts].user_id === userID) {
      urlsForuser[shorts] = urlDatabase[shorts].longURL;
    }
  }
  return urlsForuser;
};

const checkURL = (url) => {
  if (!url.includes('http://')) {
    const newURL = 'http://' + url;
    return newURL;
  }
  return url;
};

module.exports = { checkObjEmails, checkUser, findUserId, generateRandomString, checkURL };


// console.log(newFunc())
// console.log(generateRandomString())