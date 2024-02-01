const express =  require('express')
const protectedRoute = require("../middleware/protect.route")
const router = express.Router()
const {createPost , getPost  , deletePost ,likePost , replyToPost , getFeed} = require("../controllers/post.controllers")

router.get('/:id', getPost )
router.get('/feed' ,  protectedRoute , getFeed)
router.post('/create' , protectedRoute, createPost)
router.delete('/:id', protectedRoute , deletePost)
router.post('/like/:id',protectedRoute ,likePost )
router.post('/reply/:id', protectedRoute , replyToPost)


module.exports = router;