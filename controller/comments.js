const COMMENTS = require("../schemas/comment");
const USERS = require("../schemas/user");


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
            res.status(400).json({ mesaage: '댓글내용을입력해주세요!' })
            return;
        }
        if (!postId || !_id) {
            res.status(400).json({ mesaage: '해당게시물을찾을수없습니다' });
            return;
        }
        await COMMENTS.create({ post_id: postId, USER_ID: _id, CONTENT, TIMESTAMPS: new Date() });
        res.status(201).json({ message: "댓글을 생성하였습니다" })

    } catch (error) {
        const message = `${req.method} ${req.originalUrl} : ${error.message}`;
        console.log(message);
        res.status(400).json({ message });
    }
};

//댓글수정
exports.getUpdateComments = async (req, res) => {
    try {
        const { _id } = res.locals.user;
        const { postId } = req.params;
        const { CONTENT } = req.body;

        if (!CONTENT) {
            res.status(400).json({ mesaage: '댓글내용을입력해주세요!' })
            return;
        }
        if (!postId || !_id) {
            res.status(400).json({ mesaage: '작성자가 일치하지않습니다' });
            return;
        }//수정 그게시물의 작성자 id랑 로그인한 id랑 같지않으면 권한이없게 만들기

        await COMMENTS.updateOne({ post_id: postId }, { $set: { CONTENT } });

        res.status(201).json({ message: '댓글을 수정하였습니다' });


    } catch (error) {
        const message = `${req.method} ${req.originalUrl} : ${error.message}`;
        console.log(message);
        res.status(400).json({ message });
    };
};

//댓글삭제 
exports.getDeleteComments = async (req, res) => {
    try {
        const { _id } = res.locals.user;
        const { postId } = req.params;


        if (!postId || !_id) {
            res.status(400).json({ mesaage: '작성자가 일치하지않습니다' });
            return;
        }//수정 그게시물의 작성자 id랑 로그인한 id랑 같지않으면 권한이없게 만들기

        await COMMENTS.deleteOne({ post_id: postId });
        res.status(201).json({ message: "댓글을 삭제하였습니다." });
    } catch (error) {
        const message = `${req.method} ${req.originalUrl} : ${error.message}`;
        console.log(message);
        res.status(400).json({ message });

    }
}