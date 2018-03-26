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

		var filename = '/home/pi/dht-sensor-' + moment().format('YYYYMMDD') + '.csv';
		try {
		    var csv = moment().toISOString() + ", " + temperature + ", " + humidity + "\n";
		    fs.appendFileSync(filename, csv); 
		} catch(err) { 
		    console.log('Could not append DHT sensor readings to ' + filename + ' : ' + err); 
		}
	    }
	    else {
		console.log("DHT error while reading from sensor " + err);
	    }
	});
    }
});
