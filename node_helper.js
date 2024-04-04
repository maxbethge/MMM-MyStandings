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

	getData: function (notification, url) {
		var self = this;
		Log.log('[MMM-MyStandings] notification: ' + notification + ', instanceId: ' + this.instanceId + ', identifier: ' + this.identifier + ', url: ' + url);
		request({ url: url, method: 'GET' }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				Log.log("[MMM-MyStandings] : request succeeded, sending -> " + notification + ', identifier: ' + this.identifier);
				self.sendSocketNotification(notification, {instanceId: this.identifier, result: result});
			} else {
				Log.log("[MMM-MyStandings] : Could not load data -> " + error);
			}
		});
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		Log.log('[MMM-MyStandings] nh socketNotificationReceived: ' + notification + ', instanceId: ' + payload.instanceId);
		this.getData(notification, payload.url);
	}
});