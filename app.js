const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

//FORMAT OF TOKEN
//Authorization: Bearer: <access_toekn>

// Verify Token
const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the sapce
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "I'm salty", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({ message: "Post created...", authData });
    }
  });
});

app.post("/api/login", (req, res) => {
  // Mock user
  const user = {
    id: 1,
    username: "Dennis",
    email: "dennis@mockmail.com"
  };
  const userToken = jwt.sign(
    { id: user.id, username: user.username },
    "I'm salty",
    { expiresIn: 30 }
  );

  res.json({ userToken });
});

app.listen(5000, () => console.log("Server started on port 5000"));
