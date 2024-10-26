const express = require('express');
const router = express.Router();
const multer = require("multer");
const UserController = require("../controllers/user-controller");
const authToken = require("../middleware/auth");




const uploadsDestination = "uploads";

const storage = multer.diskStorage({
    destination:uploadsDestination,
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});
const uploads = multer({ storage: storage });
router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/current", authToken, UserController.current)
router.get("/users/:id",authToken, UserController.getUserById)
router.put("/users/:id",authToken, UserController.updateUser)




module.exports = router;
