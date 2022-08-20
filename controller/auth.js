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
exports.registerDirect = async (req, res) => {
  // 로그인 상태가 아닐 때 진행
  if (req.cookies.token) {
    return res.send({
      statusCode: 400,
      message: "이미 로그인이 되어있습니다.",
    });
  }

  // joi validation 객체
  const signupSchema = Joi.object({
    USER_ID: Joi.string().min(6).max(12).alphanum().required(),
    PASSWORD: Joi.string().min(5).max(12).alphanum().required(),
    CONFIRM: Joi.string().min(5).max(12).alphanum().required(),
    EMAIL: Joi.string().email().required(),
    FIRST_NAME: Joi.string().max(20).alphanum().required(),
    LAST_NAME: Joi.string().max(20).alphanum().required(),
    PROFILE_PIC: Joi.string(),
  });

  try {
    // joi 객체의 스키마를 잘 통과했는지 확인
    const {
      USER_ID,
      PASSWORD,
      CONFIRM,
      EMAIL,
      FIRST_NAME,
      LAST_NAME,
      PROFILE_PIC,
    } = await signupSchema.validateAsync(req.body);

    // 기타 확인
    if (PASSWORD !== CONFIRM) {
      return res.send({
        statusCode: 400,
        message: "입력하신 두개의 비밀번호가 다릅니다.",
      });
    }
    if (PASSWORD.includes(USER_ID)) {
      return res.send({
        statusCode: 400,
        message: "비밀번호는 ID를 포함할 수 없습니다.",
      });
    }

    // USER_ID, Email 존재 확인
    const isExistId = await USERS.findOne({ USER_ID });
    console.log(isExistId, USER_ID);
    const isExistEmail = await USERS.findOne({ EMAIL });
    if (isExistId) {
      return res.send({
        statusCode: 400,
        message: "이미 가입된 ID 입니다.",
      });
    }
    if (isExistEmail) {
      return res.send({
        statusCode: 400,
        message: "이미 가입된 이메일 입니다.",
      });
    }

    //
    const PASSWORD_SALT = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(PASSWORD, PASSWORD_SALT);

    // signUp 서비스 진행해보고 결과 응답
    const createdUser = await USERS.create({
      USER_ID,
      PASSWORD: hashedPassword,
      EMAIL,
      FIRST_NAME,
      LAST_NAME,
      PROFILE_PIC,
      REGISTER_FROM: "web",
      DISPLAY_NAME: FIRST_NAME + " " + LAST_NAME,
      TIMESTAMPS: new Date(),
    });

    return res
      .status(201)
      .send({ statusCode: 201, createdUser_id: createdUser._id });
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
  const loginSchema = Joi.object({
    USER_ID: Joi.string().min(6).max(12).alphanum().required(),
    PASSWORD: Joi.string().min(5).max(12).alphanum().required(),
  });

  try {
    // joi 객체의 스키마를 잘 통과했는지 확인
    const { USER_ID, PASSWORD } = await loginSchema.validateAsync(req.body);

    if (req.cookies.token) {
      return res.send({
        statusCode: 400,
        message: "이미 로그인이 되어있습니다.",
      });
    }

    const userOnDB = await USERS.findOne({ USER_ID });
    const isSuccess = bcrypt.compareSync(PASSWORD, userOnDB.PASSWORD); // True or False

    if (isSuccess) {
      return res
        .cookie("token", "로그인 성공", {
          sameSite: "Strict",
          maxAge: 30000, // 30sec
          httpOnly: true,
        })
        .status(200)
        .send({
          statusCode: 200,
          token: "로그인 성공",
          message: "로그인에 성공했습니다.",
        });
    }
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    return res.send({
      statusCode: 400,
      errReason: message,
      message: "입력하신 아이디와 패스워드를 확인해주세요.",
    });
  }
};

// 임시 인증절차 middleware (모두 tester1로 통과)
exports.authMiddleware = async (req, res, next) => {
  try {
    console.log("------ 🤔 Authorization Checking ------");

    let user = await USERS.findOne({ USER_ID: "tester1" }); // 임시 통과

    console.log("------ ✅  Authorization Checked ------");

    // 다 통과하면 토큰을 복호화하여 user 정보를 다음 미들웨어가 사용할 수 있는 형태로 넘겨준다.
    res.locals.user = user;
    next();
    return;

    // 에러 생기면 에러메세지
  } catch (e) {
    return res.send({
      statusCode: 400,
      message: "로그인 후 사용하세요",
    });
  }
};
