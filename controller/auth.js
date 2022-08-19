// app.js -> index.js의 Router를 통해 들어온 이파일은,
// 기본값 'api/posts'로 연결된 요청을 처리합니다.

// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router();

// 이 파일에서 사용할 post DB가 어떻게 생겼는지 불러옵니다. (schema/post.js)
const USERS = require("../schemas/user");

//  ---------------- 여기부터 API 시작 ----------------

// ------------------
// TASK 1 : 회원가입
exports.registerPage = async (req, res) => {
  res.render("register");
};

exports.register = async (req, res) => {
  res.send("This is register page");
};

//TASK 2: 로그인
exports.loginPage = async (req, res) => {
  res.send("This is login page");
};

exports.login = async (req, res) => {
  res.send("This is login page");
};
