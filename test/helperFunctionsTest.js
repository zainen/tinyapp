const { assert } = require('chai');

const { findUserId } = require('../helperFunctions.js');

const { checkObjEmails } = require('../helperFunctions.js')

const testUsers = {
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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserId(testUsers, "user@example.com")
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput)
  });
  it('should return a user with valid email', function() {
    const user = checkObjEmails(testUsers, "user@example.com")
    const expectedOutput = true;
    assert.strictEqual(user, expectedOutput)
  });
  it('should return a user with valid email', function() {
    const user = findUserId(testUsers, "user10@example.com")
    const expectedOutput = undefined;
    assert.strictEqual(user, expectedOutput)
  });
});