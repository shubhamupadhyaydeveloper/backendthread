const User = require('../models/user.model')
const generateToken = require('../utils/generate.token')
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
                username: newUser.username
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
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password , user?.password || "")

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({message : "Innvalid Username or Password"})
        }

        generateToken(user._id , res)

        res.status(201).json({
            name : user.name,
            username :  user.username,
            email : user.email,
            id : user._id
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log('Error in login', err.message)
    }
}

const logoutUser = async (req ,res)  => {
    try {
        res.cookie("jwt", "" , {maxAge : 1})
        res.status(201).json({message : 'You logout successfully'})
    } catch (err) {
        res.status(500).json({message : err.message})
        console.log("Error in logout" , err.message)
    }
}

module.exports = { signupUser, loginUser , logoutUser}