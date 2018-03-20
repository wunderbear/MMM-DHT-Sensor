'use strict';

/* Magic Mirror
 * Module: MMM-DHT-Sensor
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const sensor = require('node-dht-sensor');

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting helper: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        const self = this;
        this.config = payload;

/*
        if (this.config.sensorType === 11) {
            this.dht = new RpiDht.DHT11(this.config.sensorPIN);
        } else if (this.config.sensorType === 22) {
            this.dht = new RpiDht.DHT22(this.config.sensorPIN);
        } else {
            console.log("Error in " + this.name + " sensorType unsupported.");
        }
*/

        setInterval(function() {
            self.checkTemperature();
        }, this.config.updateInterval);
    },

    checkTemperature: function() {
        const self = this;
	console.log("DHT readding sensor");

	// switch sensor type
	sensor.read(22, 24, function(err, temperature, humidity) {
	    if(!err) {
		console.log("DHT retrueved sensor values " + temperature + "°C / " + humidity + "%");
	    	self.sendSocketNotification('DHT_TEMPERATURE', temperature.toFixed(1));
		self.sendSocketNotification('DHT_HUMIDITY', humidity.toFixed(1));
	    }
	    else {
		console.log("DHT error while reading from sensor " + err);
	    }
	});
    }
});
