/**
 * Created by MacBook Air on 2017/3/12.
 */
var express = require("express");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

var path = require("path");
var bodyParser = require("body-parser");
var multiparty = require("multiparty");
var fs = require("fs");
var Doctor = require("./models/doctor");

var app = new express();
var port = 3000;

// 连接数据库
 mongoose.connect("mongodb://localhost:27017/iTongue-Doctor");
// app.connect = function connect(opts) {
//     mongoose.Promise = global.Promise;
//     mongoose.connect("mongodb://localhost:27017/iTongue-Doctor");
//     return mongoose.connection;
// };

var db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",function(callback){
    console.log("db service connected");
});
var session = require("express-session");

// 配置参数
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname,"static")));
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());

app.listen(port);

// 医生登录
app.get("/",function(req,res){
    res.render("login");
});

app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});


// 医生注册
app.post("/doctor/register",function(req,res){
    // 查看是否已经注册
    Doctor.find({username:req.body.username},function(err,doctors){
        if(err){
            console.log(err);
        }
        if(doctors.length > 0){
            res.send(returnObj(1,req.body.username + "Username already used"));
        }else{
            // 注册用户
            var doctor = new Doctor({
                username:req.body.username,
                password:req.body.password
            });
            doctor.save(function(err,doc){
                if(err){
                    console.log(err);
                }else{
                    res.send(returnObj(0,"Register success",doc));
                }
            });
        }
    });
});

// 医生登录
app.post("/doctor/login",function(req,res){
    Doctor.find({username:req.body.username},function(err,doctors){
        if(err){
            console.log(err);
        }
        if(doctors.length == 0){
            res.send(returnObj(1,req.body.username+"User doesn't exist"));
        }else{
            Doctor.find({username:req.body.username,password:req.body.password},function(err,doc){
                if(err){
                    console.log(err);
                }
                if(doc.length == 0){
                    res.send(returnObj(1,"Password error"));
                }else{
                    res.send(returnObj(0,"Login success",doc[0]));
                }
            });
        }
    });
});


// 上传文件
app.post("/image/upload",function(req,res){
    var form = new multiparty.Form({uploadDir: './static/files/'});
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
            console.log(err);
        }else{
            var inputFile = files.file[0];
            var uploadedPath = inputFile.path;
            var dstPath = './static/files/' + inputFile.originalFilename;
            fs.rename(uploadedPath, dstPath, function(err) {
                if(err){
                    console.log(err);
                }else{
                    res.send(returnObj(0,"Image upload success",dstPath));
                }
            })
        }
    })
});

// 完善用户信息
app.post("/doctor/perfect",function(req,res){
    userId = req.body.userId;
    var doctor = {
        img:req.body.img,
        age:req.body.age,
        sex:req.body.sex,
        education:req.body.education,
        school:req.body.school,
        name:req.body.name,
        tel:req.body.tel,
        email:req.body.email,
        major:req.body.major,
        introduce:req.body.msg
    };
    console.log(doctor);
    Doctor.update({_id:userId},{$set:doctor},function(err,doctors){
        if(err){
            console.log(err);
        }else{
            if(doctors.nModified > 0){
                res.send(returnObj(0,"Update success"));
            }else{
                res.send(returnObj(1,"Update fail"));
            }
        }
    });
});

// 查看所有的医生
app.get("/doctor/all",function(req,res){
    Doctor.find({},function(err,doctors){
        if(err){
            console.log(err);
        }else{
            res.send(returnObj(0,"Success",doctors));
        }
    });
});

// 查看医生详情
app.get("/doctor/detail",function(req,res){
    var id = req.query.id;
    Doctor.find({_id:id},function(err,doctor){
        if(err){
            console.log(err);
        }else{
            res.send(returnObj(0,"Success",doctor));
        }
    });
});

// 医生添加可预约时间
app.post("/doctor/appointment",function(req,res){
    var userId = req.body.userId;
    var event = req.body.event;
    var isAddData = true;
    Doctor.find({_id:userId},function(err,doctor){
        if(err){
            console.log(err);
        }else{
            var events = doctor[0].appointment;
            for(var i = events.length - 1; i >= 0; i--){
                if(events[i].start == event.start){
                    events.splice(i,1);
                    isAddData = false;
                }
            }
            if(isAddData){
                events.push(event);
            }
            Doctor.update({_id:userId},{$set:{appointment:events}},function(err,doctors){
                if(err){
                    console.log(err);
                }else{
                    res.send(returnObj(0,"Update success",doctors));
                }
            });
        }
    });
});

// 获取医生的预约时间
app.get("/doctor/appointment/detail",function(req,res){
    var userId = req.query.userId;
    Doctor.find({_id:userId},function(err,doctors){
        if(err){
            console.log(err);
        }else{
            res.send(doctors[0].appointment);
        }
    });
});
// 删除医生可预约时间
app.post("/doctor/appointment/reset",function(req,res){
    var userId = req.body.userId;
    var date = req.body.date;
    Doctor.find({_id:userId},function(err,doctor){
        if(err){
            console.log(err);
        }else{
            var events = doctor[0].appointment;
            console.log(events.length);
            for(var i = events.length - 1; i >= 0; i--){
                if(new Date(events[i].start).getTime() == new Date(date).getTime()){
                    events.splice(i,1);
                    console.log(events.length);
                }
            }
            Doctor.update({_id:userId},{$set:{appointment:events}},function(err,doctors){
                if(err){
                    console.log(err);
                }else{
                    res.send(returnObj(0,"Delete success"));
                }
            });
        }
    });
});

// 返回对象
function returnObj(status,msg,data){
    var backData = {};
    backData.status = status || 0;
    backData.msg = msg || "";
    if(data){
        backData.body = data;
    }
    return backData;
}