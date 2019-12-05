const logger = require('./logger')("dao");
const Datastore = require('nedb');

const dbPath = process.cwd() + '/db/' + 'db.json.db';
logger.log("opening db %s", dbPath);
var db = new Datastore({
    filename: dbPath
});

function dao() {
    'use strict';

    function getUser(name) {
        logger.log('getting user "%s"', name);
        return new Promise(function(resolve, reject) {
            db.loadDatabase(function(err) {
                if (err) {
                    logger.error(err);
                    reject(err);
                }
                let query = {"u": name};
                db.find(query, function(err, docs) {
                    logger.debug('docs ' + JSON.stringify(docs));
                    if (err) {
                        logger.error(err);
                        reject(err);
                    }
                    resolve(docs);
                });
            });
        });
    }


    function addTaskToUser(name, taskname, taskdate) {
        logger.log('adding task to user "%s"', name);
        return new Promise(function(resolve, reject) {
            db.loadDatabase(function(err) {
                if (err) {
                    logger.error(err);
                    reject(err);
                }
                let query = {"u": name};
                let updateQuery = {$push: {"t": {"n":taskname,"d":taskdate}}};
                db.update(query, updateQuery, {multi: false}, function(err, numAffected, affectedDocuments, upsert) {
                    if (err) {
                        logger.error(err);
                        reject(err);
                    }
                    resolve(numAffected);
                });
            });
        });
    }

    return {
        getUser,
        addTaskToUser
    };
}
module.exports = dao();