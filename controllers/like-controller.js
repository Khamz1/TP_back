const {prisma} = require("../prisma/prisma-client");

const LikeController = {
    likePost: async (req, res) => {
        const {postId}=req.body;
        const userId = req.user.userId;

        if(!postId){
            return res.status(400).send({error: 'All fields are required'});
        }
        try{
            const existingLike = await prisma.like.findFirst({
                where:{
                    postId,
                    userId,
                }
            })
            if(existingLike){
                return res.status(400).send({error: 'Like already exists'});
            }

            const like = await prisma.like.create({
                data:{postId, userId}
            })
            res.json(like)
        }
        catch(err){
            console.error("Error in like:", err);
            res.status(500).json({error:"Internal Server Error"});
        }

    },
    unLikePost: async (req, res) => {
        const {id} = req.params;
        const userId = req.user.userId;

        if(!id){
            res.status(400).send({error: 'You disliked this post'});
        }
        try{
            const existingLike = await prisma.like.findFirst({
                where:{postId:id,userId}
            })
            if(!existingLike){
                return res.status(400).send({error: 'You cant mark is disliked'});
            }
            const like = await prisma.like.deleteMany({
                where:{postId:id,userId}
            })
            res.json(like)
        }
        catch(err){
            console.error("Error in unlike:", err);
            res.status(500).json({error:"Internal Server Error"});
        }
    }
}

module.exports = LikeController