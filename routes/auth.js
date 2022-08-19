// app.js -> index.js의 Router를 통해 들어온 이파일은,
// 기본값 'api/posts'로 연결된 요청을 처리합니다.

// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");

//TASK 1 : 메인화면
router.get("/", async (req, res) => {
  res.render("main");
});

// TASK 2 : 회원가입
router.route("/signup").get(auth.registerPage).post(auth.register);

// TASK 3 : 로그인
router.route("/login").get(auth.loginPage).post(auth.login);

// 이 파일의 router 객체를 외부에 공개합니다.
module.exports = router;
