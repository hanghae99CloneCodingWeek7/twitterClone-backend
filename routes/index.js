// '/api'로 들어온 경우에 '/api/posts' '/api/comments'로 연결해주는 역할을 함

// express와 이 파일의 router 객체 초기화
const express = require("express");
const router = express.Router();

// '/api', '/api/posts' '/api/comments'로 들어오는 건 아래 두 파일 (comments.js, posts.js)에서 처리하겠다는 내용
const authRouter = require("./auth.js");
const postsRouter = require("./posts.js");
const commentsRouter = require("./comments.js");
router.use("/posts", [postsRouter]);
router.use("/comments", [commentsRouter]);
router.use("/", [authRouter]);

// 이 파일에서 만든 router 객체를 외부에 공개 -> app.js에서 사용할 수 있도록
module.exports = router;
