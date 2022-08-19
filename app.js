// express 모듈을 불러오고, 보안(CORS),포트 등 환경 초기화
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Http = require("http");
const Https = require("https");

// 환경변수 모듈 불러오기 (process.env. + 변수 설정) -> process.env. 객체 사용 가능
const dotenv = require("dotenv");
dotenv.config();

// express 객체 선언, 각종 middleware 설치
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS OPTION 적용
const corsOption = {
  origin: ["http://localhost:3000", "http://nodeapi.myspaceti.me:8002"],
  credentials: true,
};
app.use(cors(corsOption));

// mongoDB에 연결
const connect = require("./schemas/index.js");
connect();
// "/api" path로 연결하는 라우터 연결 (우선 routes/index.js로)
const indexRouter = require("./routes/index.js");
app.use("/api", [indexRouter]);

// HTTPS 연결 관련
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
http.listen(http_port, () => {
  console.log(`Start listening HTTP Server on ${http_port}`);
});

https.listen(https_port, () => {
  console.log(`Start listening HTTPS Server on ${https_port}`);
});

module.exports = app;
