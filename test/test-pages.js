var expect  = require('chai').expect;
var request = require('request');

it('Student list fetched successfully ', function(done) {
    request('http://localhost:8011/displaystudents' , function(error, response, body) {
        done(response)
    });
});