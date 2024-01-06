const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const jwt = require('jsonwebtoken');
const {Admin,Course, User, User} = require("../db/index")
const jwtPassword = process.env.JWT_SECRET

// Admin Routes
router.post('/signup', (req, res) => {
    // Implement admin signup logic
    try{
        const username = req.body.username;
        const password = req.body.password;
        const admin = new Admin(
            {
                username: username,
                password: password
            }
        )
        admin.save().then(()=>res.json({message:"Admin Created!!!"}));
    }
    catch(err){
        res.json({
            message:"Something wrong!!!"
        })
    }
    
});

router.post('/signin', async (req, res) => {  
    // Implement admin signup logic
    try{
        const userName = req.body.username;
        const password =  req.headers.password;
        const User = await User.find({
            userName,
            password
        })
        if(User){
            const token = jwt.sign(userName,jwtPassword);
            if(token){
                res.status(200).json({
                    Token:token
                })
            }
        }
        else{
            res.status(404).json({"msg":"Wrong Credentials"})
        }
        
    }
    catch(err){
        res.status(404).json({err})
    }
});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const desc = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink

    const course = new Course(
        {
            title:title,
            description:desc,
            price:price,
            imageLink:imageLink
        }
    )
    course.save().then(()=>{
        res.send("Course created successfully");
    })
});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    const courseData = await Course.find();
    res.send(courseData);
});

module.exports = router;