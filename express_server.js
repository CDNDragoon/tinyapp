const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const {
  genRandomString,
  getUserByEmail,
  existingEmail,
  checkPassword,
} = require("./helpers/helper");

app.set("view engine", "ejs");
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  const username = users[req.cookies["user_id"]];
  const templateVars = {username};
  if (!username) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  console.log("req.cookies", req.cookies.username);
  const user = users[req.cookies["user_id"]];
  const templateVars = { urls: urlDatabase, username: user };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const username = users[req.cookies["user_id"]];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username
  };
  if (!username) {
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get("/test", (req, res) => {
  res.send("Test working");
});

app.get("/register", (req, res) => {
  const username = req.body.username;
  const templateVars = { username };
  if (!username) {
    res.render("register", templateVars);
  } else {
    res.redirect("/urls");
  }
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    if(!existingEmail(users, email)) {
      let id = genRandomString();
      let newUser = { id, email, password };
      users[id] = newUser;
      res.cookie("user_id", id);
      res.redirect("/urls");
      console.log(users);
    }else {
      res.status(400);
      res.send(
        `<html><body><h1>Error:400</h1> <h2><b>This email (${email}) has been registered. Choose another one!!!</h2><h3><a href="/register">Register</a></h3></b></body></html>\n`
      );
    }
  } else {
    res.status(400);
    res.send(
      `<html><body><h1>Error:400</h1> <h2><b>Email and Password cannot be empty!!!</h2><h3><a href="/register">Register</a></h3></b></body></html>\n`
    );
  }
});

app.get("/login", (req, res) => {
  const username = req.body.username;
  const templateVars = { username };
  if (!username) {
    res.render("login", templateVars);
  } else {
    res.redirect("/urls");
  }});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if(email && password) {
    if(existingEmail(users, email)) {
      if(checkPassword(users, email, password)) {
        res.cookie("user_id", getUserByEmail(users, email));
        res.redirect("/urls");
      } else {
        res.status(403);
        res.send(`<html><body><h1>Error:403</h1> <h2><b>Please check your password!</h2><h3><a href="/login">Login</a></h3></b></body></html>\n`);
      }
    } else {
      res.status(403);
      res.send(`<html><body><h1>Error:403</h1> <h2><b>This email(${email}) is not registered!\n Please Register first!</h2><h3><a href="/register">Register</a></h3></b></body></html>\n`);
    }
  } else {
    res.status(403);
    res.send(`<html><body><h1>Error:403</h1> <h2><b>Email and Password cannot be empty!!!</h2><h3><a href="/login">Login</a></h3></b></body></html>\n`);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  // add new urls to database & make short url to match
  const shortURL = genRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
