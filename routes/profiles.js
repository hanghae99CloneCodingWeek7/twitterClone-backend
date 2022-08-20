// app.js -> index.js의 Router를 통해 들어온 이파일은,
// 기본값 'api/profiles'로 연결된 요청을 처리합니다.

// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router();
const profiles = require("../controller/profiles");
const auth = require("../controller/auth");

// TASK 1 : 내 프로필 조회
router.get("/", auth.authMiddleware, profiles.getProfile);
// TASK 2 : 내 프로필 수정
router.put("/", auth.authMiddleware, profiles.updateProfile);
// TASK 5 : 로그인된 유저가 _id 유저를 팔로우
router.put("/follow/:_id", auth.authMiddleware, profiles.followAction);
// TASK 6 : 로그인된 유저가 _id 유저를 언팔로우
router.put("/unfollow/:_id", auth.authMiddleware, profiles.unfollowAction);
// TASK 8 : 프로필을 검색하여, 리스트로 보기
router.get("/search", auth.authMiddleware, profiles.searchProfiles);
// TASK 3 : _id를 가진 유저가 팔로잉 하는 유저들의 리스트
router.get("/:_id/followings", auth.authMiddleware, profiles.userFollows);
// TASK 4 : _id를 가진 유저를 팔로잉 하는 유저들의 리스트
router.get("/:_id/followers", auth.authMiddleware, profiles.userFollowedBy);
// TASK 7 : 특정 유저(:_id)의 프로필 보기
router.get("/:_id", auth.authMiddleware, profiles.getOthersProfile);

// 이 파일의 router 객체를 외부에 공개합니다.
module.exports = router;
