/* global Module */
/* Magic Mirror
 * Module: MMM-DHT-Sensor
 * MIT Licensed.
 */
Module.register('MMM-DHT-Sensor', {

    defaults: {
        sensorPIN: 4,
        sensorType: 11, // 11 OR 22
        updateInterval: 5000, // in milliseconds
        animationSpeed: 0, // in milliseconds
        units: config.units,
	logfile: '/home/pi/dht-sensor.csv'
    },

    start: function() {
        this.humidity = this.temperature = '...';
        this.sendSocketNotification('CONFIG', this.config);
	this.loaded = true;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'DHT_TEMPERATURE') {
            this.temperature = payload;
            this.updateDom(this.config.animationSpeed);
        }
        if (notification === 'DHT_HUMIDITY') {
            this.humidity = payload;
            this.updateDom(this.config.animationSpeed);
        }
    },

    getStyles: function() {
        return ['MMM-DHT-Sensor.css', 'font-awesome.css'];
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        wrapper.appendChild(this.getValueElem(true, this.temperature));
        wrapper.appendChild(this.getValueElem(false, this.humidity));

        return wrapper;
    },

    getValueElem: function(showTemp, value) {
        var icon = document.createElement("i");
        icon.className = 'fa fa-' + (showTemp ? 'sun-o' : 'tint') + ' dht-icon';

        var metric = this.config.units === 'metric';
        var val = showTemp ? (metric ? value : (value * 9 / 5 + 32.0)) : value;
        var sufix = showTemp ? (metric ? "°C" : "°F") : " %";

        var text = document.createTextNode(" " + val + sufix);
        text.className = 'dht-text';

        var div = document.createElement("div");
        div.appendChild(icon);
        div.appendChild(text);
        div.className = "dht";

        return div;
    }
});
