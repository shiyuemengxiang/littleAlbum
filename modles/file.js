var fs=require("fs");
//文件处理
exports.getAllalbums=function(callback){
    //调度是在app.js和uploads在同一目录用./
    fs.readdir("./uploads",function(err,files){
        if (err){
            callback("没有找到uploads文件夹",null)
        }
        var allFileDir=[];//存放相册数组
        (function iterator(i){
            //遍历结束：i和文件的长度一样时候
            if(i==files.length){
                // console.log(allFileDir);
                //继续执行回调,然后在router.js调度这个allFileDir
                callback(null,allFileDir);
                return;
            }
            fs.stat("./uploads/"+files[i],function(err,stats){
                if(stats.isDirectory()){
                    allFileDir.push(files[i])
                }
                iterator(i+1)
            })
        })(0)
    });
}
//通过文件名遍历所有图片
exports.getAllImgagesName=function(albumName,callback){
    fs.readdir("./uploads/"+albumName,function(err,files){
        if(err){
            // callback();开启回调导致模板一引擎无法调取报错
            callback("没有找到",null)
            return;
        }
    //    遍历相册
        var images=[];
        //   迭代器
        (function iterator(i){
            //遍历结束
            if(i==files.length){
                console.log(images);
                callback(null,images)
                return;
            }
            fs.stat("./uploads/"+albumName+"/"+files[i],function(err,stats){
                if(err){
                    callback("找不到文件" + files[i] , null);
                    return;
                }
               if(stats.isFile()){
                   images.push(files[i]);
               }
               iterator(i+1)
            })
        })(0)

    })
}
