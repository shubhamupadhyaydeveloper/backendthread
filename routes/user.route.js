const express = require("express")
const {signupUser , loginUser , logoutUser , followUnfollowUser , upadateUserprofile ,getProfile} = require('../controllers/user.controler')
const router = express.Router()
const protectedRoute = require('../middleware/protect.route')

router.get('/profile/:id', getProfile)
router.post('/signup' , signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/follow/:id' , protectedRoute, followUnfollowUser)
router.post('/update/:id' , protectedRoute , upadateUserprofile)

module.exports = router;