var schedule = require('node-schedule');
var day_caIdx = require('../config/api_config_caIdx')();
var mongo_db =  require('../config/db_config_mongo')();
var date = require('date-utils');

module.exports = function () {
    return {
        init: function () {
            try {

                // 매 0시 지수 체크 - day_health+1일 doc, caIdx 오늘+3일 doc 추가
                schedule.scheduleJob('* * * * * *', async () => {
                    var newDate = new Date();
                    var today = newDate.toFormat('YYYYMMDD');
                    var ch_date_id = String(Number(today)+1) 
                    var ch_date = ch_date_id.substr(0,4) + "-" + ch_date_id.substr(4,2) + "-" + ch_date_id.substr(6,2);


                    // day_health+1일 doc
                    var query = {$and : [{date_id:{$lte: ch_date_id}},{id:"1"}] };
                    var projection = {_id:0};
                    var ret = await mongo_db.mongo_find("day_health",query, projection, 1);
                    if (!ret[0]) {
                        ret = await mongo_db.insert_dayhealth("1", "day_health",[ch_date_id, ch_date, 0, 0, 0, 0, 0, 0, 0]);
                        if (!ret[0]) throw err;
                    }

                    // caIdx 오늘+3일 doc 추가

                    ch_date_id = String(Number(today)+3) 
                    
                    ret = await mongo_db.insert("caIdx",{today:ch_date_id, cold_index:"-1", asthma_index:"-1"})
                    if(!ret[0]) throw err;

                });

                // 매 6시 지수 업데이트 - 
                schedule.scheduleJob('0 1 6 * * *', function(){
                    day_caIdx.update();
                });

                // 매 18시 지수 업데이트
                schedule.scheduleJob('0 1 18 * * *', function(){
                    day_caIdx.update();
                });

                // 매주 월요일 0시 db 삭제
                schedule.scheduleJob('0 0 0 * * 1', function(){
            
                });
            } catch (err) {
                console.log("[ERROR] api_config_caIdx init : ", err +"\n");
                throw err;
            }
        }
    }
}