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
		Log.log('[MMM-MyStandings] url: ' + url);
		request({ url: url, method: 'GET' }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				Log.log("[MMM-MyStandings] : data -> " + body);
				self.sendSocketNotification(notification, result);
			} else {
				Log.log("[MMM-MyStandings] : Could not load data -> " + error);
			}
		});
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		Log.log('[MMM-MyStandings] nh socketNotificationReceived: ' + notification);
		this.getData(notification, payload);
	}
});