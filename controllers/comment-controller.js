const {prisma} = require('../prisma/prisma-client');

const CommentController = {
    createComment: async(req, res) => {
       const {postId, content} = req.body;
       const userId = req.user.userId;

       if (!postId || !content) {
           return res.status(400).send({error: 'All fields are required'});
       }

       try{
           const comment = await prisma.comment.create({
               data:{
                   postId,
                   userId,
                   content
               }
           })
           res.json(comment)
       }
       catch(err){
           console.error("Error in create comment:", err);
           res.status(500).json({error:"Internal Server Error"});
       }
    },
    deleteComment: async(req, res) => {
        const {id} = req.params;
        const userId=req.user.userId;

        try{
            const comment = await prisma.comment.findUnique({where:{id}})
            if(!comment){
                res.status(400).send({error:"Comment not found"});
            }
            if(comment.userId!==userId){
                return res.status(403).send({error:"You don't have permission to delete"});
            }
            await prisma.comment.delete({where:{id}})

            res.json(comment)

        }
        catch(err){
            console.error("Error in deleteComment:", err);
            res.status(500).json({error:"Internal Server Error"});

        }
    }
};

module.exports = CommentController;