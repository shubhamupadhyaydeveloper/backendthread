require('dotenv').config()
const express = require('express')
const app = express()
const cookieparser =  require('cookie-parser')
const mongodb = require('./utils/mongoose.connect')
const port = process.env.PORT || 5000
const userRouter = require('./routes/user.route')
const postRouter = require('./routes/post.route')

// connect mongodb
mongodb()

// setmiddleware
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieparser())

//routes
app.use('/api/user', userRouter)
app.use('/api/post' , postRouter)


app.listen(port , () => {
    console.log(`App is live on port ${port}`)
})

app.get('/' , (req ,res) => {
    res.send('Hi and welcome to my website')
})
 