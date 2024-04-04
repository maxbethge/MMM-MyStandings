/* MagicMirror²
 * Module: Standings
 *
 */
const NodeHelper = require("node_helper");
const request = require('request');
const Log = require('../../js/logger.js')

module.exports = NodeHelper.create({

	start: function () {
		Log.log("Starting node_helper for module [" + this.name + "]");
	},

	getData: function (notification, payload) {
		var self = this;
		Log.log('[MMM-MyStandings] ' + payload.instanceId + ' - getData -->  ' + notification);
		request({ url: payload.url, method: 'GET' }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				var newNotification = "STANDINGS_RESULT:" + notification.split(":")[1];
				Log.log('[MMM-MyStandings] ' + payload.instanceId + ' - getData url request succeeded, sending -> ' + newNotification);
				self.sendSocketNotification(newNotification, {instanceId: payload.instanceId, data: result});
			} else {
				Log.error('[MMM-MyStandings] ' + payload.instanceId + ' - Could not load data, sending -> ' + newNotification + ', error: ' + error);
				self.sendSocketNotification(newNotification, {instanceId: payload.instanceId, data: null});
			}
		});
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification.startsWith("MMM-MYSTANDINGS-UPDATE")){
			Log.log('[MMM-MyStandings] ' + payload.instanceId + ' - nh socketNotificationReceived: ' + notification);
			this.getData(notification, {instanceId: payload.instanceId, url: payload.url});
		}
	}
});