/* MagicMirror²
 * Module: Standings
 *
 */
const NodeHelper = require("node_helper");
const request = require('request');
const Log = require('../../js/logger.js');

module.exports = NodeHelper.create({

	start: function () {
		Log.log("Starting node_helper for module [" + this.name + "]");
	},

	callUrl: function (notification, payload) {
		var self = this;
		Log.log('['+ this.name + '] ' + payload.instanceId + ' - callUrl -->  ' + notification);
		var newNotification = "N/A";
		request({ url: payload.url, method: 'GET' }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				newNotification = "STANDINGS_RESULT:" + notification.split(":")[1];
				Log.log('['+ this.name + '] ' + payload.instanceId + ' - callUrl request succeeded, sending -> ' + newNotification);
				self.sendSocketNotification(newNotification, {instanceId: payload.instanceId, data: result});
			} else {
				Log.error('['+ this.name + '] ' + payload.instanceId + ' - could not load data, sending -> ' + newNotification + ', error: ' + error);
				self.sendSocketNotification(newNotification, {instanceId: payload.instanceId, data: null});
			}
		});
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification.startsWith("MMM-MYSTANDINGS-UPDATE")){
			Log.log('['+ this.name + '] ' + payload.instanceId + ' - nh socketNotificationReceived: ' + notification);
			this.callUrl(notification, {instanceId: payload.instanceId, url: payload.url});
		}
		else {
			Log.log('['+ this.name + '] ' + payload.instanceId + ' - nh socketNotificationReceived: ' + notification + ' - no processing done');
		}
	}
});