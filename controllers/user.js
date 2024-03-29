var mysql_dbc = require('../api/mysql')();
var mongo_db =  require('../api/mongodb')();

let { PythonShell } = require('python-shell');

exports.postLogin = async (req, res, next) => {
    // return : 1(success), 0(server err), -1 (login fail), -2(failcount 5 more) 
    console.log('\n/user/login\n'+req.body);

    var id = req.body.id;
    var pw = req.body.pw;

    try{
    var ret = await mysql_dbc.select_from_id(id, ['id_num', 'pw', 'failcount']);
    var idnum = ret[1].id_num;
    var failcount = ret[1].failcount;
    if (ret[0]) { // if user exists
        if (ret[1].pw == pw) { // if match pw
            var last_login = new Date().toFormat('YYYY-MM-DD');
            ret = await mysql_dbc.updateOne(idnum, 'user', ['failcount', 'last_login'], [0,last_login]);
            if(!ret[0]) throw err;
            ret = await mysql_dbc.select_from_idnum(idnum, 'user', ['id','name','gender','area','age','phone','checked'])
            if (!ret[0]) throw err;
            res.status(200).send({ result: '1', data: ret[1][0] }); // login success
        } else {// if not match pw
            ret= await mysql_dbc.updateOne(idnum, 'user', ['failcount'], [Number(failcount) + 1]);
            console.log('failcount : ', failcount);
            if(!ret[0]) throw err;
            if (failcount >= 5) {
                res.status(200).send({ result: '-2' }); // failcount 5 more
            }else res.status(200).send({ result: '-1' }); // login fail 
        }
    } else throw err;
}catch (err){
    res.status(500).send({ result: '0' }); // server err
}
};

exports.postJoin = async (req, res, next) => {
    console.log('\n/user/join\n'+req.body);

    var id = req.body.id; 
    var pw = req.body.pw;
    var name = req.body.name; 
    var gender = req.body.gender;
    var area = req.body.area;
    var age = req.body.age;
    var phone = req.body.phone;
    var HE_fh = req.body.HE_fh;
    var HE_HPfh = req.body.HE_HPfh; 
    var HE_HLfh = req.body.HE_HLfh;
    var HE_IHDfh = req.body.HE_IHDfh;
    var HE_STRfh = req.body.HE_STRfh;
    var HE_HBfh = req.body.HE_HBfh;
    var HE_DMfh = req.body.HE_DMfh;
    var BH2_61 = req.body.BH2_61;
    var DI1_dg = req.body.DI1_dg;
    var DI2_dg = req.body.DI2_dg;
    var DI3_dg = req.body.DI3_dg;
    var DJ4_dg = req.body.DJ4_dg;
    var DI4_dg = req.body.DI4_dg;
    var DJ2_dg = req.body.DJ2_dg;
    var DE1_dg = req.body.DE1_dg;
    var DE1_32 = req.body.DE1_32;
    var DC1_dg = req.body.DC1_dg;
    var DC2_dg = req.body.DC2_dg;
    var DC6_dg = req.body.DC6_dg;
    var DJ8_dg = req.body.DJ8_dg;
    var DJ6_dg = req.body.DJ6_dg;
    var DK8_dg = req.body.DK8_dg;
    var DK9_dg = req.body.DK9_dg;
    var DK4_dg = req.body.DK4_dg;
    var exercise = req.body.exercise;
    var BO1_1 = req.body.BO1_1;
    var BP1 = req.body.BP1;
    var D_1_1 = req.body.D_1_1;
    var BE5_1 = req.body.BE5_1;
    var BS3_1 = req.body.BS3_1;
    var DI1_2 = req.body.DI1_2;
    var DI2_2 = req.body.DI2_2;
    var HE_ht = req.body.HE_ht;
    var HE_wt = req.body.HE_wt;
    var EC_wht_23 = req.body.EC_wht_23;
    var HE_sput2 = req.body.HE_sput2;
    var BS3_2 = req.body.BS3_2;
    var Total_slp_wk = req.body.Total_slp_wk;
    var Total_slp_wd = req.body.Total_slp_wd;
    var BD2_1 = req.body.BD2_1;
    var BE3_33 = req.body.BE3_33;
    var bmi = req.body.bmi;
    var depSum = req.body.depSum;
    var checked = req.body.check;

    console.log('id : ' + id + '  pw : ' + pw);

    var last_login = new Date().toFormat('YYYY-MM-DD');
    var params = [id, pw, name, gender, area, age, phone, checked, 0, last_login];

    try {

        var idnum = await mysql_dbc.insert_join('user', params);
        if (idnum[0] == false) throw err;
        else idnum = idnum[1];

        // insert disease_prefer, day_% tables
        var ret2 = await mysql_dbc.insert_join('disease_prefer', [idnum]);
        if (ret2[0] == false) throw err;

        var day_table = ['day_cirrhosis', 'day_depression', 'day_diabetes', 'day_gastriculcer', 'day_hepatitisa', 'day_hepatitisb', 'day_hepatitisc', 'day_lungcancer', 'day_lungdisease', 'day_myocardial', 'day_stroke'];
        for (var i = 0; i < 11; i++) {
            var ret3 = await mysql_dbc.insert_join(day_table[i], [idnum, last_login]);
            if (ret3[0] == false) throw err;
        }

        // insert diseaseal table
        if (checked == 1) {
            var carstairs = req.body.carstairs;
            var is_obesity = req.body.is_obesity;
            var FPG = req.body.FPG;
            var TG = req.body.TG;
            var leukocyte = req.body.leukocyte;
            var total_colesterol = req.body.total_colesterol;
            var HDL = req.body.HDL;
            var LDL = req.body.LDL;
            var HbA = req.body.HbA;
            var SBP = req.body.SBP;
            var DBP = req.body.DBP;
            var is_atrialFibrillation = req.body.is_atrialFibrillation;
            var PT_INR = req.body.PT_INR;
            var bilirubin = req.body.bilirubin;
            var creatinine = req.body.creatinine;
            var ammonia = req.body.ammonia;
            var AFP = req.body.AFP;
            var albumin = req.body.albumin;
            var platelet = req.body.platelet;
            var DLD_serve = req.body.DLD_serve;
            var is_hypercholesterolemia = req.body.is_hypercholesterolemia;
            var is_chemicHeartDisease = req.body.is_chemicHeartDisease
            var history_cancer = req.body.history_cancer;
            var meal_reg = req.body.meal_reg;
            var salt_pref = req.body.salt_pref;
            var dr_5y = req.body.drinking_5y;
            var BD2_1 = req.body.BD2_1; // drinking or alcohol
            var BS3_1 = req.body.BS3_1; // cur_smoking
            var BS3_2 = req.body.BS3_2; // smoking
            var exercise = req.body.exercise; // PhA

            // insert diseaseag
            var diseaseAg_params = [idnum, carstairs, HE_DMfh, HE_IHDfh, DE1_dg, DI1_dg, DI3_dg, bmi, age, gender, is_obesity, BD2_1, BS3_2, BS3_1, exercise, area, FPG, TG, leukocyte, total_colesterol, HDL, LDL, HbA, SBP, DBP, is_atrialFibrillation, PT_INR, bilirubin, creatinine, ammonia, AFP, albumin, platelet, DLD_serve, is_hypercholesterolemia, is_chemicHeartDisease, history_cancer, meal_reg, salt_pref, dr_5y];
            console.log("diseaseAg_params : " + diseaseAg_params);
            var ret4 = await mysql_dbc.insert_join('diseaseag', diseaseAg_params);
            if (!ret4[0]) throw err;

            // insert disease_data
            var diseaseData_params = [idnum, age, gender, area, HE_fh, HE_HPfh, HE_HLfh, HE_IHDfh, HE_STRfh, HE_HBfh, HE_DMfh, BH2_61, DI1_dg, DI2_dg, DI3_dg, DJ4_dg, DI4_dg, DJ2_dg, DE1_dg, DE1_32, DC1_dg, DC2_dg, DC6_dg, DJ8_dg, DJ6_dg, DK8_dg, DK9_dg, DK4_dg, exercise, BO1_1, BP1, D_1_1, BE5_1, BS3_1, DI1_2, DI2_2, HE_ht, HE_wt, EC_wht_23, HE_sput2, BS3_2, Total_slp_wk, Total_slp_wd, BD2_1, BE3_33, bmi,
                depSum, is_obesity,carstairs,FPG, TG, leukocyte, total_colesterol, HDL, LDL, HbA, SBP, DBP, is_atrialFibrillation, PT_INR, bilirubin, creatinine, ammonia, AFP, albumin, platelet, DLD_serve, is_hypercholesterolemia, is_chemicHeartDisease, history_cancer, meal_reg, salt_pref, dr_5y];
            
            console.log("diseaseData_params : " + diseaseData_params);
            var ret5 = await mysql_dbc.insert_join('disease_data', diseaseData_params);
            if (!ret5[0]) throw err;

        }else{ // checked = 0 (No checkup)
            
            // insert diseaseag
            var ret7 = await mysql_dbc.insert_join('diseaseag', [idnum, age, gender]);
            if (!ret7[0]) throw err;

            // insert disease_data
            var diseaseData_params = [idnum, age, gender, area, HE_fh, HE_HPfh, HE_HLfh, HE_IHDfh, HE_STRfh, HE_HBfh, HE_DMfh, BH2_61, DI1_dg, DI2_dg, DI3_dg, DJ4_dg, DI4_dg, DJ2_dg, DE1_dg, DE1_32, DC1_dg, DC2_dg, DC6_dg, DJ8_dg, DJ6_dg, DK8_dg, DK9_dg, DK4_dg, exercise, BO1_1, BP1, D_1_1, BE5_1, BS3_1, DI1_2, DI2_2, HE_ht, HE_wt, EC_wht_23, HE_sput2, BS3_2, Total_slp_wk, Total_slp_wd, BD2_1, BE3_33, bmi,
                depSum, null,null,null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
            
            console.log("diseaseData_params : " + diseaseData_params);
            var ret5 = await mysql_dbc.insert_join('disease_data', diseaseData_params);
            if (!ret5[0]) throw err;
        }
       res.status(200).send({ result: '1' });
    } catch (err) {
        res.status(500).send({ result: '0' });
    }
};

exports.postAllData = async (req, res, next) => {
    console.log('\n/user/all-data\n'+req.body);

    var flag = req.body.flag;
    var id = req.body.id;
    var gender;
    var area;
    var age;
    var checked;
    var HE_fh = req.body.HE_fh;
    var HE_HPfh = req.body.HE_HPfh;
    var HE_HLfh = req.body.HE_HLfh;
    var HE_IHDfh = req.body.HE_IHDfh;
    var HE_STRfh = req.body.HE_STRfh;
    var HE_HBfh = req.body.HE_HBfh;
    var HE_DMfh = req.body.HE_DMfh;
    var BH2_61 = req.body.BH2_61;
    var DI1_dg = req.body.DI1_dg;
    var DI2_dg = req.body.DI2_dg;
    var DI3_dg = req.body.DI3_dg;
    var DJ4_dg = req.body.DJ4_dg;
    var DI4_dg = req.body.DI4_dg;
    var DJ2_dg = req.body.DJ2_dg;
    var DE1_dg = req.body.DE1_dg;
    var DE1_32 = req.body.DE1_32;
    var DC1_dg = req.body.DC1_dg;
    var DC2_dg = req.body.DC2_dg;
    var DC6_dg = req.body.DC6_dg;
    var DJ8_dg = req.body.DJ8_dg;
    var DJ6_dg = req.body.DJ6_dg;
    var DK8_dg = req.body.DK8_dg;
    var DK9_dg = req.body.DK9_dg;
    var DK4_dg = req.body.DK4_dg;
    var exercise = req.body.exercise;
    var BO1_1 = req.body.BO1_1;
    var BP1 = req.body.BP1;
    var D_1_1 = req.body.D_1_1;
    var BE5_1 = req.body.BE5_1;
    var BS3_1 = req.body.BS3_1;
    var DI1_2 = req.body.DI1_2;
    var DI2_2 = req.body.DI2_2;
    var HE_ht = req.body.HE_ht;
    var HE_wt = req.body.HE_wt;
    var EC_wht_23 = req.body.EC_wht_23;
    var HE_sput2 = req.body.HE_sput2;
    var BS3_2 = req.body.BS3_2;
    var Total_slp_wk = req.body.Total_slp_wk;
    var Total_slp_wd = req.body.Total_slp_wd;
    var BD2_1 = req.body.BD2_1;
    var BE3_33 = req.body.BE3_33;
    var bmi = req.body.bmi;
    var depSum = req.body.depSum;

    try { // update: async (id_num, table, wanted_column, new_params) 

        var ret = await mysql_dbc.select_from_id(id, ['id_num']);
        if (!ret[0]) throw err;
        var idnum = ret[1].id_num;

        /*
        // get depSum from disease_data
        var depSum_ret = await mysql_dbc.select_from_idnum(idnum, 'disease_data', ['depSum']);
        if (!depSum_ret[0]) throw err;
        var depSum = depSum_ret[1].depSum ;
        */
        
        // get gender, area, age
        var user_ret = await mysql_dbc.select_from_idnum(idnum, 'user', ['gender','area','age','checked']);
        if (!user_ret[0]) throw err;
        gender = user_ret[1][0].gender;
        area = user_ret[1][0].area;
        age = user_ret[1][0].age;
        checked = user_ret[1][0].checked;

        // insert diseaseml
        var diseaseML_params = [age, gender, HE_fh, HE_HPfh, HE_HLfh, HE_IHDfh, HE_STRfh, HE_HBfh, HE_DMfh, BH2_61, DI1_dg, DI2_dg, DI3_dg, DJ4_dg, DI4_dg, DJ2_dg, DE1_dg, DE1_32, DC1_dg, DC2_dg, DC6_dg, DJ8_dg, DJ6_dg, DK8_dg, DK9_dg, DK4_dg, exercise, BO1_1, BP1, D_1_1, BE5_1, BS3_1, DI1_2, DI2_2, HE_ht, HE_wt, EC_wht_23, HE_sput2, BS3_2, Total_slp_wk, Total_slp_wd, BD2_1, BE3_33, bmi];
        var ret1 = await mysql_dbc.update_all(idnum, 'diseaseml', diseaseML_params);
        if (!ret1[0]) throw err;
        
        if (checked == 1) {
            var carstairs = req.body.carstairs;
            var is_obesity = req.body.is_obesity;
            var FPG = req.body.FPG;
            var TG = req.body.TG;
            var leukocyte = req.body.leukocyte;
            var total_colesterol = req.body.total_colesterol;
            var HDL = req.body.HDL;
            var LDL = req.body.LDL;
            var HbA = req.body.HbA;
            var SBP = req.body.SBP;
            var DBP = req.body.DBP;
            var is_atrialFibrillation = req.body.is_atrialFibrillation;
            var PT_INR = req.body.PT_INR;
            var bilirubin = req.body.bilirubin;
            var creatinine = req.body.creatinine;
            var ammonia = req.body.ammonia;
            var AFP = req.body.AFP;
            var albumin = req.body.albumin;
            var platelet = req.body.platelet;
            var DLD_serve = req.body.DLD_serve;
            var is_hypercholesterolemia = req.body.is_hypercholesterolemia;
            var is_chemicHeartDisease = req.body.is_chemicHeartDisease
            var history_cancer = req.body.history_cancer;
            var meal_reg = req.body.meal_reg;
            var salt_pref = req.body.salt_pref;
            var dr_5y = req.body.drinking_5y;
            var BD2_1 = req.body.BD2_1;
            var BS3_1 = req.body.BS3_1;
            var BS3_2 = req.body.BS3_2;
            var exercise = req.body.exercise;


            var diseaseAg_params = [carstairs, HE_DMfh, HE_IHDfh, DE1_dg, DI1_dg, DI3_dg, bmi, age, gender, is_obesity, BD2_1, BS3_2, BS3_1, exercise, area, FPG, TG, leukocyte, total_colesterol, HDL, LDL, HbA, SBP, DBP, is_atrialFibrillation, PT_INR, bilirubin, creatinine, ammonia, AFP, albumin, platelet, DLD_serve, is_hypercholesterolemia, is_chemicHeartDisease, history_cancer, meal_reg, salt_pref, dr_5y];
            console.log(diseaseAg_params);

            var ret2 = await mysql_dbc.update_all(idnum, 'diseaseag', diseaseAg_params);
            if (!ret2[0]) throw err;

            var diseaseData_params = [idnum, age, gender, area, HE_fh, HE_HPfh, HE_HLfh, HE_IHDfh, HE_STRfh, HE_HBfh, HE_DMfh, BH2_61, DI1_dg, DI2_dg, DI3_dg, DJ4_dg, DI4_dg, DJ2_dg, DE1_dg, DE1_32, DC1_dg, DC2_dg, DC6_dg, DJ8_dg, DJ6_dg, DK8_dg, DK9_dg, DK4_dg, exercise, BO1_1, BP1, D_1_1, BE5_1, BS3_1, DI1_2, DI2_2, HE_ht, HE_wt, EC_wht_23, HE_sput2, BS3_2, Total_slp_wk, Total_slp_wd, BD2_1, BE3_33, bmi,
                depSum, is_obesity,carstairs,FPG, TG, leukocyte, total_colesterol, HDL, LDL, HbA, SBP, DBP, is_atrialFibrillation, PT_INR, bilirubin, creatinine, ammonia, AFP, albumin, platelet, DLD_serve, is_hypercholesterolemia, is_chemicHeartDisease, history_cancer, meal_reg, salt_pref, dr_5y];
            
            console.log("diseaseData_params : " + diseaseData_params);
            var ret5 = await mysql_dbc.update_all(idnum,'disease_data', diseaseData_params);
            if (!ret5[0]) throw err;

            res.status(200).send({ result: '1' });
        }
    } catch (err) {
        res.status(500).send({ result: '0' });
    }
};

exports.postData = async (req, res, next) => {
    console.log('\n/user/data\n'+req.body);

    var id = req.body.id;
    var table = req.body.table;
    var column_arr = req.body.column_arr;
    var value_arr = req.body.value_arr;
    var wanted_column = [];
    var new_params = [];

    try { // update: async (id_num, table, wanted_column, new_params) 

        var ret = await mysql_dbc.select_from_id(id, ['id_num']); 
        if (!ret[0]) throw err;
        var idnum = ret[1].id_num;

        var tmp_column = column_arr.split(',');
        var tmp_value = value_arr.split(',');

        for(var i=0;i<tmp_column.length;i++){
            wanted_column.push(tmp_column[i]);
            new_params.push(tmp_value[i]);
        }
        var ret = await mysql_dbc.updateOne(idnum, table, wanted_column, new_params);
        if (!ret[0]) throw err;

        res.status(200).send({ result: '1' });
        
    } catch (err) {
        res.status(500).send({ result: '0' });
    }
};

exports.postMLRisk = async (req, res, next) => {
    console.log("\n/user/ml-risk\n"+req.body);

    var id = req.body.id;
    var day = req.body.day;
    var gender = Number(req.body.gender);
    var age = Number(req.body.age);
    var HE_fh = Number(req.body.HE_fh);
    var HE_HPfh = Number(req.body.HE_HPfh);
    var HE_HLfh = Number(req.body.HE_HLfh);
    var HE_IHDfh = Number(req.body.HE_IHDfh);
    var HE_STRfh = Number(req.body.HE_STRfh);
    var HE_HBfh = Number(req.body.HE_HBfh);
    var HE_DMfh = Number(req.body.HE_DMfh);
    var BH2_61 = Number(req.body.BH2_61);
    var DI1_dg = Number(req.body.DI1_dg);
    var DI2_dg = Number(req.body.DI2_dg);
    var DI3_dg = Number(req.body.DI3_dg);
    var DJ4_dg = Number(req.body.DJ4_dg);
    var DI4_dg = Number(req.body.DI4_dg);
    var DJ2_dg = Number(req.body.DJ2_dg);
    var DE1_dg = Number(req.body.DE1_dg);
    var DE1_32 = Number(req.body.DE1_32);
    var DC1_dg = Number(req.body.DC1_dg);
    var DC2_dg = Number(req.body.DC2_dg);
    var DC6_dg = Number(req.body.DC6_dg);
    var DJ8_dg = Number(req.body.DJ8_dg);
    var DJ6_dg = Number(req.body.DJ6_dg);
    var DK8_dg = Number(req.body.DK8_dg);
    var DK9_dg = Number(req.body.DK9_dg);
    var DK4_dg = Number(req.body.DK4_dg);
    var BO1_1 = Number(req.body.BO1_1);
    var BP1 = Number(req.body.BP1);
    var D_1_1 = Number(req.body.D_1_1);
    var exercise = Number(req.body.D_1_1);
    var BE5_1 = Number(req.body.BE5_1);
    var BS3_1 = Number(req.body.BS3_1);
    var DI1_2 = Number(req.body.DI1_2);
    var DI2_2 = Number(req.body.DI2_2);
    var EC_wht_23 = Number(req.body.EC_wht_23);
    var HE_sput2 = Number(req.body.HE_sput2);
    var BS3_2 = Number(req.body.BS3_2);
    var Total_slp_wk = Number(req.body.Total_slp_wk);
    var Total_slp_wd = Number(req.body.Total_slp_wd);
    var BD2_1 = Number(req.body.BD2_1);
    var bmi = Number(req.body.bmi);
    var BE3_33 = Number(req.body.BE3_33);
    var depSum = Number(req.body.depSum);


    var param = { age: age, gender: gender, HE_fh: HE_fh, HE_HPfh: HE_HPfh, HE_HLfh: HE_HLfh, HE_IHDfh: HE_IHDfh, HE_STRfh: HE_STRfh, HE_HBfh: HE_HBfh, HE_DMfh: HE_DMfh, BH2_61: BH2_61, DI1_dg: DI1_dg, DI2_dg: DI2_dg, DI3_dg: DI3_dg, DJ4_dg: DJ4_dg, DI4_dg: DI4_dg, DJ2_dg: DJ2_dg, DE1_dg: DE1_dg, DE1_32: DE1_32, DC1_dg: DC1_dg, DC2_dg: DC2_dg, DC6_dg: DC6_dg, DJ8_dg: DJ8_dg, DJ6_dg: DJ6_dg, DK8_dg: DK8_dg, DK9_dg: DK9_dg, DK4_dg: DK4_dg, BO1_1: BO1_1, BP1: BP1, D_1_1: D_1_1, BE5_1: BE5_1, BS3_1: BS3_1, DI1_2: DI1_2, DI2_2: DI2_2, EC_wht_23: EC_wht_23, HE_sput2: HE_sput2, BS3_2: BS3_2, Total_slp_wk: Total_slp_wk, Total_slp_wd: Total_slp_wd, BD2_1: BD2_1, bmi: bmi, BE3_33: BE3_33 };

    console.log(param);
    var param2 = {
        'b_hepatitis': 1, 'c_hepatitis': 1, 'cirrhosis': 1, 'diabetes': 1,
        'Lung_cancer': 1, 'Myocardial_infarction': 1, 'stomach_cancer': 1, 'stroke': 1
    };

    let options = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '/home/hosting_users/aidoctor/apps/aidoctor_aidoctor/ml_diseases',
        args: [JSON.stringify(param), JSON.stringify(param2)]
    };


    PythonShell.run('disease_result.py', options, async (err, results) => {
        if (err) {
            console.log(err);
        }

        console.log(results);

        try {
            temp = JSON.parse(results);
        } catch (e) {
            return console.error(e);
        }


        var result = { 'b_hepatitis': temp['b_hepatitis'], 'c_hepatitis': temp['c_hepatitis'], 'cirrhosis': temp['cirrhosis'], 'diabetes': temp['diabetes'], 'Lung_cancer': temp['Lung_cancer'], 'Myocardial_infarction': temp['Myocardial_infarction'], 'stomach_cancer': temp['stomach_cancer'], 'stroke': temp['stroke'] };
        console.log(result, temp);

        //{id:id, diabetes:temp['diabetes'], hepatitisA:'None', hepatitisB:temp['b_hepatitis'], hepatitisC:temp['c_hepatitis'], cirrhosis:temp['cirrhosis'], depression:depSum, gastriculcer:temp['stomach_cancer'], lungcancer:temp['Lung_cancer'], lungdisease:'None', myocardial:temp['Myocardial_infarction'], stroke:temp['stroke']}
        try {
            var ret = await mysql_dbc.select_from_id(id, ['id_num']);
            if (!ret[0]) throw err;
            var disease_all_params = [ret[1].id_num, temp['diabetes'], 'None', temp['b_hepatitis'], temp['c_hepatitis'], temp['cirrhosis'], temp['stomach_cancer'], temp['Lung_cancer'], 'None', temp['Myocardial_infarction'], temp['stroke'], depSum];
            console.log("disease_all_pararms : ", disease_all_params);

            var ret = await mysql_dbc.insert_join('disease_all', disease_all_params);
            if (!ret[0]) throw err;
            res.status(200).send({ result: '1' });
        } catch (err) {
            res.status(500).send({ result: "0" });
        }
    });
};

exports.postReceiveAllDisease = async (req, res, next) => {
    console.log('\n/user/receive-all-disease\n'+req.body);

    var id = req.body.id;
    var diabetes = req.body.diabetes;
    var hepatitisA = req.body.hepatitisA;
    var hepatitisB = req.body.hepatitisB;
    var hepatitisC = req.body.hepatitisC;
    var cirrhosis = req.body.cirrhosis;
    var depression = req.body.depression;
    var gastriculcer = req.body.gastriculcer;
    var lungcancer = req.body.lungcancer;
    var lungdisease = req.body.lungdisease;
    var myocardial = req.body.myocardial;
    var stroke = req.body.stroke;

    if (diabetes > 100) diabetes = (diabetes / 10).toFixed(1);
    if (hepatitisA > 100) hepatitisA = (hepatitisA / 10).toFixed(1);
    if (hepatitisB > 100) hepatitisB = (hepatitisB / 10).toFixed(1);
    if (hepatitisC > 100) hepatitisC = (hepatitisC / 10).toFixed(1);
    if (cirrhosis > 100) cirrhosis = (cirrhosis / 10).toFixed(1);
    if (gastriculcer > 100) gastriculcer = (gastriculcer / 10).toFixed(1);
    if (lungcancer > 100) lungcancer = (lungcancer / 10).toFixed(1);
    if (lungdisease > 100) lungdisease = (lungdisease / 10).toFixed(1);
    if (myocardial > 100) myocardial = (myocardial / 10).toFixed(1);
    if (stroke > 100) stroke = (stroke / 10).toFixed(1);

    try {
        var ret = await mysql_dbc.select_from_id(id, ['id_num']);
        console.log(ret[1].id_num);
        if (!ret[0]) throw err;
        var disease_all_params = [diabetes, hepatitisA, hepatitisB, hepatitisC, cirrhosis, gastriculcer, lungcancer, lungdisease, myocardial, stroke, depression];
        
        var ret1 = await mysql_dbc.select_from_idnum(ret[1].id_num,'disease_all', ['id_num']);
        if(!ret1[0]) {
            disease_all_params = [ret[1].id_num, diabetes, hepatitisA, hepatitisB, hepatitisC, cirrhosis, gastriculcer, lungcancer, lungdisease, myocardial, stroke, depression];
            var ret2 = await mysql_dbc.insert_join('disease_all', disease_all_params);
            if (!ret2[0]) throw err;
        }else{
            var ret2 = await mysql_dbc.update_all(ret[1].id_num,'disease_all',disease_all_params);
            if (!ret2[0]) throw err;
        }
        res.status(200).send({ result: '1' });
    } catch{
        res.status(500).send({ result: '0' });
    }
};

exports.postSendAllDisease = async (req, res, next) => {
    console.log('\n/user/send-all-disease\n'+req.body);

    var id = req.body.id;

    try {
        var ret = await mysql_dbc.select_from_id(id, ['id_num']);
        if (!ret[0]) throw err;
        var ret = await mysql_dbc.select_from_idnum(ret[1].id_num, 'disease_all', ['*']);
        if (!ret[0]) throw err;
        console.log(ret[1]);
        res.json({ result: '1', data: ret[1][0] });
    } catch{
        res.status(500).send({ result: '0' });
    }
};

exports.postSendAllData = async (req, res, next) => {
    console.log('\n/user/send-all-data\n'+req.body);
    var id = req.body.id;

    try {
        var ret = await mysql_dbc.select_from_id(id, ['id_num']);
        if (!ret[0]) throw err;
        var ret2 = await mysql_dbc.select_from_idnum(ret[1].id_num, 'user', ['*']);
        if (!ret2[0]) throw err;
        var ret3 = await mysql_dbc.select_from_idnum(ret[1].id_num, 'disease_data', ['*']);

        ret2 = ret2[1][0];
        delete ret2["id_num"];
        ret3 = ret3[1][0];
        delete ret3["id_num"];


        var tmp = (JSON.stringify(ret2) +JSON.stringify(ret3));
        tmp = tmp.replace("}{",",");
        var ret10 = JSON.parse(tmp);

        console.log(ret10);
        res.json({ result: '1', data: ret10});
    } catch{
        res.status(500).send({ result: '0' });
    }
};

exports.postSendDayHealth = async (req, res, next) => {
    console.log('\n/user/send-day-health\n'+req.body);
    
    var id = req.body.id;
    var date_id = Number(req.body.date_id);
    var projection = {_id:0};
   
    try{
        var query = {$and : [{date_id:{$lte: date_id}},{id:id}] };
        var ret = await mongo_db.mongo_find("day_health",query, projection, 7);
        if (!ret[0]) throw err;
        res.status(200).send({result:'1', data: ret[1]});
    }catch(err){
        console.log(err);
        res.status(500).send({ result: '0' });
    }
}

exports.postCheckId = async (req, res, next) => {
    console.log('\n/user/check-id\n'+req.body);

    var id = req.body.id;

    try{
    var ret = await mysql_dbc.select_from_id(id, ['id_num']);
    if (ret[0]) {
        res.status(200).send({ result: '1' });
    } else res.status(200).send({ result: '0' });
}catch(err) {
    res.status(500).send({result: '0'});
}
};