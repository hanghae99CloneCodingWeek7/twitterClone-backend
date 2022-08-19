const USERS = require("../schemas/user");

// ----- 내 프로필 -----
// TASK 1 : 내 프로필 조회
exports.getProfile = async (req, res) => {
  res.send("GET /api/profiles/");
};
// TASK 2 : 내 프로필 수정
exports.updateProfile = async (req, res) => {
  res.send("PUT /api/profiles/");
};

// ----- following 기능 -----
// TASK 3 : _id를 가진 유저가 팔로잉 하는 유저들의 리스트
exports.userFollows = async (req, res) => {
  res.send("GET /api/profiles/:_id/followings");
};
// TASK 4 : _id를 가진 유저를 팔로잉 하는 유저들의 리스트
exports.userFollowedBy = async (req, res) => {
  res.send("GET /api/profiles/:_id/followers");
};
// TASK 5 : 로그인된 유저가 _id 유저를 팔로우
exports.followAction = async (req, res) => {
  res.send("POST /api/profiles/follow/:_id");
};

// ----- 다른유저 프로필 ----
// TASK 6 : 특정 유저(:_id)의 프로필 보기
exports.getOthersProfile = async (req, res) => {
  res.send("GET /api/profiles/:_id");
};
// TASK 7 : 프로필을 검색하여, 리스트로 보기
exports.searchProfiles = async (req, res) => {
  res.send("GET /api/profiles/search?key=넷플릭스");
};
