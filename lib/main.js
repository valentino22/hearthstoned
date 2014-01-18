var data = require("sdk/self").data;
var db = require("sdk/simple-storage");

var hearthStoned = require("sdk/panel").Panel({
  width: 550,
  height: 500,
  contentURL: data.url("cards.html"),
  contentScriptFile: [data.url("js/jquery-1.10.2.js"),data.url("js/jquery.filtertable.js"),data.url("js/get-cards.js")]
});

require("sdk/widget").Widget({
  label: "HearthStoned",
  contentURL: data.url("images/favicon.ico"),
  id: "hearth-stoned",
  panel: hearthStoned
});

hearthStoned.on("show", function() {
	hearthStoned.port.emit("show");
});