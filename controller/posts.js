// 이 파일에서 사용할 post DB가 어떻게 생겼는지 불러옵니다. (schema/post.js)
const POSTS = require("../schemas/post");

// ------------------
// TASK 1 : 게시글 조회 with GET ('/api/posts')
exports.getPostsAll = async (req, res) => {
  try {
    const { _id } = res.locals.user;
    const allPostsOnFeed = await POSTS.find({ user_id: _id });
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
    const { _id } = res.locals.user;
    // 포스팅 작업
    const { CONTENT, POST_PHOTO_URL } = req.body;
    const createdPost = await POSTS.create({
      user_id: _id,
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
    // const { _id } = res.locals.user;
    // // 본인확인은 authMiddleware에서 완료

    // update 작업
    const { post_id, CONTENT, POST_PHOTO_URL } = req.body;
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
    // const { _id } = res.locals.user;
    // // 본인확인은 authMiddleware에서 완료

    // delete 작업
    const { post_id } = req.body;
    const deletedPost = await POSTS.deleteOne({
      _id: post_id,
    });

    console.log(deletedPost); //{ acknowledged: true, deletedCount: 1 }

    res.status(200).json({ statusCode: 20, deletedPost_id: post_id });
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
