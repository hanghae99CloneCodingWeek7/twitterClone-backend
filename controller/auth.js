const MY_SECRET_KEY = process.env.MY_SECRET_KEY;
const Joi = require("joi");
const bcrypt = require("bcryptjs");

// 이 파일에서 사용할 post DB가 어떻게 생겼는지 불러옵니다. (schema/post.js)
const USERS = require("../schemas/user");

// ------------------
// TASK 1 : 회원가입
exports.registerPage = async (req, res) => {
  res.render("register");
};

exports.register = async (req, res) => {
  const signupSchema = Joi.object({
    USER_ID: Joi.string().min(6).max(12).alphanum().required(),
    PASSWORD: Joi.string().min(5).max(12).alphanum().required(),
    CONFIRM: Joi.string().min(5).max(12).alphanum().required(),
    EMAIL: Joi.string().email().required(),
  });

  try {
    // joi 객체의 스키마를 잘 통과했는지 확인
    const { USER_ID, PASSWORD, CONFIRM, EMAIL } =
      await signupSchema.validateAsync(req.body);

    // 기타 확인
    if (PASSWORD !== CONFIRM) {
      return res.send({
        statusCode: 400,
        message: "입력하신 두개의 비밀번호가 다릅니다.",
      });
    }
    if (req.cookies.token) {
      return res.send({
        statusCode: 400,
        message: "이미 로그인이 되어있습니다.",
      });
    }
    if (PASSWORD.includes(USER_ID)) {
      return res.send({
        statusCode: 400,
        message: "비밀번호는 ID를 포함할 수 없습니다.",
      });
    }

    //
    var PASSWORD_SALT = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(PASSWORD, PASSWORD_SALT);

    // signUp 서비스 진행해보고 결과 응답
    const createdUser = await USERS.create({
      USER_ID,
      PASSWORD: hashedPassword,
      PASSWORD_SALT,
      EMAIL,
      TIMESTAMPS: new Date(),
    });

    return res
      .status(200)
      .send({ statusCode: 200, createdUser_id: createdUser._id });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    return res.send({
      statusCode: 400,
      errReason: message,
      message: "입력하신 아이디와 패스워드를 확인해주세요.",
    });
  }
};

//TASK 2: 로그인
exports.loginPage = async (req, res) => {
  res.send("This is login page");
};

exports.login = async (req, res) => {
  res.send("This is login page");
};
