const express = require('express');
const router = express.Router();
const multer = require("multer");
const UserController = require("../controllers/user-controller");
const authToken = require("../middleware/auth");
const {PostContorller, CommentContorller} = require("../controllers");
const {CommentController} = require("../controllers");
const {LikeController} = require("../controllers");
const {FollowController} = require("../controllers");



const uploadsDestination = "uploads";

const storage = multer.diskStorage({
    destination:uploadsDestination,
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});
const uploads = multer({ storage: storage });
// User Routes
router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/current", authToken, UserController.current)
router.get("/users/:id",authToken, UserController.getUserById)
router.put("/users/:id",authToken, UserController.updateUser)

// Post Routes
router.post("/posts",authToken, PostContorller.createPost)
router.get("/posts",authToken, PostContorller.getAllPosts)
router.get("/posts/:id",authToken, PostContorller.getPostById)
router.delete("/posts/:id",authToken, PostContorller.deletePost)

// Comment Routes
router.post("/comments",authToken, CommentController.createComment);
router.delete("/comments/:id",authToken, CommentController.deleteComment);

// Like Routes
router.post("/likes",authToken,LikeController.likePost);
router.delete("/likes/:id",authToken, LikeController.unLikePost);

// Follow Routes
router.post("/follow",authToken,FollowController.followUsers)
router.delete("/follow/:id",authToken,FollowController.unfollowUsers)

module.exports = router;
