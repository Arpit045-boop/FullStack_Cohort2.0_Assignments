const { Router } = require("express");
const router = Router();
// const userMiddleware = require("../middleware/user");
const {User,Course} = require("../db/index")
// User Routes
async function userMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const userHeader = req.headers.username;
    const passHeader = req.headers.password;
    if(!userHeader || !passHeader){
        res.status(404).send("Something wrong");
    }
    else{
        const UserObj= await User.findOne({username : userHeader,password: passHeader});
        if(!UserObj){
            res.status(404).json({
                message:"Wrong username"
            })
        }
        else{
            next();
        }
    }
}
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    const user = new User(
        {
            username: username,
            password: password
        }
    )
    user.save().then(()=>res.send("User created successfully"));
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    try{
        Course.find().then((courses)=>{
            res.json({
                courses:courses
            })
        })
    }
    catch(err){
        res.json(
            {
                message:err
            }
        )
    }
});

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    // const courseObj = await Course.findOne({_id: courseId});
    // // console.log(courseObj);
    // if(!courseObj){
    //     return res.status(404).json({messgae:"Cannot find the course"});
    // }
    const result = await User.findOneAndUpdate(
        {username:req.headers.username,password:req.headers.password},
        {$push: {purchasedCourses:courseId}}
    );
    if(!result){
        return res.status(500).json({message:"Internal server error"})
    }
    // console.log(result);
    res.status(200).json({
        message:"Course Purchased Successfully"
    })
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const userObj = await User.findOne({
        username:req.headers.username,
        password:req.headers.password,
    })
    if(!userObj){
        return res.status(404).json({
            message: "Invalid username or password"
        })
    }
    const id = userObj.purchasedCourses;
    // console.log(id);
    const course = await Course.find({
        _id:{
            "$in":id
        }
    })
    res.json({
        purchasedCourse: course
    })
});

module.exports = router