const {prisma} = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const jdenticon = require("jdenticon");
const path = require("path");
const fs = require("node:fs");
const UserController = {
    register: async (req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send({ error: 'Все поля обязательны' });
        }
        try {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: "Такой пользователь уже зарегистрирован" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const png = jdenticon.toPng(name, 200);
            const avatarName = `${name}_${Date.now()}.png`;
            const uploadDir = path.join(__dirname, "../uploads");

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            const avatarPath = path.join(uploadDir, avatarName);
            fs.writeFileSync(avatarPath, png);

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    avatarUrl: avatarPath,
                },
            });

            res.json(user);
        } catch (error) {
            console.error("Error in registering user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    login: async (req, res)=> {
        res.send("login")
    },
    getUserById: async (req, res)=> {
        res.send("getUserById")
    },
    updateUser: async (req, res)=> {
        res.send("updateUser")
    },
    current: async (req, res)=> {
        res.send("current")
    },


}

module.exports = UserController;