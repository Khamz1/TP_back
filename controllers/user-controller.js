const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jdenticon = require("jdenticon");
const path = require("path");
const fs = require("node:fs");
const jwt = require("jsonwebtoken");
const UserController = {
    register: async (req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send({ error: 'Все поля обязательны' });
        }
        try {
            const existingUser = await prisma.user.findUnique({where: {email}});
            if (existingUser) {
                return res.status(400).json({error: "Такой пользователь уже зарегистрирован"});
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const png = jdenticon.toPng(name, 200);
            const avatarName = `${name}_${Date.now()}.png`;
            const uploadDir = path.join(__dirname, "../uploads");

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            const avatarPath = path.join(__dirname, "/../uploads", avatarName);
            fs.writeFileSync(avatarPath, png);

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    avatarUrl: `/uploads/${avatarName}`
                },
            });

            res.json(user);
        } catch (error) {
            console.error("Error in registering user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    login: async (req, res)=> {
        const {email, password} = req.body
        if(!email || !password) {
            return res.status(400).json({error:"All fields are required"});
        }
        try{
            const user = await prisma.user.findUnique({where: { email }});
            if (!user) {
                res.status(400).json({error: "Uncorrect email and password"});
            }
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                res.status(400).json({error: "Uncorrect email and password"});
            }
            const token = jwt.sign(({userId:user.id}), process.env.SECRET_KEY, )
            res.json({token})
        }
        catch (error){
           console.error("Error in login:", error);
        }
    },
    getUserById: async (req, res)=> {
        const {id} = req.params;
        const user = req.user.userId;
        try{
            const user = await prisma.user.findUnique({
                where: { id },
                include:{
                    followers:true,
                    following:true
                }
            });
            if(!user){
                res.status(404).json({error:"User not found"});
            }

            const isFollowing = await  prisma.follows.findFirst({
                where:{
                    AND:[
                        {followerId:user.id},
                        {followingId:id}
                    ]
                }
            })
            res.json({...user, isFollowing:Boolean(isFollowing)});
        } catch (err){
            console.error("Get User Id Error",err)
            res.status(500).json({error:"User not found"});}
    },
    updateUser: async (req, res)=> {
        const {id} = req.params;
        const {name, email, dateOfBirth, bio, location} = req.body

        let filePath;

        if(req.file && req.file.path) {
            filePath = req.file.path;
        };

        if (id !== req.user.userId) {
            console.log("User ID in token:", req.user.userId);
            console.log("ID in request params:", id);
            return res.status(403).json({ error: "Not access" });
        }
        try{
            if(email){
                const existingUser = await prisma.user.findFirst({
                    where:{email:email},
                })
                if (existingUser && existingUser.id!==id){
                    return res.status(400).json({error:"Email already in use"});
                } {

                }
            }
            const user = await prisma.user.update({
                where:{id},
                data:{
                    email:email||undefined,
                    name:name||undefined,
                    dateOfBirth:dateOfBirth||undefined,
                    bio:bio||undefined,
                    location:location||undefined,
                    avatarUrl:filePath? `/${filePath}`:undefined

                }

            })
            res.json(user)
        } catch(err){
            console.error("Error in update user:", err);
            res.status(500).json({error:"Internal Server Error"});
        }
    },
    current: async (req, res)=> {
        try{
            const user = await prisma.user.findUnique({
                where:{
                    id:req.user.userId
                },
                include:{
                    followers:{
                        include:{
                            follower:true
                        }
                    },
                    following:{
                        include:{
                            following:true
                        }
                    }
                }
            })

            if(!user){
                return res.status(404).json({error:"User not found"});
            }
            res.json(user)
        } catch(err){
            console.error("Error in current user:", err);
            res.status(500).json({error:"Internal Server Error"});
        }
    },


}

module.exports = UserController;