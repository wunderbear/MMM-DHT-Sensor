'use strict';

/* Magic Mirror
 * Module: MMM-DHT-Sensor
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const sensor = require('node-dht-sensor');
const moment = require('moment');
const fs = require('fs');


module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting helper: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        const self = this;
        this.config = payload;
        setInterval(function() {
            self.checkTemperature();
        }, this.config.updateInterval);
    },

    checkTemperature: function() {
        const self = this;

	// switch sensor type + sensor pin: this.config.sensorType / this.config.sensorPIN
	sensor.read(22, 24, function(err, temperature, humidity) {
	    if(!err) {
	    	self.sendSocketNotification('DHT_TEMPERATURE', temperature.toFixed(1));
		self.sendSocketNotification('DHT_HUMIDITY', humidity.toFixed(1));

		console.log('Trying to append to file ' + this.config.logfile);
		fs.appendFile(
		  '/home/pi/dht-sensor.csv', 
		  moment().toISOString() + ", " + temperature + ", " + humidity + "\n",
		  (err) => { if (err) console.log('Could not append DHT sensor readings file ' + this.config.logfile); }
 		);
	    }
	    else {
		console.log("DHT error while reading from sensor " + err);
	    }
	});
    }
});
