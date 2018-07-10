//小相册项目核心文件
var express=require("express");
var router=require("./controller");
var app=express();

app.set("view engine","ejs");
//路由中间件
app.use(express.static("./public"));//静态资源
app.use(express.static("./uploads"));
app.get("/",router.showIndex);
//相册路由控制
app.get("/:albumName",router.showAlbum);
app.get("/admin",router.showUp);
app.post("/admin",router.doPost);//上传提交
//所有路由无法呈递时候404显示
app.use(function(req,res){
    res.render("404");
    // res.send("找不到")
})
app.listen(3000);