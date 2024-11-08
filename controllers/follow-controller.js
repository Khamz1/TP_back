const {prisma} = require("../prisma/prisma-client")

const  FollowController = {
    followUsers: async (req, res) => {
        const {followingId} = req.body;
        const userId = req.user.userId;

        if(followingId===userId){
            return res.status(403).send({error:"You can not follow yourself"})
        }

        try{
            const existingSubscription = await prisma.follows.findFirst({
                where:{
                    AND:[
                        {followerId:userId},
                        {followingId}
                    ]
                }
            })
            if(existingSubscription){
                return res.status(403).send({error:"You already follow this user"})
            }
            await prisma.follows.create({
                data:{
                    follower:{connect:{id:userId}},
                    following:{connect:{id:followingId}},
                }
            })
            res.status(201).send({error:"You already following this user"})
        }
        catch (err){
            console.error("Error in Following", err);
            res.status(500).json({error:"Internal Server Error"});
        }
    },
    unfollowUsers: async (req, res) => {
        const {followingId} = req.body;
        const userId = req.user.userId;

        try{
            const follows = await prisma.follows.findFirst({
                where:{
                    AND:[
                        {followerId:userId},
                        {followingId}
                    ]
                }
            })
            if(!follows){
                return res.status(404).send({error:"You not follow this user"})
            }

            await prisma.follows.delete({
                where:{id:follows.id}
            })
            res.status(201).send({message:"You unfollow this user"})
        }
        catch (err){
            console.error("Error in Unfollow", err);
            res.status(500).json({error:"Internal Server Error"});
        }

    },
}

module.exports = FollowController