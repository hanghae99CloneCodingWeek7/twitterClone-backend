const COMMENTS = require("../schemas/comment");


//게시글에 댓글작성 목록 조회
exports.getAllComments = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다' });
            return;
        }
        const comments = await COMMENTS.find({ post_id: postId })

        let result = [];

        for (const comment of comments) {
            result.push({
                post_id: comment.post_id,
                CONTENT: comment.CONTENT,
                TIMESTAMPS: comment.TIMESTAMPS,
            });
        }
        res.status(200).json(result);
    } catch (error) {
        const message = `${req.method} ${req.originalUrl} : ${error.message}`;
        console.log(message);
        res.status(400).json({ message });

    }
};


//게시글에 댓글작성 
exports.getCreateComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const { CONTENT } = req.body;
        const { _id } = res.locals.user;
        if (!CONTENT) {
            res.status(411).json({ mesaage: '댓글내용을입력해주세요!' })
            return;
        }
        if (!postId || !_id) {
            res.status(412).json({ mesaage: '권한이 없습니다' });
            return;
        }
        const createdComment =await COMMENTS.create({
            post_id: postId, user_id: _id, CONTENT, TIMESTAMPS: new Date()
        })
        // await COMMENTS.create({ post_id: postId, user_id: _id, CONTENT, TIMESTAMPS: new Date() });
        res.status(201).json({ statusCode: 201,createdComment_id : createdComment.id })

    } catch (error) {
        const message = `${req.method} ${req.originalUrl} : ${error.message}`;
        console.log(message);
        res.status(400).json({ message });
    }
};

//댓글 수정
exports.getUpdateComments = async (req, res) => {
    try {
        const { _id } = res.locals.user;
        const { comment_Id, CONTENT } = req.body;
        console.log( _id);
        const commentExist = await COMMENTS.findOne({ _id: comment_Id });
        const foundComment = await COMMENTS.findOne({ _id: comment_Id, user_id: _id });

        if (!commentExist) {
            res.send({
                statusCode: 411,
                errReason: "지정한 댓글이 없습니다",
            });
            return;
        } else if (!foundComment) {
            res.send({
                statusCode: 412,
                errReason: "권한이 없습니다.",
            });
            return;
        }

        const updatedComment = await COMMENTS.findOneAndUpdate({
            _id: comment_Id,
        }, {
            $set: { CONTENT }
        }
        );
        res.status(201).json({ statusCode: 201, updatedComment_id: updatedComment._id });
        return;
    } catch (error) {
        const message = `${req.method} ${req.originalUrl} : ${error.message}`;
        console.log(message);
        return res.send({
            statusCode: 400,
            errReason: message,
        });
    }
}

// 댓글삭제 

exports.getDeleteComments = async (req, res) => {
    try {
        const { _id } = res.locals.user;
        const { comment_Id } = req.body;

        const commentExist = await COMMENTS.findOne({ _id: comment_Id });
        const foundComment = await COMMENTS.findOne({ _id: comment_Id, user_id: _id });

        if (!commentExist) {
            res.send({
                statusCode: 411,
                errReason: "지정한 댓글이 없습니다",
            });
            return;
        } else if (!foundComment) {
            res.send({
                statusCode: 412,
                errReason: "권한이 없습니다.",
            });
            return;
        }

        
        const deletedComment = await COMMENTS.deleteOne({
            _id: comment_Id,
        }, 
        );
        res.status(201).json({ statusCode: 201, deletedComment_id: deletedComment._id });
        return;
    } catch (error) {
        const message = `${req.method} ${req.originalUrl} : ${error.message}`;
        console.log(message);
        return res.send({
            statusCode: 400,
            errReason: message,
        });
    }
}

