const COMMENTS = require("../schemas/comment");



exports.getAllComments = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다' });
            return;
        }
        const comments = await COMMENTS.find({ postId: postId })

        let result = [];

        for (const comment of comments) {
            result.push({
                commentId: comment.postId,
                user_id: comment.user_id,
                CONTENT: comment.CONTENT,
                TIMESTAMPS: comment.TIMESTAMPS,
            });
        }
        res.status(200).json({ data: result });
    } catch (error) {
        const message = `${req.method} ${req.originalUrl} : ${error.message}`;
        console.log(message);
        res.status(400).json({ message });

    }
};



exports.getCreateComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const {userId,password,content } =req.body;
        
        if(!content){
            res.status(400).json({ mesaage :'댓글내용을입력해주세요!'})
            return;
        }
        if(!postId || !userId || !password){
            res.status(400).json({mesaage : '데이터형식이올바르지않습니다'});
            return;
        }
        await COMMENTS.create({ post_id :postId ,userId ,password ,content });
        res.status(201).json({ message :"댓글을 생성하였습니다"})
        
    } catch (error) {
        const message = `${req.method} ${req.originalUrl} : ${error.message}`;
        console.log(message);
        res.status(400).json({ message });
    }
};


exports.getUpdateComments = async (req, res) => {
    try {

    } catch (error) {

    }
};

