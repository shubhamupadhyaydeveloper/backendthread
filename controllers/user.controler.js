const User = require('../models/user.model')
const generateToken = require('../utils/generate.token')
const cloudinary = require('cloudinary').v2
const bcrypt = require('bcryptjs')

const signupUser = async (req, res) => {

    try {
        const { name, username, email, password } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] })

        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            username,
            email,
            password: hashpassword
        })
        await newUser.save()

        if (newUser) {
            generateToken(newUser._id, res)
            res.status(201).json({
                name: newUser.name,
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                success: 'Signup Successfully'
            })
        } else {
            res.status(400).json({ message: "Userdata is invalid" })
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log('Error in SignupUser', err.message)
    }

}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ message: "Innvalid Username or Password" })
        }

        generateToken(user._id, res)

        res.status(201).json({
            name: user.name,
            username: user.username,
            email: user.email,
            id: user._id,
            success: "Login successfull"
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log('Error in login', err.message)
    }
}

const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 })
        res.status(201).json({ success: 'You logout successfully' })
    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log("Error in logout", err.message)
    }
}

const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const usertoModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if (id === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot follow/unfollow yourself" })
        }

        if (!usertoModify || !currentUser) {
            return res.status(401).json({ message: "User not found" })
        }


        const isFollowing = currentUser.following.includes(id)


        if (isFollowing) {
            //unfollow
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            res.status(200).json({ success: "User unfollowed successfully" })
        } else {
            // follow
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
            await User.findByIdAndUpdate(id, { $push: { followers: req.user_id } })
            res.status(200).json({ success: "User followed successfully" })
        }


    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log("Error in followUnfollowUser", err.message)
    }
}

const upadateUserprofile = async (req, res) => {
    const { id } = req.params;
    const { name, username, bio, email, password } = req.body;
    let { profilePic } = req.body;
    try {
        let user = await User.findById(req.user._id)


        if (!user) return res.status(404).json({ message: "User not found" })

        if (id !== req.user._id.toString()) {
            return res.status(400).json({ message: "UnAuthorised user" })
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(password, salt)
            user.password = hashpassword;
        }

        if (req.file) {

            const profilePicPath = req.file.path;
            const upload = await cloudinary.uploader.upload(profilePicPath)
            profilePic = upload.secure_url;
        }

        user.name = name || user.name
        user.username = username || user.username
        user.bio = bio || user.bio
        user.email = email || user.email
        user.profilePic = profilePic || user.profilePic

        user = await user.save()

        res.status(200).json({
            name: user.name,
            username: user.username,
            email: user.email,
            id: user._id,
            bio : user.bio,
            profilePic : profilePic || user.profilePic,
            password : user.password
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log("Error in Upadateuser", err.message)
    }

}

const getProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select("-password")
        if (!user) {
            return res.status(400).json({ message: "User is not found" })
        }

        res.status(200).json(user)

    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log("Error in gerProfile", err.message)
    }

}

module.exports = { signupUser, loginUser, logoutUser, followUnfollowUser, upadateUserprofile, getProfile }