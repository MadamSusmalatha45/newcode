const httpStatus = require('http-status');
const { omit } = require('lodash');
const Shift = require('../models/shift.model');
const Experience = require('../models/user.experience.model');
const moment = require('moment-timezone');


exports.cities = async (req, res, next) => {
    try {
        let shiftDate = new Date();
        userId=req.user._id
        const shifts = await Shift.list({shiftDate,userId});
        const total = await Shift.list(req.query);
        const exp =await Experience.find({user:req.user._id})
        const transformedShifts = shifts.map((status) => status.transform());
        res.json({ code: 200, message: 'Home Api data retrieved successfully.', data: { 'currentShift': transformedShifts[0]||null, isprofile: exp.length>0, 'totalShifts': shifts.length },'notifications':0 });
    } catch (error) {
        res.json({ code: 500, message: 'Internal server error', errors: {} })

    }
};
getDates = async(startDate, stopDate)=> {
    var dateArray = []
    var currentDate = moment(startDate)
    var stopDate = moment(stopDate)
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
      currentDate = moment(currentDate).add(1, 'days')
    }
    return dateArray
}
exports.getdates = async(req,res,next)=>{
    let userShifts = await Shift.find({userId : req.user._id}).populate('casualShiftId roastedId')
    let arr = []
    for(let i=0;i < userShifts.length; i++){
        if(userShifts[i].casualShiftId){
            let shift = userShifts[i].casualShiftId
            var today = new Date();
            var startDate = new Date(shift.startDate);
            var endDate = new Date(shift.endDate);
            if(today.getTime() >= startDate && today.getTime() <= endDate){
                let dateArr = await getDates(shift.startDate,shift.endDate);
                for(var d = 0; d < dateArr.length; d++){
                    let newDate = new Date(dateArr[d]);
                    if(shift.recurrenceDay.includes(newDate.getDay())){
                        arr.push(dateArr[d])
                    }
                }
            }
        }
        if(userShifts[i].rosterId){
            let shift = userShifts[i].rosterId
            var today = new Date();
            var startDate = new Date(shift.startDate);
            var endDate = new Date(shift.endDate);
            if(today.getTime() >= startDate && today.getTime() <= endDate){
                let dateArr = await getDates(shift.startDate,shift.endDate);
                for(var d = 0; d < dateArr.length; d++){
                    let newDate = new Date(dateArr[d]);
                    if(shift.recurrenceDay.includes(newDate.getDay())){
                        arr.push(dateArr[d])
                    }
                }
            }
        }
        // else{
        //     let shift = userShifts[i]
        //     let today = new Date();
        //     let startDate = new Date(shift.startDate);
        //     let endDate = new Date(shift.endDate);
        //     if(today.getTime() >= startDate && today.getTime() <= endDate){
        //         if(shift[i].recurrenceDay.include(today.getDay())){
        //             var currentDate = moment(startDate)
        //             var stopDate = moment(stopDate)
        //             while (currentDate <= stopDate) {
        //             dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
        //             currentDate = moment(currentDate).add(1, 'days')
        //             }
        //         }
        //     }
        //     let dateArr = await getDates(shift.startDate,shift.endDate);
        //     arr = arr.concat(dateArr)
        // }

        arr = [...new Set(arr)];
        
    }
    res.json({ code:200, message:"Dates found successfully", data:{availableDates:arr}})
}
exports.panic = async(req,res,next)=>{
    try {
        res.json({ code: 200, message: 'Panic Notification Sent.'});
    } catch (error) {
        next(error)
    }
}

