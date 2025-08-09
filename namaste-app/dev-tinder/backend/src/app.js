const express = require("express");

const app = express();

app.get("/route", (req, res) => { 
  // here '/route' could be any (text ('/abc'), regex ('/.*fly/'), regular expression (ab+c, ab?c, ab*c))
  res.send({ path: '/route' });
});

app.get("/user/:name/:id", (req, res) => { // for example, /user/Navneet/29474?msg=Hello
  // here '/:name' & '/:id' are route parameters that capture dynamic values from the URL
  console.log(req.params);

  // here 'msg' is a query parameter that can be accessed via req.query
  console.log(req.query.msg);
  res.send({ name: "Navneet Gupta", email: "navneet@gmail.com" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

