const schema = require("../models/bills");


function ReportPage(req,res){ // Bill totals
     schema.find((err,data)=>{
          res.render("report", {
               data:data
          });
     });
}

module.exports = {
     _ReportP_ : ReportPage
};
