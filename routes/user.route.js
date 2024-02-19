const express = require("express")
const {signupUser , loginUser , logoutUser , followUnfollowUser , upadateUserprofile ,getProfile, getFeed, recommendedUser} = require('../controllers/user.controler')
const {storage} = require('../utils/storage')
const multer = require('multer')
const upload = multer({storage})
const router = express.Router()
const protectedRoute = require('../middleware/protect.route')

router.get('/profile/:query', getProfile)
router.get("/recommended",protectedRoute , recommendedUser)
router.get('/feed',protectedRoute ,getFeed)
router.post('/signup' , signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/follow/:id' , protectedRoute, followUnfollowUser)
router.put('/update/:id' , upload.single("profilePic") , protectedRoute , upadateUserprofile)


module.exports = router;