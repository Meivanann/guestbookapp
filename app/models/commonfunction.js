var moment = require('moment');
var sql = require('../../config/database.config');
var q = require('q');

module.exports = {
    

  

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

    
}