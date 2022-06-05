const express = require("express");
const app = express();

app.listen(5000, () => {
  console.log("Server Started");
});

app.get('/signup',() => {
    console.log("Sign Up");
})
