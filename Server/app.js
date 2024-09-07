require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');
const Admin = require("./Models/Admin.js");
const Rider = require('./Models/Rider.js');
const Tip = require("./Models/Tip.js");
const Vendor = require('./Models/Vendor.js');
const Restaurant = require("./Models/Restaurant.js");
const Rating = require("./Models/Rating.js");
const Coupon = require("./Models/Coupon.js");
const cors = require('cors');
const User = require('./Models/User.js');
const Order = require('./Models/Order.js');
const { sign, verify } = require("jsonwebtoken");
const { hash } = require('bcrypt');
const bcrypt = require("bcrypt")
const fetch = require('node-fetch');
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet");
const mongooseURL = process.env.DB;
const { userValidateToken, riderValidateToken, adminValidateToken } = require('./Middlewares/index.js');
const { router: adminRoutes } = require('./Routes/admin.js');
const { router: riderRoutes } = require("./Routes/rider.js")
const { router: userRoutes } = require("./Routes/user.js")


mongoose.connect(mongooseURL)
    .then(() => {
        console.log("Successfully connected to mongoose data");
    })
    .catch((e) => {
        console.log(e.message);
    })

// use ones..................................................................
app.use(cors());
app.use(express.json());
app.use(helmet());


// .................................................Routes .........................................

app.get("/", async (req, res) => {
    res.send("hello");
})



// ........................................Routes for admins......................................

app.use("/admin", adminRoutes)

app.get("/admin", adminValidateToken, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);
        res.json(admin)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.get("/admin/allRestaurants", adminValidateToken, async (req, res) => {
    try {
        const allRestaurants = await Restaurant.find().populate({
            path: "vendor"
        });
        res.json(allRestaurants);
    } catch (e) {
        res.json({ error: e.message });
    }
})
app.post('/admin/getRestaurant', adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const restaurant = await Restaurant.findById(data._id).populate({
            path: "orders",
            populate: [
                { path: "user" },
                { path: "restaurant" },
                { path: "rider" },
                { path: "riderRating" },
                { path: "restaurantRating" }
            ]
        }).populate({
            path: "ratings",
            populate: [
                { path: "user" }
            ]
        });
        res.json(restaurant);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/admin/restaurant/:id/updateDetails", adminValidateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if(data.username=="" || data.password=="" || !data.password || !data.username)
        {
            return res.json({error: "Username or password is incorrect..!!"})
        }
        const admin=await Admin.findById(req.admin._id);
        if(data.password!=admin.memberPin.toString() || data.username!=admin.memberId)
        {
            return res.json({error: "Username or password is incorrect..!!"});
        }
        const d=data.r;
        let restaurant = await Restaurant.findByIdAndUpdate(id, d);
        await restaurant.save();
        res.json(restaurant)
    }
    catch (e) {
        res.json({ error: e.message })
    }
    
})
app.post("/admin/restaurant/:id/addCategory", adminValidateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let restaurant = await Restaurant.findById(id);
        if (restaurant.categories.length == 0) {
            restaurant.categories = data;
        }
        else {
            restaurant.categories.push(data);
        }
        await restaurant.save();
        res.json(restaurant)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/admin/restaurant/:id/addFood", adminValidateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const restaurant = await Restaurant.findById(id);
        if (restaurant.foods.length == 0) {
            restaurant.foods = data;
        }
        else {
            restaurant.foods.push(data);
        }
        await restaurant.save();
        res.json(restaurant)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/admin/restaurant/updateComissionRate", adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const restaurant = await Restaurant.findById(data.id);
        restaurant.comissionRate = data.rate;
        await restaurant.save();
        const allRestaurants = await Restaurant.find()
        res.json(allRestaurants)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post('/admin/vendor/post', adminValidateToken, async (req, res) => {
    try {
        const data = req.body;
        const newVendor = new Vendor(data);
        await newVendor.save();
        const allVendors = await Vendor.find();
        res.json(allVendors);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.get('/admin/vendor', adminValidateToken, async (req, res) => {
    try {
        const allVendors = await Vendor.find();
        res.json(allVendors);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.get('/vendor/:id/getRestaurant', adminValidateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findById(id).populate({
            path: 'restaurants'
        });
        const allRestaurants = vendor.restaurants;
        res.json(allRestaurants);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})



//...................................... Riders ......................................

app.use("/rider", riderRoutes)


// ...............................Routes for users.............................................

app.use("/user", userRoutes)

app.get("/home/allRestaurants", async (req, res) => {
    try {
        const allRestaurants = await Restaurant.find().populate({
            path: "ratings"
        })
        res.json(allRestaurants);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.get("/home/restaurant/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id).populate([
            { path: "ratings" },
            { path: "coupons" }
        ])
        res.json(restaurant)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/confirmCoupon", async (req, res) => {
    try {
        const data = req.body;
        const restaurant = await Restaurant.findById(data.restaurantId).populate({
            path: "coupons"
        })
        if (restaurant.coupons.length > 0) {
            const coupon = restaurant.coupons.find(coupon => coupon.title == data.coupon && coupon.availability == "available")
            if (coupon) {
                return res.json(coupon.discount);
            }
            else {
                return res.json({ error: "Invalid Coupon Code entered.." })
            }
        }
        else {
            return res.json({ error: "Invalid Coupon entered.!!" })
        }

    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.get("/tips", async (req, res) => {
    try {
        const tips = await Tip.find();
        res.json(tips[0])
    }
    catch (e) {
        res.json({ error: e.message })
    }
})



//............................Routes for authentication.................................

app.post("/signup", async (req, res) => {
    try {
        const data = req.body;
        const usernameLoggedIn = await User.findOne({ username: req.body.username });
        const emailLoggedIn = await User.findOne({ email: req.body.email });
        if (usernameLoggedIn) {
            return res.json({ error: "Username already registered !!" })
        }
        else if (emailLoggedIn) {
            return res.json({ error: "Email already registered !!" })
        }
        else {
            const newUser = new User({
                username: data.username,
                name: data.name,
                phone: data.phone,
                email: data.email
            })
            newUser.password = await bcrypt.hash(data.password, 10);
            await newUser.save();
            const accessToken = sign({
                username: data.username,
                _id: newUser._id
            }, process.env.SECRET_KEY)
            res.json(accessToken);
        }
    }
    catch (e) {
        res.json({ error: e.message })
    }
})

app.post('/login', async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({ username: data.username });
        if (!user) {
            return res.json({ error: "You must create an account first !!" })
        }
        const result = await bcrypt.compare(data.password, user.password);
        if (result) {
            const accessToken = sign({ username: data.username, _id: user._id }, process.env.SECRET_KEY);
            res.json(accessToken);
        }
        else {
            res.json({ error: "The username or password is incorrect..!!" });
        }
    }
    catch (e) {
        res.json({ error: e.message })
    }
})
app.post("/admin/login", async (req, res) => {
    try {
        const data = req.body;
        const admin = await Admin.findOne({ memberId: data.adminId });
        if (!admin) {
            res.json({ error: "admin-id or admin-pin is incorrect..!!!" })
        }
        else {
            if (admin.memberPin !== parseInt(data.adminPin)) {
                res.json({ error: "admin-id or admin-pin is incorrect..!!!" })
            }
            else {
                const accessToken = sign({
                    username: data.memberId,
                    _id: admin._id
                }, process.env.SECRET_KEY)
                res.json(accessToken)
            }
        }
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/rider/login", async (req, res) => {
    try {
        const data = req.body;
        const rider = await Rider.findOne({ username: data.username });
        if (!rider) {
            res.json({ error: "username or password is incorrect..!!!" })
        }
        else {
            const result = await bcrypt.compare(data.password, rider.password);
            if (!result) {
                res.json({ error: "username or password is incorrect..!!!" })
            }
            else {
                const accessToken = sign({
                    username: data.username,
                    _id: rider._id
                }, process.env.SECRET_KEY)
                res.json(accessToken)
            }
        }
    }
    catch (e) {
        res.json({ error: e.message });
    }
})
app.post("/vendor/login", async (req, res) => {
    try {
        const data = req.body;
    }
    catch (e) {
        res.json({ error: e.message })
    }
})


app.listen(port, async (req, res) => {
    console.log(`Successfully started on the port : ${port}`);
})