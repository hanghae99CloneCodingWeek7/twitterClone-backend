// app.js -> index.js의 Router를 통해 들어온 이파일은,
// 기본값 'api/posts'로 연결된 요청을 처리합니다.

// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router();

// 이 파일에서 사용할 post DB가 어떻게 생겼는지 불러옵니다. (schema/post.js)
const POSTS = require("../schemas/post.js");

//  ---------------- 여기부터 API 시작 ----------------

// ------------------
// TASK 1 : 게시글 조회 with GET ('/api/posts')
router.get("/", async (req, res) => {
  res.json({ data: "GET /api/posts" });
});

// ------------------
// TASK 2 : 게시글 작성 with POST ('/api/posts')
router.post("/", async (req, res) => {
  res.json({ data: "POST /api/posts" });
});

// ------------------
// TASK 3 : 게시글 상세조회 with GET ('/api/posts/:_postId')
router.get("/:_postId", async (req, res) => {
  res.json({ data: "GET /api/posts/:_postId" });
});

// 이 파일의 router 객체를 외부에 공개합니다.
module.exports = router;
