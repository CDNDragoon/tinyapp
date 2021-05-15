const genRandomString = function() {
  let result = Math.random().toString(36).substring(3).slice(-5);
  console.log(result);
  return result;
}

const getUserByEmail = function(users, email) {
  for (let id of users) {
    if (users[id].email === email) {
      return id;
    }
  }
  return null;
}

module.exports = { genRandomString, getUserByEmail };