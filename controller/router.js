var file=require("../modles/file.js");
var fs=require("fs");
var path=require("path");
var util=require("util");
var  formidable = require('formidable');
var  sd= require("silly-datetime");
//路由控制
exports.showIndex=function(req,res,next){
    //错误的：传统思维，不是node的思维：
    //res.render("index",{
    //    "albums" : file.getAllAlbums()
    //});

    //这就是Node.js的编程思维，就是所有的东西，都是异步的
    //所以，内层函数，不是return回来东西，而是调用高层函数提供的
    //回调函数。把数据当做回调函数的参数来使用。
    //由于回调是异步所有要异步回调
    // res.render("index",{
    //     albums:file.getAllalbums()
    // });
    file.getAllalbums(function(err,allFileDir){
        if (err){
            next();//交给下面中间件
            return;
        }
        // res.send(allFileDir)
        res.render("index",{
            albums:allFileDir
        });
        console.log("哈哈："+allFileDir)
        var haha=allFileDir;
    })
}
//相册目录路由处理(相册内容)
exports.showAlbum=function(req,res,next){
    var albumName = req.params.albumName;
    file.getAllImgagesName(albumName,function(err,images){
            // if(req.path!="/"){
            //     res.render("404");//路径不存在返回404页面
            // }
                if(err){
                    next();//交给下游中间件
                    return;
                    // res.render("404");
                }
                res.render("items",{
                    "albumName" : albumName,
                    images : images
                })
    })

}
//上传显示
exports.showUp=function (req,res) {
        file.getAllalbums(function(err,allFileDir){
            res.render("admin",{
                albums:allFileDir
            })
        })

}
exports.doPost=function(req,res){

    var form=new formidable.IncomingForm();
    form.uploadDir = "./uploads";//上传的目录
    form.parse(req,function(err,fields,files,next){
        console.log(files)
        if(err){
            next();//不符合继续找中间件受理
            return;
        }
        var size=files.pic.size;
        if(size>314572){
            // next();
            // res.send("请保持图片大小在3M一下");
            res.render("up_err")
            //删除图片
            console.log(files.pic.path);
            fs.unlink(files.pic.path,function(){
                console.log(files.pic.path+"文件尺寸过大,已被删除!!!")
            })
            return;
        }
       var ttt= sd.format(new Date(), 'YYYYMMDDHHmmss');
       var extname=path.extname(files.pic.name);
       var ran=parseInt(Math.random()*89999+10000);
        var albums=fields.albums;
       var oldPath=files.pic.path;
        console.log(oldPath)
       var newPath=form.uploadDir+"/"+fields.sec+"/"+ttt+ran+extname;
       console.log("新名字:"+newPath)
       fs.rename(oldPath,newPath,function(err){
           if(err){
               res.send("改名失败");
           }
           res.render("up_success")
           // res.send("上传成功!<a class='btn btn-success btn-lg' href='/admin'>返回上传页面</a>")
       })
    })
//
}