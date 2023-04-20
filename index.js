const express =  require ("express");
const app = express();
const ejs = require("ejs");
const bodyParser =require('body-parser')
const mongoose = require("mongoose");

const URI = 'mongodb+srv://olanikebasirat620:olAnik_12@cluster0.nb5r67c.mongodb.net/portal_db?retryWrites=true&w=majority'


mongoose.connect(URI)
.then(() =>{
    console.log("Mongoose neural handshake complete");
})
.catch((err)=>{
    console.log(err);
})

let userSchema = {
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String,required:true} 
}
let userModel = mongoose.model("users_collection", userSchema)

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");


app.get("/", (req, res) => {
    console.log("Request made");
    //res.send([
        // {name:"olanike", club:"Arsenal"}
    // ])
    // res.send("hello nikky")
    res.render("home")
})

// app.get("/about", (req, res) => {
    //res.send("Hello")
    // res.send([
        // {firstname: "nikky", lastname: "nike"}
    // ]);
    // console.log(__dirname);
    // res.sendFile(__dirname +"/index.html");
// })

app.get("/index", (req,res)=>{
    //res.send("HI INDEX");
    res.render("index")

})

app.get("/nike", (req,res)=>{
    //res.send("Hi Index");
    res.render("nike", {name:"OLANIKE", school:"SQI",})
})

app.get("/signup",(req,res)=>{
    res.render("signup",{message:""})
})

app.get("/signin",(reg,res)=>{
    res.render("signin",{message:""})
})

app.get("/dashboard",(reg,res)=>{
    userModel.find()
    .then((response)=>{
        console.log(response);
        res.render("dashboard", {userDetails: response})
    })
    .catch((err)=>{
        console.log(err);
    });
})    

app.get("/condition",(req,res)=>{
    res.render("conditional",{name:"olanike",food:"indomie"})
})

app.post("/signup",(req,res)=>{
    console.log(req.body)
    let form = new userModel(req.body)
    form.save() 
    .then((response)=>{
        console.log("successfully saved form")
        console.log(response);
        // res.render("signup",{mesaage:"sign up successfully"})
        res.redirect("/signin")
    })
    .catch((err)=>{
        console.log(err);
        if(err.code === 11000) {
            console.log(err.code);
            res.render("signup",{message:"Email already exist"})
        }else {
            res.render("signup",{message:"Please fill in your Details"});
        }
    })

})

app.post('/signin',(req,res)=>{
    userModel.find({email:req.body.email, password:req.body.password})
    .then((response)=>{
        console.log(response);
        if (response.length > 0) {
            res.redirect("dashboard")
        }else {
            res.render("signin",{message:"Incorrect Email or Password"});
        }    
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/delete', (req, res) => {
    userModel.findOneAndDelete({email:req.body.userEmail})
    .then((response) =>{
        console.log(response);
        res.redirect("dashboard")
        console.log("delete successfully");
    })
    .catch((err) => {
        console.log(err);
    });
})

app.post("/edit", (req, res) =>{
    userModel.findOne({email: req.body.userEmail})
    .then((response)=>{
        console.log(response);
        res.render("editUser", {userDetails:response})
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.post("/update", (req, res) =>{
    let id = req.body.id;
    userModel.findByIdAndUpdate(id, req.body)
    .then((response)=>{
        console.log(response);
        res.redirect("dashboard")
    })
    .catch((err)=>{
        console.log(err);

    });
})


 
 app.listen(5600, ()=>{
    console.log("server is running")
});