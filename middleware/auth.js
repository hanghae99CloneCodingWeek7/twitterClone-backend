module.exports = {
  ensureAuth: function (req, res, next) {
    console.log("------ 🤔 Authorization Checking ------");
    if (req.isAuthenticated()) {
      console.log("------ ✅  Authorization Checked ------");
      return next();
    } else {
      res.redirect("/api");
    }
  },

  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/api/posts");
    } else {
      return next();
    }
  },
};

// // 임시 인증절차 middleware (모두 tester1로 통과)
// exports.authMiddleware = async (req, res, next) => {
//     try {
//       console.log("------ 🤔 Authorization Checking ------");

//       let user = await USERS.findOne({ USER_ID: "tester1" }); // 임시 통과

//       console.log("------ ✅  Authorization Checked ------");

//       // 다 통과하면 토큰을 복호화하여 user 정보를 다음 미들웨어가 사용할 수 있는 형태로 넘겨준다.
//       res.locals.user = user;
//       next();
//       return;

//       // 에러 생기면 에러메세지
//     } catch (e) {
//       return res.send({
//         statusCode: 400,
//         message: "로그인 후 사용하세요",
//       });
//     }
//   };
