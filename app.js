const express = require("express");
const app = express();
const PORT = 8082;
const { sequelize } = require("./models");
const indexRouter = require("./routes");
const serverPerfix = "/api-server";
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();

// express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// /api-server
app.use(serverPerfix, indexRouter);

sequelize
  .sync({ force: true, alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("database sync 오류!");
  });
