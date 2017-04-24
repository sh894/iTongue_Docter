
var mongoose = require("mongoose");
var DoctorSchema = require("../schemas/doctor");
var Doctor = mongoose.model("doctor",DoctorSchema);
module.exports = Doctor;