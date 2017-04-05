/**
 * Created by MacBook Air on 2017/3/12.
 */
var mongoose = require("mongoose");
var DoctorSchema = new mongoose.Schema({
    username:String,
    password:String,
    name:String,
    img:String,
    age:Number,
    school:String,
    education:String,
    sex:Number,
    tel:String,
    email:String,
    introduce:String,
    case:Array,
    major:String,
    appointment:Array,
    updateTime:{type:Date,default:Date.now()}
});
module.exports = DoctorSchema;