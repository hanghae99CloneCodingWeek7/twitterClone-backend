// app.js -> index.js의 Router를 통해 들어온 이파일은,
// 기본값 'api/posts'로 연결된 요청을 처리합니다.

// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router();

// 이 파일에서 사용할 post DB가 어떻게 생겼는지 불러옵니다. (schema/post.js)
const USERS = require("../schemas/user.js");

//  ---------------- 여기부터 API 시작 ----------------

// ------------------
// TASK 1 : 회원가입
router.post("/signup", async (req, res) => {
  res.json({ data: "post /api/signup" });
});

// ------------------
// TASK 2 : 로그인
router.post("/login", async (req, res) => {
  res.json({ data: "POST /api/login" });
});
router.get("/", async (req, res) => {
  res.send("Hello world");
});

// 이 파일의 router 객체를 외부에 공개합니다.
module.exports = router;
