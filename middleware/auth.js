const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const { Authorization } = req.headers;
  const [type, token] = (Authorization || "").split(" ");
  //인증 Bearer타입
  if (!token || type !== "Bearer") {
    res.status(401).json({ message: "로그인 후 사용이 가능합니다." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    await User.findIdxById(payload.userId, (err, data) => {
      if (err) {
        return res.status(403).json({ message: "사용자 인증 오류" });
      }
      //req.user = data[0].USER_IDX;
      res.locals.user = data[0];

      next();
    });
  } catch (error) {
    return res.status(403).json({ message: "사용자 인증 오류" });
  }
};
// module.exports = {
//   ensureAuth: function (req, res, next) {
//     console.log("------ 🤔 Authorization Checking ------");
//     if (req.isAuthenticated()) {
//       console.log("------ ✅  Authorization Checked ------");
//       return next();
//     } else {
//       res.redirect("/api");
//     }
//   },

//   ensureGuest: function (req, res, next) {
//     if (req.isAuthenticated()) {
//       res.redirect("/api/posts");
//     } else {
//       return next();
//     }
//   },
// };

// // // 임시 인증절차 middleware (모두 tester1로 통과)
// // exports.authMiddleware = async (req, res, next) => {
// //     try {
// //       console.log("------ 🤔 Authorization Checking ------");

// //       let user = await USERS.findOne({ USER_ID: "tester1" }); // 임시 통과

// //       console.log("------ ✅  Authorization Checked ------");

// //       // 다 통과하면 토큰을 복호화하여 user 정보를 다음 미들웨어가 사용할 수 있는 형태로 넘겨준다.
// //       res.locals.user = user;
// //       next();
// //       return;

// //       // 에러 생기면 에러메세지
// //     } catch (e) {
// //       return res.send({
// //         statusCode: 400,
// //         message: "로그인 후 사용하세요",
// //       });
// //     }
// //   };
