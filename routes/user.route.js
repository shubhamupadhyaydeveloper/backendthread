const express = require("express")
const {signupUser , loginUser , logoutUser , followUnfollowUser , upadateUserprofile ,getProfile} = require('../controllers/user.controler')
const {storage} = require('../utils/storage')
const multer = require('multer')
const upload = multer({storage})
const router = express.Router()
const protectedRoute = require('../middleware/protect.route')

router.get('/profile/:id', getProfile)
router.post('/signup' , signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/follow/:id' , protectedRoute, followUnfollowUser)
router.put('/update/:id' , upload.array('profilePic',20) , protectedRoute , upadateUserprofile)

module.exports = router;