// express 모듈을 불러오고, 보안(CORS),포트 등 환경 초기화
const express = require("express");

const cors = require("cors");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const Http = require("http");
const Https = require("https");

const passport = require("passport");
const session = require("express-session");

const connectDB = require("./schemas");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

require("dotenv").config(); // 환경변수 모듈
require("./config/passport")(passport); // passport config

// express 객체 선언, 각종 middleware 설치
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // view engine으로 ejs 사용

// sessions
app.use(
  session({
    secret: process.env.MY_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// CORS OPTION 적용
app.use(
  cors({
    origin: [
      "http://www.myspaceti.me",
      "https://www.myspaceti.me",
      "http://localhost:8002",
      "https://localhost",
      "http://nodeapi.myspaceti.me:8002",
    ],
    credentials: true,
  })
);

// "/api" path로 연결하는 라우터 연결 (우선 routes/index.js로)
const indexRouter = require("./routes/index.js");
app.use("/api", [indexRouter]);

// HTTP / HTTPS 연결 관련
const fs = require("fs");
const options = {
  key: fs.readFileSync("./ssl/www_myspaceti.me.key"),
  cert: fs.readFileSync("./ssl/www_myspaceti.me_cert.crt"),
  ca: fs.readFileSync("./ssl/www_myspaceti.me_chain_cert.crt"),
};
const http = Http.createServer(app);
const https = Https.createServer(options, app);
const http_port = process.env.HTTP_PORT || 3000;
const https_port = process.env.HTTPS_PORT || 443;

// SERVER LISTEN
const start = async () => {
  try {
    http.listen(http_port, () => {
      console.log(`Start listening HTTP Server on ${http_port}`);
    });

    https.listen(https_port, () => {
      console.log(`Start listening HTTPS Server on ${https_port}`);
    });

    await connectDB.connectDB(process.env.MONGO_DB_ACCESS);
  } catch (error) {
    console.log(error);
  }
};
start();

module.exports = app;
