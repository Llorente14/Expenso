const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

app.use(bodyParser.urlencoded());
//Agar mudah dalam redirect di ejs
app.locals.baseURL = "http://localhost:3000";
app.set("view engine", "ejs");

app.use(express.static("public"));

//Enabling session

// Routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const dashboard = require("./routes/dashboard");
const expenses = require("./routes/expenses");

app.use("/", index);
app.use("/auth", auth);
app.use("/", dashboard);
app.use("/", expenses);

app.listen(3000);
console.log("Server is running on port 3000");
console.log("http://localhost:3000");
