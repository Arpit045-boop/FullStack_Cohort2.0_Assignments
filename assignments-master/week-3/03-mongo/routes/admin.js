const { Router } = require("express");
// const adminMiddleware = require("../middleware/admin");
const router = Router();
const {Admin,Course} = require("../db/index");
// Admin Route
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const userHeader = req.headers.username;
    const passHeader = req.headers.password;
    if(!userHeader || !passHeader){
        res.status(404).send("Something wrong");
    }
    else{
        const adminObj= await Admin.findOne({username : userHeader,password: passHeader});
        if(!adminObj){
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
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const admin = new Admin(
        {
            username: username,
            password: password
        }
    )
    admin.save().then(()=>res.send("Admin created successfully"));
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const desc = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink

    const newCourse = await Course.create(
        {
            title:title,
            description:desc,
            price:price,
            imageLink:imageLink
        }
    )
    res.json({
        message:"Course created successfully", courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    const courseData = await Course.find();
    res.send(courseData);
});

module.exports = router;