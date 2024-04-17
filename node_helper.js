/* MagicMirror²
 * Module: Standings
 *
 */
const NodeHelper = require("node_helper");
//const request = require('request');
const axios = require("axios");
const Log = require('../../js/logger.js');

module.exports = NodeHelper.create({

	start: function () {
		Log.log("Starting node_helper for module [" + this.name + "]");
	},

	callUrl: function (notification, payload) {
		var self = this;
		Log.log('['+ this.name + '] ' + payload.instanceId + ' - callUrl -->  ' + notification);
		var newNotification = "STANDINGS_RESULT:" + notification.split(":")[1];
		
		//request({ url: payload.url, method: 'GET' }, function (error, response, body) {
		//	if (!error && response.statusCode == 200) {
		//		var result = JSON.parse(body);
				
		//		Log.log('['+ this.name + '] ' + payload.instanceId + ' - callUrl request succeeded, sending -> ' + newNotification);
		//		self.sendSocketNotification(newNotification, {instanceId: payload.instanceId, data: result});
		//	} else {
		//		Log.error('['+ this.name + '] ' + payload.instanceId + ' - could not load data, sending -> ' + newNotification + ', error: ' + error);
		//		self.sendSocketNotification(newNotification, {instanceId: payload.instanceId, data: null});
		//	}
		//});

		axios.get(url)
		.then( function(response) {
				Log.log('['+ this.name + '] ' + payload.instanceId + ' - get request succeeded, sending -> ' + newNotification);
				self.sendSocketNotification(newNotification, {instanceId: payload.instanceId, data: response.data});
		})
		.catch( function(r_err) {
			console.log( '['+ this.name + '] ' + payload.instanceId + " - " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** - " + r_err );
			console.log( "[MMM-MyScoreboard] " + url );  
			self.sendSocketNotification(newNotification, {instanceId: payload.instanceId, data: null});      
		});

		},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification.startsWith("MMM-MYSTANDINGS-UPDATE")){
			Log.log('['+ this.name + '] ' + payload.instanceId + ' - nh socketNotificationReceived: ' + notification);
			this.callUrl(notification, {instanceId: payload.instanceId, url: payload.url});
		}
	}
});