/**
 * Created by MacBook Air on 2017/3/12.
 */
var mongoose = require("mongoose");
var DoctorSchema = require("../schemas/doctor");
var Doctor = mongoose.model("doctor",DoctorSchema);
module.exports = Doctor;