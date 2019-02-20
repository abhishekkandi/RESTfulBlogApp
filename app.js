const express          = require("express"),
      bodyParser       = require("body-parser"),
      mongoose         = require("mongoose"),
      methodOverride   = require("method-override"),
      expressSanitizer = require("express-sanitizer"),
      app              = express(),
      portNumber       = 3000;

// APP Config
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());//Should be after body parser
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{ useNewUrlParser: true });

app.listen(portNumber, function(){
    console.log(`Blog App server started running at port - ${portNumber}`)
})

//Mongoose/Model Config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
const Blog = mongoose.model("Blog", blogSchema);

//RESTful ROUTES

app.get("/", function(req,res){
    res.redirect("/blogs")
})

//INDEX ROUTE
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log("Error!");
        } else {
            res.render("index", { blogs: blogs })
        }
    });
})

//NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new")
})

//CREATE ROUTE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    let blogData = req.body.blog;
    Blog.create(blogData, function(err, newBlog){
        if(err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })
})

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
    let blogId = req.params.id;
    Blog.findById(blogId, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog});
        }
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    let blogId = req.params.id;
    Blog.findById(blogId, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog })
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    let blogId = req.params.id;
    let blog = req.body.blog;
    Blog.findByIdAndUpdate(blogId, blog, function(err, updatedBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + blogId);
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    let blogId = req.params.id;
    Blog.findByIdAndRemove(blogId, function(err){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})




