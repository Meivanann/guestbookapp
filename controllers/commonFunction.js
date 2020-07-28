var moment = require('moment');
var sql = require('../config');
var q = require('q');
module.exports = {
    getTimeZoneDate: (dateparam, timezone, format) => {
        var timezone = (timezone != undefined && timezone != '') ? timezone : '+00:00';
        var date = new Date();
        if (dateparam != undefined && dateparam != '') {
            date = new Date(dateparam);
        }
        var dateformat = (format) ? format : 'YYYY-MM-DD';
        return moment(date).utcOffset(timezone).format(dateformat);
    },

    getTimeZoneDateWithoutFormat: (dateparam, timezone) => {
        var timezone = (timezone != undefined && timezone != '') ? timezone : '+00:00';
        var date = new Date();
        if (dateparam != undefined && dateparam != '') {
            date = new Date(dateparam);
        }
        return moment(date).utcOffset(timezone);
    },

    // executeQuery: async query => {
    //     var deferred = q.defer();
    //     var result = false;
    //     sql.query(query, function (err, results) {
    //         if (err) {
    //             console.log(err);
    //             deferred.resolve(result);
    //         } else {
    //             deferred.resolve(true);
    //         }
    //     });
    //     return deferred.promise;
    // },

    // executeQueryAndRetunResults: async query => {
    //     var deferred = q.defer();
    //     var result = [];
    //     sql.query(query, function (err, results) {
    //         if (err) {
    //             console.log(err);
    //             deferred.resolve(result);
    //         } else {
    //             deferred.resolve(results);
    //         }
    //     });
    //     return deferred.promise;
    // },

    getQueryResults: async query => {
        var deferred = q.defer();
        var result = [];
        sql.query(query, function (err, results) {
            if (err) {
                console.log(err);
                deferred.resolve(result);
            } else {
                deferred.resolve(results);
            }
        });
        return deferred.promise;
    },

    // getDateBetweenTwoDates: async (start_date, end_date,previous_year_filter,year_to_date_filter,previous_period_filter) => {
    //     var deferred = q.defer();
    //     var list = [];
    //     if (start_date && end_date) {
    //         date = new Date(start_date);
    //         while (date < new Date(end_date)) {
    //            // list.push(moment(date).format('MMM DD, YYYY'));
    //            list.push({ start: new Date(date), end: new Date(new Date(date).setHours(23, 59, 59)), date_string:moment(date).format('DD MMM-YYYY') });
               
    //             if(previous_year_filter == 1) {
    //                 let previous_year_date =  new Date(date); 
    //                 previous_year_date.setFullYear(previous_year_date.getFullYear() - 1);
    //                // list.push(moment(previous_year_date).format('MMM DD, YYYY'));
    //                 list.push({ start: new Date(previous_year_date), end: new Date(new Date(previous_year_date).setHours(23, 59, 59)), date_string:moment(previous_year_date).format('MMM DD, YYYY') });
    //             }

    //             if(year_to_date_filter == 1){
    //                 var pre_start_date = moment(date).startOf('year');
    //                 let pre_lastdate = new Date(new Date(date).setHours(23, 59, 59));
    
    //                 let dateString1 = moment(pre_start_date).format('MMM DD-') + moment(pre_lastdate).format('MMM DD,YYYY');
    //                 list.push({ start: pre_start_date, end: pre_lastdate,date_string:dateString1 });
    //             }

    //             if(previous_period_filter == 1) {
    //                 let previous_date =  new Date(date); 
    //                 previous_date.setDate(previous_date.getDate() - 1);
    //                 list.push({ start: new Date(previous_date), end: new Date(new Date(previous_date).setHours(23, 59, 59)), date_string:moment(previous_date).format('MMM DD, YYYY') });
    //             }
    //             date = new Date(date.setDate(date.getDate() + 1));
    //         }
    //         deferred.resolve(list);
    //     } else {
    //         deferred.resolve(list);
    //     }
    //     return deferred.promise;
    // },

    // getStartAndEndOfWeek: async (start_date, end_date,previous_year_filter,year_to_date_filter,previous_period_filter) => {
    //     var deferred = q.defer();
    //     var weekArray = [];
    //     var finalResult = [];

    //     if (start_date && end_date) {
    //         let end;
    //         var date1 = new Date(start_date);
    //         let start = new Date(date1);
    //         var lastdate = moment(date1).endOf('month').toDate();
    //         lastdate = moment(lastdate).format('YYYY-MM-DD');

    //         while (date1 <= new Date(end_date)) {
    //             let d = new Date(date1);
    //             d = new Date(d.setDate(d.getDate() + 1));
    //             let day = new Date(date1).getDay();

    //             if (day == 0) {
    //                 start = new Date(date1);
    //                 if (date1.getTime() == new Date(end_date).getTime()) {
    //                     end = d;
    //                     let dateString = moment(start).format('MMM DD-') + moment(end).format('DD, YYYY');
    //                     weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)), date_string:dateString });
    //                  if(previous_year_filter == 1){
    //                     let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','DD, YYYY');
    //                     weekArray.push(pre_year_date);
    //                 }

    //                 if(year_to_date_filter == 1){
    //                     let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                     weekArray.push(pre_year_date);
    //                 }

    //                 if(previous_period_filter == 1){
    //                     let sdate = new Date(start);
    //                     sdate = sdate.setDate(sdate.getDate()-7);

    //                     let eDate = new Date(end);
    //                     eDate = eDate.setDate(eDate.getDate()-7);
    //                     let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('DD, YYYY');
    //                     let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                     weekArray.push(previous_period_date);
    //                 }
    //             }
    //             } else if (day == 6) {
    //                 end = new Date(date1);
    //                 let dateString = moment(start).format('MMM DD-') + moment(end).format('DD, YYYY');
    //                 weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)), date_string:dateString });
    //                 if(previous_year_filter == 1){
    //                     let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','DD, YYYY');
    //                     weekArray.push(pre_year_date);
    //                 }

    //                 if(year_to_date_filter == 1){
    //                     let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                     weekArray.push(pre_year_date);
    //                 }

    //                 if(previous_period_filter == 1){
    //                     let sdate = new Date(start);
    //                     sdate = sdate.setDate(sdate.getDate()-7);

    //                     let eDate = new Date(end);
    //                     eDate = eDate.setDate(eDate.getDate()-7);
    //                     let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('DD, YYYY');
    //                     let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                     weekArray.push(previous_period_date);
    //                 }

    //             } else if (d.getTime() == new Date(lastdate).getTime()) {
    //                 end = d;
    //                 let dateString = moment(start).format('MMM DD-') + moment(end).format('DD, YYYY');
    //                 weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)), date_string:dateString });
    //                 if(previous_year_filter == 1){
    //                     let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','DD, YYYY');
    //                     weekArray.push(pre_year_date);
    //                 }

    //                 if(year_to_date_filter == 1){
    //                     let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                     weekArray.push(pre_year_date);
    //                 }

    //                 if(previous_period_filter == 1){
    //                     let sdate = new Date(start);
    //                     sdate = sdate.setDate(sdate.getDate()-7);

    //                     let eDate = new Date(end);
    //                     eDate = eDate.setDate(eDate.getDate()-7);
    //                     let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('DD, YYYY');
    //                     let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                     weekArray.push(previous_period_date);
    //                 }

    //                 let s = new Date(d);
    //                 s = new Date(s.setDate(s.getDate() + 1));
    //                 start = new Date(s);
    //             } else if (d.getTime() == new Date(end_date).getTime()) {
    //                 end = d;
    //                 let dateString = moment(start).format('MMM DD-') +  moment(end).format('DD, YYYY');
    //                 weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)), date_string:dateString });
    //                 if(previous_year_filter == 1){
    //                     let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','DD, YYYY');
    //                     weekArray.push(pre_year_date);
    //                 }

    //                 if(year_to_date_filter == 1){
    //                     let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                     weekArray.push(pre_year_date);
    //                 }

    //                 if(previous_period_filter == 1){
    //                     let sdate = new Date(start);
    //                     sdate = sdate.setDate(sdate.getDate()-7);

    //                     let eDate = new Date(end);
    //                     eDate = eDate.setDate(eDate.getDate()-7);
    //                     let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('DD, YYYY');
    //                     let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                     weekArray.push(previous_period_date);
    //                 }
    //             }
    //             date1 = new Date(date1.setDate(date1.getDate() + 1));
    //         }
    //         var newArray = [];
    //         if (weekArray.length > 0) {
    //             newArray = weekArray.filter((obj, pos, arr) => {
    //                 return arr.map(mapObj => mapObj['start']).indexOf(obj['start']) === pos;
    //             });
    //         }

    //         deferred.resolve(newArray);
    //     } else {
    //         deferred.resolve(weekArray);
    //     }
    //     return deferred.promise;
    // },

    // getHalfMonthDates: async (start_date, end_date,previous_year_filter,year_to_date_filter,previous_period_filter) => {
    //     var deferred = q.defer();
    //     var halfMonth = [];

    //     if (start_date && end_date) {

    //         var reportStart = new Date(start_date);
    //         //  lastdate = moment(lastdate).format('YYYY-MM-DD');
    //         let start1 = reportStart;
    //         let end1;

    //         while (reportStart <= new Date(end_date)) {
    //             start1 = new Date(reportStart);
    //             let lastdate = moment(reportStart).endOf('month').toDate();
    //             let firstLastDate = new Date(lastdate);

    //             firstLastDate.setDate(15);

    //             if (firstLastDate > start1) {
    //                 if (new Date(end_date) < firstLastDate) {
    //                     end1 = new Date(end_date);
    //                 } else {
    //                     end1 = firstLastDate;
    //                 }
    //                 let dateString = moment(start1).format('MMM DD-') + moment(end1).format('DD, YYYY');
    //                 halfMonth.push({ start: start1, end: new Date(new Date(end1).setHours(23, 59, 59)),date_string:dateString });

    //                 if(previous_year_filter == 1){
    //                     let pre_year_date= await getOneYearAgoDate(start1,new Date(new Date(end1).setHours(23, 59, 59)),'MMM DD-','DD, YYYY');
    //                     halfMonth.push(pre_year_date);
    //                 }

    //                 if(year_to_date_filter == 1){
    //                     let pre_year_date= await yearStartDateToCustomDate(start1,new Date(new Date(end1).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                     halfMonth.push(pre_year_date);
    //                 }

    //                 if(previous_period_filter == 1){
    //                     let sdate = new Date(start1);
    //                     sdate.setMonth(sdate.getMonth()-1);
    //                     sdate.setDate(16);

    //                     let pre_month_lastdate = moment(sdate).endOf('month').toDate();
    //                     let eDate = new Date(pre_month_lastdate);
    //                     let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('DD, YYYY');
    //                     let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                     halfMonth.push(previous_period_date);
    //                 }

    //             } else {
    //                 end1 = firstLastDate;
    //             }
    //             let secondStartDate = new Date(start1);
    //             secondStartDate.setDate(16);
    //             if (secondStartDate < start1) {
    //                 secondStartDate = new Date(start1);
    //             }

    //             let secondEndDate;

    //             if (new Date(end_date) > end1) {
    //                 if (new Date(end_date) < lastdate) {
    //                     secondEndDate = new Date(end_date);
    //                 } else {
    //                     secondEndDate = lastdate;
    //                 }
    //                 let dateString = moment(secondStartDate).format('MMM DD-') + moment(secondEndDate).format('DD, YYYY');
    //                 halfMonth.push({ start: secondStartDate, end: new Date(new Date(secondEndDate).setHours(23, 59, 59)),date_string:dateString });

    //                 if(previous_year_filter == 1){
    //                     let pre_year_date= await getOneYearAgoDate(secondStartDate,new Date(new Date(secondEndDate).setHours(23, 59, 59)),'MMM DD-','DD, YYYY');
    //                     halfMonth.push(pre_year_date);
    //                 }

                    
    //                 if(year_to_date_filter == 1){
    //                     let pre_year_date= await yearStartDateToCustomDate(secondStartDate,new Date(new Date(secondEndDate).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                     halfMonth.push(pre_year_date);
    //                 }
    //                 if(previous_period_filter == 1){

    //                     let sdate = new Date(secondStartDate);
    //                     sdate.setDate(1);

    //                     let eDate = new Date(secondEndDate);
    //                     eDate.setDate(15);
    //                     let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('DD, YYYY');
    //                     let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                     halfMonth.push(previous_period_date);
    //                 }
    //             }
    //             reportStart.setMonth(reportStart.getMonth() + 1);
    //             reportStart.setDate(1);
    //         }
    //         deferred.resolve(halfMonth);
    //     } else {
    //         deferred.resolve(halfMonth);
    //     }
    //     return deferred.promise;
    // },

    // getMonthStartAndEndDate: async (start_date, end_date,previous_year_filter,year_to_date_filter,previous_period_filter) => {
    //     var deferred = q.defer();
    //     var monthStartdateAndEnddate = [];

    //     if (start_date && end_date) {
    //         var report_start_date = new Date(start_date);

    //         while (report_start_date <= new Date(end_date)) {
    //             let lastdate = moment(report_start_date).endOf('month').toDate();
    //             if (new Date(end_date) < lastdate) {
    //                 lastdate = new Date(new Date(end_date).setHours(23, 59, 59));
    //             }
    //             let dateString = moment(report_start_date).format('MMM YYYY');
    //             monthStartdateAndEnddate.push({ start: new Date(report_start_date), end: lastdate,date_string:dateString });

                
    //             if(previous_year_filter == 1){
    //                 let pre_year_date= await getOneYearAgoDate(new Date(report_start_date),lastdate,'MMM YYYY','');
    //                 monthStartdateAndEnddate.push(pre_year_date);
    //             }

    //             if(year_to_date_filter == 1){
    //                 let pre_year_date= await yearStartDateToCustomDate(new Date(report_start_date),lastdate,'MMM DD-','MMM DD,YYYY');
    //                 monthStartdateAndEnddate.push(pre_year_date);
    //             }

                
    //                 if(previous_period_filter == 1){
    //                     let sdate = new Date(report_start_date);
    //                     sdate = sdate.setMonth(sdate.getMonth()-1);

    //                     let eDate = new Date(lastdate);
    //                     eDate = eDate.setMonth(eDate.getMonth()-1);
    //                     let dateString = moment(sdate).format('MMM YYYY');
    //                     let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                     monthStartdateAndEnddate.push(previous_period_date);
    //                 }

    //             report_start_date.setMonth(report_start_date.getMonth() + 1);
    //             report_start_date.setDate(1);
    //         }
    //         deferred.resolve(monthStartdateAndEnddate);
    //     } else {
    //         deferred.resolve(monthStartdateAndEnddate);
    //     }
    //     return deferred.promise;
    // },

    // getQuarterStartAndEndDate: async (start_date, end_date,previous_year_filter,year_to_date_filter,previous_period_filter) => {
    //     var deferred = q.defer();
    //     var quarterStartdateAndEnddate = [];

    //     if (start_date && end_date) {
    //         var report_start_date = new Date(start_date);
    //         while (report_start_date <= new Date(end_date)) {
    //             let lastdate = moment(report_start_date).endOf('quarter').toDate();
    //             if (new Date(end_date) < lastdate) {
    //                 lastdate = new Date(new Date(end_date).setHours(23, 59, 59));
    //             }
    //             let dateString = moment(report_start_date).format('MMM DD-') + moment(lastdate).format('MMM DD,YYYY');
    //             quarterStartdateAndEnddate.push({ start: new Date(report_start_date), end: lastdate,date_string:dateString });

    //             if(previous_year_filter == 1){
    //                 let pre_year_date= await getOneYearAgoDate(new Date(report_start_date),lastdate,'MMM DD-','MMM DD,YYYY');
    //                 quarterStartdateAndEnddate.push(pre_year_date);
    //             }

    //             if(year_to_date_filter == 1){
    //                 let pre_year_date= await yearStartDateToCustomDate(new Date(report_start_date),lastdate,'MMM DD-','MMM DD,YYYY');
    //                 quarterStartdateAndEnddate.push(pre_year_date);
    //             }

    //             if(previous_period_filter == 1) {
    //                 let sdate = new Date(report_start_date);
    //                 sdate = sdate.setMonth(sdate.getMonth()-3);

    //                 let eDate = new Date(lastdate);
    //                 eDate = eDate.setMonth(eDate.getMonth()-3);
    //                 let dateString = moment(sdate).format('MMM DD-')+ moment(eDate).format('MMM DD,YYYY');
    //                 let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                 quarterStartdateAndEnddate.push(previous_period_date);
    //             }

    //             var qStartdate = new Date(lastdate);
    //             report_start_date.setMonth(qStartdate.getMonth() + 1);
    //             report_start_date.setDate(1);
    //         }
    //         deferred.resolve(quarterStartdateAndEnddate);
    //     } else {
    //         deferred.resolve(quarterStartdateAndEnddate);
    //     }
    //     return deferred.promise;
    // },

    // getYearStartAndEndDate: async (start_date, end_date,previous_year_filter,year_to_date_filter,previous_period_filter) => {
    //     var deferred = q.defer();
    //     var yearStartdateAndEnddate = [];

    //     if (start_date && end_date) {
    //         var report_start_date = new Date(start_date);

    //         while (report_start_date <= new Date(end_date)) {
    //             let lastdate = moment(report_start_date).endOf('year').toDate();
    //             if (new Date(end_date) < lastdate) {
    //                 lastdate = new Date(new Date(end_date).setHours(23, 59, 59));
    //             }
    //             let dateString = moment(report_start_date).format('MMM DD-') + moment(lastdate).format('MMM DD, YYYY');
    //             yearStartdateAndEnddate.push({ start: new Date(report_start_date), end: lastdate,date_string:dateString });

    //             if(previous_year_filter == 1){
    //                 let pre_year_date= await getOneYearAgoDate(new Date(report_start_date),lastdate,'MMM DD-','MMM DD, YYYY');
    //                 yearStartdateAndEnddate.push(pre_year_date);
    //             }

    //             if(year_to_date_filter == 1){
    //                 let pre_year_date= await yearStartDateToCustomDate(new Date(report_start_date),lastdate,'MMM DD-','MMM DD, YYYY');
    //                 yearStartdateAndEnddate.push(pre_year_date);
    //             }

    //             if(previous_period_filter == 1){
    //                 let sdate = new Date(report_start_date);
    //                 sdate = sdate.setFullYear(sdate.getFullYear()-1);

    //                 let eDate = new Date(lastdate);
    //                 eDate = eDate.setFullYear(eDate.getFullYear()-1);
    //                 let dateString = moment(sdate).format('MMM DD-') +  moment(eDate).format('MMM DD, YYYY');
    //                 let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                 yearStartdateAndEnddate.push(previous_period_date);
    //             }

    //             report_start_date.setFullYear(report_start_date.getFullYear() + 1);
    //             report_start_date.setMonth(0);
    //             report_start_date.setDate(1);
    //         }
    //         deferred.resolve(yearStartdateAndEnddate);
    //     } else {
    //         deferred.resolve(yearStartdateAndEnddate);
    //     }
    //     return deferred.promise;
    // },

    // getOneYearAgoDates: async (start_date, end_date) => {
    //     var deferred = q.defer();
    //     var yearStartdateAndEnddate = [];

    //     if (start_date && end_date) {
    //         var report_start_date = new Date(start_date);
               
    //            let lastdate = new Date(new Date(end_date).setHours(23, 59, 59));
    //             let dateString = moment(report_start_date).format('MMM DD-YYYY - ') + moment(lastdate).format('MMM DD, YYYY');
    //             yearStartdateAndEnddate.push({ start: new Date(report_start_date), end: lastdate,date_string:dateString });

    //             var pre_start_date = new Date(start_date);
    //             pre_start_date.setFullYear(pre_start_date.getFullYear() - 1);
    //             let pre_lastdate = new Date(new Date(end_date).setHours(23, 59, 59));
    //             pre_lastdate.setFullYear(pre_lastdate.getFullYear() - 1);
    //             let dateString1 = moment(pre_start_date).format('MMM DD-YYYY - ') + moment(pre_lastdate).format('MMM DD, YYYY');
    //             yearStartdateAndEnddate.push({ start: pre_start_date, end: pre_lastdate,date_string:dateString1 });

    //         deferred.resolve(yearStartdateAndEnddate);
    //     } else {
    //         deferred.resolve(yearStartdateAndEnddate);
    //     }
    //     return deferred.promise;
    // },

    // getTwoWeeksDate: async (start_date, end_date,previous_year_filter,year_to_date_filter,previous_period_filter) => {
    //     var deferred = q.defer();
    //     var weekArray = [];

    //     if (start_date && end_date) {
    //         let end;
    //         var filterStartDate = new Date(start_date);
    //         let start = new Date(filterStartDate);
    //         var date1 = new Date(filterStartDate);
    //         var iteration = 1;

    //         while (date1 <= new Date(end_date)) {

    //             let day = new Date(date1).getDay();
              
    //             if (date1 >= new Date(filterStartDate)) {

    //                 let d = new Date(date1);
    //                 d = new Date(d.setDate(d.getDate() + 1));
    //                 if (day == 0) {
    //                     if (iteration % 2 == 1) {
    //                         start = new Date(date1);
    //                     }
    //                     if (date1.getTime() == new Date(end_date).getTime()) {
    //                         end = new Date(date1);
    //                         let dateString = moment(start).format('MMM DD-') + moment(end).format('MMM DD, YYYY');
    //                         weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)),date_string:dateString });

    //                         if(previous_year_filter == 1){
    //                             let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }

    //                         if(year_to_date_filter == 1){
    //                             let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }

                            
    //                 if(previous_period_filter == 1){
    //                     let sdate = new Date(start);
    //                     sdate = sdate.setDate(sdate.getDate()-14);

    //                     let eDate = new Date(end);
    //                     eDate = eDate.setDate(eDate.getDate()-14);
    //                     let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('MMM DD, YYYY');
    //                     let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                     weekArray.push(previous_period_date);
    //                 }

    //                     }

    //                 } else if (day == 6) {
    //                     console.log('iteration.....',iteration % 2);
    //                     if (iteration % 2 == 0) {
    //                         end = new Date(date1);
    //                         let dateString = moment(start).format('MMM DD-') + moment(end).format('MMM DD, YYYY');
    //                         weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)),date_string:dateString });

    //                         if(previous_year_filter == 1){
    //                             let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }

    //                         if(year_to_date_filter == 1){
    //                             let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }

                                    
    //                 if(previous_period_filter == 1){
    //                     let sdate = new Date(start);
    //                     sdate = sdate.setDate(sdate.getDate()-14);

    //                     let eDate = new Date(end);
    //                     eDate = eDate.setDate(eDate.getDate()-14);
    //                     let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('MMM DD, YYYY');
    //                     let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                     weekArray.push(previous_period_date);
    //                 }
    //                     } else if (date1.getTime() == new Date(end_date).getTime()) {
    //                         console.log('here....');
    //                         end = new Date(date1);
    //                         let dateString = moment(start).format('MMM DD-') + moment(end).format('MMM DD, YYYY');
    //                         weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)),date_string:dateString });
    
    //                         if(previous_year_filter == 1){
    //                             let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }
    
    //                         if(year_to_date_filter == 1){
    //                             let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }
    
    //                         if(previous_period_filter == 1){
    //                             let sdate = new Date(start);
    //                             sdate = sdate.setDate(sdate.getDate()-14);
        
    //                             let eDate = new Date(end);
    //                             eDate = eDate.setDate(eDate.getDate()-14);
    //                             let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('MMM DD, YYYY');
    //                             let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                             weekArray.push(previous_period_date);
    //                         }
    //                     }
    //                 } else if (date1.getTime() == new Date(end_date).getTime()) {
    //                     console.log('here....');
    //                     end = new Date(date1);
    //                     let dateString = moment(start).format('MMM DD-') + moment(end).format('MMM DD, YYYY');
    //                     weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)),date_string:dateString });

    //                     if(previous_year_filter == 1){
    //                         let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                         weekArray.push(pre_year_date);
    //                     }

    //                     if(year_to_date_filter == 1){
    //                         let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                         weekArray.push(pre_year_date);
    //                     }

    //                     if(previous_period_filter == 1){
    //                         let sdate = new Date(start);
    //                         sdate = sdate.setDate(sdate.getDate()-14);
    
    //                         let eDate = new Date(end);
    //                         eDate = eDate.setDate(eDate.getDate()-14);
    //                         let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('MMM DD, YYYY');
    //                         let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                         weekArray.push(previous_period_date);
    //                     }
    //                 }
    //             }

    //             iteration = iteration + 1;
    //             date1 = new Date(date1.setDate(date1.getDate() + 1));
    //             console.log('date1.....',date1);
    //         }
          
    //         deferred.resolve(weekArray);
    //     } else {
    //         deferred.resolve(weekArray);
    //     }
    //     return deferred.promise;
    // },

    // getFourWeeksDate: async (start_date, end_date,previous_year_filter,year_to_date_filter,previous_period_filter) => {
    //     var deferred = q.defer();
    //     var weekArray = [];

    //     if (start_date && end_date) {
    //         let end;
    //         var filterStartDate = new Date(start_date);
    //         let start = new Date(filterStartDate);
    //         var date1 = new Date(filterStartDate);
    //         var iteration = 1;

    //         while (date1 <= new Date(end_date)) {

    //             let day = new Date(date1).getDay();
    //             console.log('day',day)
    //             if (date1 >= new Date(filterStartDate)) {

    //                 let d = new Date(date1);
    //                 d = new Date(d.setDate(d.getDate() + 1));
    //                 if (day == 0) {
    //                     if (iteration % 4 == 1) {
    //                         start = new Date(date1);
    //                     }
    //                     if (date1.getTime() == new Date(end_date).getTime()) {
    //                         end = new Date(date1);
    //                         let dateString = moment(start).format('MMM DD-') + moment(end).format('MMM DD, YYYY');
    //                         weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)),date_string:dateString });

    //                         if(previous_year_filter == 1){
    //                             let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }

    //                         if(year_to_date_filter == 1){
    //                             let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }

    //                         if(previous_period_filter == 1){
    //                             let sdate = new Date(start);
    //                             sdate = sdate.setDate(sdate.getDate()-28);
        
    //                             let eDate = new Date(end);
    //                             eDate = eDate.setDate(eDate.getDate()-28);
    //                             let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('MMM DD, YYYY');
    //                             let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                             weekArray.push(previous_period_date);
    //                         }

    //                     }

    //                 } else if (day == 6) {
    //                     console.log('correct')
    //                     if (iteration % 4 == 0) {
    //                         end = new Date(date1);
    //                         let dateString = moment(start).format('MMM DD-') + moment(end).format('MMM DD, YYYY');
    //                         weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)),date_string:dateString });

    //                         if(previous_year_filter == 1){
    //                             let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }

    //                         if(year_to_date_filter == 1){
    //                             let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }

    //                         if(previous_period_filter == 1){
    //                             let sdate = new Date(start);
    //                             sdate = sdate.setDate(sdate.getDate()-28);
        
    //                             let eDate = new Date(end);
    //                             eDate = eDate.setDate(eDate.getDate()-28);
    //                             let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('MMM DD, YYYY');
    //                             let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                             weekArray.push(previous_period_date);
    //                         }
    //                     } else if (date1.getTime() == new Date(end_date).getTime()) {
    //                         end = new Date(date1);
    //                         let dateString = moment(start).format('MMM DD-') + moment(end).format('MMM DD, YYYY');
    //                         weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)),date_string:dateString });
    
    //                         if(previous_year_filter == 1){
    //                             let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }
    
    //                         if(year_to_date_filter == 1){
    //                             let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                             weekArray.push(pre_year_date);
    //                         }
    
    //                         if(previous_period_filter == 1){
    //                             let sdate = new Date(start);
    //                             sdate = sdate.setDate(sdate.getDate()-28);
        
    //                             let eDate = new Date(end);
    //                             eDate = eDate.setDate(eDate.getDate()-28);
    //                             let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('MMM DD, YYYY');
    //                             let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                             weekArray.push(previous_period_date);
    //                         }
    //                     }
    //                 } else if (date1.getTime() == new Date(end_date).getTime()) {
    //                     console.log('correct')
    //                     end = new Date(date1);
    //                     let dateString = moment(start).format('MMM DD-') + moment(end).format('MMM DD, YYYY');
    //                     weekArray.push({ start: start, end: new Date(new Date(end).setHours(23, 59, 59)),date_string:dateString });

    //                     if(previous_year_filter == 1){
    //                         let pre_year_date= await getOneYearAgoDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                         weekArray.push(pre_year_date);
    //                     }

    //                     if(year_to_date_filter == 1){
    //                         let pre_year_date= await yearStartDateToCustomDate(start,new Date(new Date(end).setHours(23, 59, 59)),'MMM DD-','MMM DD, YYYY');
    //                         weekArray.push(pre_year_date);
    //                     }

    //                     if(previous_period_filter == 1){
    //                         let sdate = new Date(start);
    //                         sdate = sdate.setDate(sdate.getDate()-28);
    
    //                         let eDate = new Date(end);
    //                         eDate = eDate.setDate(eDate.getDate()-28);
    //                         let dateString = moment(sdate).format('MMM DD-') + moment(eDate).format('MMM DD, YYYY');
    //                         let previous_period_date = { start: sdate, end: new Date(new Date(eDate).setHours(23, 59, 59)), date_string:dateString };
    //                         weekArray.push(previous_period_date);
    //                     }

    //                 }
    //             }

    //             iteration = iteration + 1;
    //             date1 = new Date(date1.setDate(date1.getDate() + 1));
    //         }
      
    //         deferred.resolve(weekArray);
    //     } else {
    //         deferred.resolve(weekArray);
    //     }
    //     return deferred.promise;
    // },

    // getBusinessDatesCount: async (startDate, endDate) => {
    //     var deferred = q.defer();
    //     var count = 0;
    //     if (startDate != '' && endDate != '') {
    //         startDate = new Date(startDate);
    //         endDate = new Date(endDate);

    //         var curDate = startDate;
    //         while (curDate <= endDate) {
    //             var dayOfWeek = curDate.getDay();
    //             if (!((dayOfWeek == 6) || (dayOfWeek == 0)))
    //                 count++;
    //             curDate.setDate(curDate.getDate() + 1);
    //         }
    //         deferred.resolve(count);
    //     } else {
    //         deferred.resolve(count);
    //     }
    //     return deferred.promise;
    // },

    // documentListStatus: {
    //     "1": "New",
    //     "2": "Viewed",
    //     "3": "Waiting for response",
    //     "4": "Re-assigned",
    //     "5": "Reviewed"
    // },

    // commentStatus: {
    //     "1": "New",
    //     "2": "Resolved"
    // }
}