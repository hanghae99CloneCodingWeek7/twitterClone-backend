// app.js -> index.js의 Router를 통해 들어온 이파일은,
// 기본값 'api/comments'로 연결된 요청을 처리합니다.

// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router();
const comments = require("../controller/comments");
const auth = require("../controller/auth");
// 이 파일에서 사용할 post DB가 어떻게 생겼는지 불러옵니다. (schema/post.js)



//  ---------------- 여기부터 API 시작 ----------------


// TASK 1 : 댓글 조회 with GET ('/api/comments')
router.get("/:postId",auth.authMiddleware,comments.getAllComments)
// TASK 2 : 댓글 작성 with POST ('/api/comments')
router.post("/:postId",auth.authMiddleware, comments.getCreateComments)
// TASK 3 : 댓글 수정 with POST ('/api/comments')
router.put("/:commentId",auth.authMiddleware, comments.getUpdateComments)
// // TASK 4 : 댓글 삭제 with POST ('/api/comments')
router.delete("/:commentId", auth.authMiddleware,comments.getDeleteComments)

// 이 파일의 router 객체를 외부에 공개합니다.
module.exports = router;
