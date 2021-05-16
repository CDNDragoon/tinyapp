const genRandomString = function () {
  let result = Math.random().toString(36).substring(3).slice(-5);
  console.log(result);
  return result;
};

const getUserByEmail = function (users, email) {
  for (let id in users) {
    if (users[id].email === email) {
      return id;
    }
  }
  return null;
};

const existingEmail = function (obj, email) {
  for (let id in obj) {
    if (obj[id].email === email) {
      return true;
    }
  }
  return false;
};

const checkPassword = function (obj, email, password) {
  const id = getUserByEmail(obj, email);
  for (let user in obj) {
    if ((user = id && password === obj[user].password)) {
      return true;
    }
  }
  return false;
};



const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "helloworld",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const database = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  utd4rf: { longURL: "http://www.youtube.com", userID: "aJ48lW"}
};

const filterDatabase = function(database, userID) {
  let result = {};
  if(userID !== undefined) {
    for (let shortURL in database) {
      if(database[shortURL].userID === userID){
        result[shortURL] = database[shortURL].longURL;
      }
    }
  }
  return result;
}

module.exports = {
  genRandomString,
  getUserByEmail,
  existingEmail,
  checkPassword,
  filterDatabase,
};
