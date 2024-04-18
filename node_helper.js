/* MagicMirror²
 * Module: Standings
 *
 */
const NodeHelper = require("node_helper");
const moment = require("moment");
const axios = require("axios");
const Log = require('../../js/logger.js');

module.exports = NodeHelper.create({

	start: function () {
		Log.log("Starting node_helper for module [" + this.name + "]");
	},

	callUrl: function (notification, payload, callback) {
		//var self = this;
		//Log.log('['+ this.name + '] ' + payload.instanceId + ' - callUrl -->  ' + notification);
		Log.log('[MMM-MyStandings] ' + payload.instanceId + ' - callUrl -->  ' + notification);
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

		axios.get(payload.url)
		.then( function(response) {
				//Log.log('['+ this.name + '] ' + payload.instanceId + ' - get request succeeded, sending -> ' + newNotification);
				Log.log('[MMM-MyStandings] ' + payload.instanceId + ' - get request succeeded');
				//self.sendSocketNotification(newNotification, {instanceId: payload.instanceId, data: response.data});
				callback({notification: newNotification, data: response.data});
		})
		.catch( function(r_err) {
			console.log( '[MMM-MyStandings] ' + payload.instanceId + " -  ** ERROR ** - " + r_err );
			console.log( "[MMM-MyScoreboard] " + payload.url );  
			//self.sendSocketNotification(newNotification, {instanceId: payload.instanceId, data: null});
			callback({notification: newNotification, data: null});   
		});

		},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification.startsWith("MMM-MYSTANDINGS-UPDATE")){
			var self = this;
			Log.log('['+ this.name + '] ' + payload.instanceId + ' - nh socketNotificationReceived: ' + notification);
			this.callUrl(notification, {instanceId: payload.instanceId, url: payload.url},	function(response) {
				self.sendSocketNotification(response.notification, {instanceId: payload.instanceId, data: response.data});
			  });
		}
	}
});