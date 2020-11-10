const { rejects } = require('assert');
const { table, assert, exception } = require('console');
const { tmpdir } = require('os');
const { resolve } = require('path');

var config = require('../config/db_info_mongo').dev;
var MongoClient = require('mongodb').MongoClient,
    f = require('util').format,
    fs = require('fs');

//Specify the Amazon DocumentDB cert
var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];
module.exports = function () {
    return {
        test_open: async () => {
            try {
                var client = await MongoClient.connect(
                    'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                    {
                        sslValidate: true,
                        sslCA: ca,
                        useNewUrlParser: true
                    });
                var db = client.db(config.database);
                var col = db.collection('test');

                //Insert a single document

                var tmp = await col.insertOne({ 'test': '1' });
                if (tmp) console.log("MongoDB insertOne test : " + tmp+"\n");

                tmp = await col.findOne({ 'test': '1' });
                if (tmp) console.log("MongoDB findOne test : " + JSON.stringify(tmp)+"\n");

                tmp = await col.deleteOne({ 'test': '1' });
                if (tmp) console.log("MongoDB deleteOne test : " + tmp+"\n\n");
                console.log("mongodb connection success in port 27017 @@@===");
                return true;
            } catch (err) {
                console.log("[init] error : ", err);
                return false;
            }
        },
        insert: async (col_name, new_doc) => {
            try {
                var client = await MongoClient.connect(
                    'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                    {
                        sslValidate: true,
                        sslCA: ca,
                        useNewUrlParser: true
                    });
                var db = client.db(config.database);
                var col = db.collection(""+col_name);
                console.log("insert_json : " + JSON.stringify(new_doc));
                var tmp = await col.insertOne(new_doc);
                if (tmp) {
                    console.log("json_insert : " + JSON.stringify(new_doc));
                    console.log("[success_insert] MongoDB  -> " + col_name + ", result : ", JSON.stringify(tmp)+"\n\n");
                    return [true];
                }
            } catch (err) {
                console.log(err);
                return [false];
            }
        },
        insert_dayhealth: async (id, col_name, value_arr) => {
            try {
                var client = await MongoClient.connect(
                    'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                    {
                        sslValidate: true,
                        sslCA: ca,
                        useNewUrlParser: true
                    });
                var db = client.db(config.database);
                var col = db.collection(""+col_name);
                var tmp_json = {
                    id: id,
                    date_id: Number(value_arr[0]),
                    date: value_arr[1],
                    water: value_arr[2],
                    sleep: value_arr[3],
                    food: value_arr[4],
                    drinking: value_arr[5],
                    smoking: value_arr[6],
                    exercise: value_arr[7],
                    result: value_arr[8]
                };
                console.log("insert_dayhealth_json : " + tmp_json);
                var tmp = await col.insertOne(tmp_json);
                if (tmp) {
                    console.log("json_insert_dayhealth : " + tmp_json);
                    console.log("[success_insert_dayhealth] MongoDB  -> " + col_name + ", result : ", JSON.parse(tmp)+"\n\n");
                    return [true];
                }
            } catch (err) {
                console.log(err);
                return [false];
            }
        },
        mongo_findOne: async (col_name, query, projection) => { // id : 사용자 아이디, col_name : 컬렉션 네임, query : 문자열 쿼리, projection : 나올 컬럼
            try {
                var client = await MongoClient.connect(
                    'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                    {
                        sslValidate: true,
                        sslCA: ca,
                        useNewUrlParser: true
                    });
                var db = client.db(config.database);
                var col = db.collection(""+col_name);
                var tmp = await col.find(query, projection);
                if (tmp) {
                    console.log("query_find : " + JSON.stringify(query));
                    console.log("projection_find : " + JSON.stringify(projection));
                    console.log("[success_find] MongoDB  -> " + col_name + ", result: " + JSON.stringify(tmp)+"\n\n");
                    return [true, JSON.stringify(tmp)];
                }
            } catch (err) {
                console.log(err);
                return [false];
            }
        },
        mongo_find: async (col_name, query, projection, limit_num = 0) => { // id : 사용자 아이디, col_name : 컬렉션 네임, query : 문자열 쿼리, projection : 나올 컬럼
            try {
                var client = await MongoClient.connect(
                    'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                    {
                        sslValidate: true,
                        sslCA: ca,
                        useNewUrlParser: true
                    });
                var db = client.db(config.database);
                var col = db.collection(""+col_name);
                var tmp = await col.find(query, projection).sort({date_id:-1}).limit(limit_num).toArray();
                if (tmp) {
                    console.log("query_find : " + JSON.stringify(query));
                    console.log("projection_find : " + JSON.stringify(projection));
                    console.log("[success_find] MongoDB  -> " + col_name + ", result: " + JSON.stringify(tmp)+"\n\n");
                    return [true, JSON.stringify(tmp)];
                }
            } catch (err) {
                console.log(err);
                return [false];
            }
        },
        mongo_updateOne: async (col_name, query, operator, upsert) => { //operator : 데이터 수정 컬럼과 값
            try {
                var client = await MongoClient.connect(
                    'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                    {
                        sslValidate: true,
                        sslCA: ca,
                        useNewUrlParser: true
                    });
                var db = client.db(config.database);
                var col = db.collection(col_name);

                var tmp = col.updateOne(query, operator, upsert);
                if (tmp) {
                    console.log("query_update : " + JSON.stringify(query));
                    console.log("operator_update : " + JSON.stringify(operator));
                    console.log("operator_update : " + JSON.stringify(upsert));
                    console.log("[success_update] MongoDB  -> " + col_name + ', result: ' + tmp+"\n\n");
                    return [true];
                }
            } catch (err) {
                console.log(err);
                return [false];
            }
        },
        mongo_deleteMany: async (col_name, query) => {
            try {
                var client = await MongoClient.connect(
                    'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                    {
                        sslValidate: true,
                        sslCA: ca,
                        useNewUrlParser: true
                    });
                var db = client.db(config.database);
                var col = db.collection(""+col_name);

                var tmp = await col.deleteMany(query);
                if (tmp) {
                    console.log("query_delete : " + JSON.stringify(query));
                    console.log("[success_delete] MongoDB  -> " + col_name + ", result: " + tmp+"\n\n");
                    return true;
                }
            } catch (err) {
                console.log(err);
                return false;
            }
        }
    }
};