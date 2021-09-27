import lsSet from "../helpersTools/lsSet";
function newsUpdate() {
	var message = {};
	message.html = "" +
		"<p>Hey there, buddy!</p>" +
		"<p>You can now block parts of a site. For instance, putting <b>facebook.com/groups</b> on your blacklist will warn on every facebook group, but will leave the rest of the site just fine.</p> " +
		"<p>You can also whitelist bigger chunks of a site. For instance, putting <b>facebook.com/groups/772212156222588/</b> on your whitelist will make you safe on the Official Pavlok's Group.</p> " +
		"<p>Also note that <b>black and whitelists now use the same way of typing addresses! If you need to make any adjustments, we will tell you</b>!</p>" +
		"<p>Best, </p>" +
		"<p>Pavlok Team</p>";

	message.title = "Black and White lists got a level-up!"
	message.buttons = { "Ok, don't tell me again": true, "Remind me again": false };
	message.submit = function (e, v, m, f) {
		var result = v;
		if (result == true) {
			lsSet('dontRepeatUpdate', 'true');
			validateList(lsGet('whiteList'));
		}
		else {
			validateList(lsGet('whiteList'));
		}
	}
	$.prompt(message);
}

export default newsUpdate;