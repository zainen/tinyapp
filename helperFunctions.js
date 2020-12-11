// const { response } = require("express");
// const { url } = require("inspector");
// const { PassThrough } = require("stream");

// const newFunc = () => {
//   let r = Math.random().toString(36).substr(7)
//   return r
// }


const generateRandomString = () => {
  let randomSix = ''
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
const checkObjPassword = (obj, password) => {
  for (let ids in obj) {
    if (obj[ids].hashedPassword === password) {
      return ids;
    }
  } 
  return undefined
};
const findUserId = (obj, email) => {
  for (let ids in obj) {
    if(obj[ids].email === email) {
      return ids;
    }
  }
  return undefined
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
  if (!url.includes('http')) {
    url = 'http:/' + '/' + url
    return url
  } else {
    return url
  }
}

module.exports = { checkObjEmails, checkUser, findUserId, generateRandomString, checkObjPassword, checkURL }


// console.log(newFunc())
// console.log(generateRandomString())