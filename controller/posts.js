// 이 파일에서 사용할 post DB가 어떻게 생겼는지 불러옵니다. (schema/post.js)
const POSTS = require("../schemas/post");
const USERS = require("../schemas/user");

// ------------------
// TASK 1 : 게시글 조회 with GET ('/api/posts')
exports.getPostsAll = async (req, res) => {
  try {
    const { _id, FOLLOWING } = res.locals.user;
    const allPostsOnFeed = await POSTS.find({ user_id: [...FOLLOWING, _id] });

    res.status(200).json({ statusCode: 200, allPostsOnFeed });
    return;
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    return res.send({
      statusCode: 400,
      errReason: message,
    });
  }
};

// ------------------
// TASK 2 : 게시글 작성 with POST ('/api/posts')
exports.createPost = async (req, res) => {
  try {
    const { _id, USER_ID } = res.locals.user;

    // 포스팅 작업
    const { CONTENT, POST_PHOTO_URL } = req.body;
    const createdPost = await POSTS.create({
      user_id: _id,
      USER_ID,
      CONTENT,
      POST_PHOTO: POST_PHOTO_URL,
      TIMESTAMPS: new Date(),
    });

    res.status(201).json({ statusCode: 201, createdPost_id: createdPost._id });
    return;
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    return res.send({
      statusCode: 400,
      errReason: message,
    });
  }
};

// ------------------
// TASK 3 : 게시글 수정 with PUT ('/api/posts')
exports.updatePost = async (req, res) => {
  try {
    const { _id } = res.locals.user;
    const { post_id, CONTENT, POST_PHOTO_URL } = req.body;

    // 본인확인
    const postExist = await POSTS.findOne({ _id: post_id });
    const foundPost = await POSTS.findOne({ _id: post_id, user_id: _id });

    if (!postExist) {
      res.send({
        statusCode: 400,
        errReason: "게시글이 없습니다.",
      });
      return;
    } else if (!foundPost) {
      res.send({
        statusCode: 400,
        errReason: "권한이 없습니다.",
      });
      return;
    }

    // update 작업
    const updatedPost = await POSTS.findOneAndUpdate(
      {
        _id: post_id,
      },
      {
        $set: {
          CONTENT,
          POST_PHOTO: POST_PHOTO_URL,
          TIMESTAMPS: new Date(),
        }, // 나중에 효율화 필요
      }
    );
    res.status(201).json({ statusCode: 201, updatedPost_id: updatedPost._id });
    return;
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    return res.send({
      statusCode: 400,
      errReason: message,
    });
  }
};

// ------------------
// TASK 4 : 게시글 삭제 with DELETE ('/api/posts')
exports.deletePost = async (req, res) => {
  try {
    const { _id } = res.locals.user;
    const { post_id } = req.body;

    // 본인확인
    const postExist = await POSTS.findOne({ _id: post_id });
    const foundPost = await POSTS.findOne({ _id: post_id, user_id: _id });

    if (!postExist) {
      res.send({
        statusCode: 400,
        errReason: "게시글이 없습니다.",
      });
      return;
    } else if (!foundPost) {
      res.send({
        statusCode: 400,
        errReason: "권한이 없습니다.",
      });
      return;
    }

    // delete 작업
    const deletedPost = await POSTS.deleteOne({
      _id: post_id,
    });

    console.log(deletedPost); //{ acknowledged: true, deletedCount: 1 }

    res.status(200).json({ statusCode: 200, deletedPost_id: post_id });
    return;
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    return res.send({
      statusCode: 400,
      errReason: message,
    });
  }
};

// ------------------
// function : _id로 USER_ID 찾기
getUserIdByid = async (_id) => {
  const { USER_ID } = await USERS.findOne({ _id });
  return USER_ID;
};
