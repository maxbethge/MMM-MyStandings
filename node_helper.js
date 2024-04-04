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
		Log.log('[MMM-MyStandings] getData -->  ' + notification + ', instanceId: ' + payload.instanceId);
		request({ url: payload.url, method: 'GET' }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				var newNotification = "STANDINGS_RESULT:" + notification.split(":")[1];
				Log.log("[MMM-MyStandings] getData url request succeeded, sending -> " + newNotification + ', instanceId: ' + payload.instanceId);
				self.sendSocketNotification(newNotification, {instanceId: payload.instanceId, data: result});
			} else {
				Log.log("[MMM-MyStandings] : Could not load data -> " + error);
			}
		});
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification.startsWith("MMM-MYSTANDINGS-UPDATE")){
			Log.log('[MMM-MyStandings] nh socketNotificationReceived: ' + notification + ', instanceId: ' + payload.instanceId);
			this.getData(notification, {instanceId: payload.instanceId, url: payload.url});		
		}
	}
});