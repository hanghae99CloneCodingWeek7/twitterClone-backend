// app.js -> index.js의 Router를 통해 들어온 이파일은,
// 기본값 'api/posts'로 연결된 요청을 처리합니다.

// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router();
const posts = require("../controller/posts");
const auth = require("../controller/auth");

//  ---------------- 여기부터 API 시작 ----------------

// ------------------
// TASK 1 : 게시글 조회 with GET ('/api/posts')
router.get("/", auth.authMiddleware, posts.getPostsAll);
// TASK 2 : 게시글 작성 with POST ('/api/posts')
router.post("/", auth.authMiddleware, posts.createPost);
// TASK 3 : 게시글 수정 with PUT ('/api/posts')
router.put("/", auth.authMiddleware, posts.updatePost);
// TASK 4 : 게시글 삭제 with DELETE ('/api/posts')
router.delete("/", auth.authMiddleware, posts.deletePost);

// 이 파일의 router 객체를 외부에 공개합니다.
module.exports = router;
