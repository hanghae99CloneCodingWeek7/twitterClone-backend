const mongoose = require("mongoose"); // 몽구스를 사용하겠다는 선언

// 몽구스로 post라는 객체는 이런 모양으로 받겠다고 선언
const CommentSchema = new mongoose.Schema({
  post_id: {
    type: String, // 이건 문자열로 써야 합니다.
    required: true, // 필수로 들어와야 합니다.
  },
  user_id: {
    type: String, // 이건 문자열로 써야 합니다.
    required: true, // 필수로 들어와야 합니다.
  },
  CONTENT: {
    type: String,
    required: true,
  },
  TIMESTAMPS: {
    type: Date, // 이건 날짜 형태로 받을게요~!
    required: true,
  },
});

// 이로써 Comments 관련 DB는, 여기서 만든 몽구스 모델을 기준으로 받겠다고 외부에 선언/공개합니다.
module.exports = mongoose.model("Comments", CommentSchema);
