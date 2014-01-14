var data = require("sdk/self").data;

var hearthStoned = require("sdk/panel").Panel({
  width: 550,
  height: 500,
  contentURL: data.url("cards.html"),
  // contentURL: "http://www.hsdeck.com/cards/",
  contentScriptFile: [data.url("jquery-1.10.2.min.js"),data.url("jquery.filtertable.min.js"),data.url("get-cards.js")]
});

require("sdk/widget").Widget({
  label: "HearthStoned",
  contentURL: data.url("favicon.ico"),
  id: "hearth-stoned",
  panel: hearthStoned
});

hearthStoned.port.once("hs-cards", function (text) {
   // console.log(text);
});

hearthStoned.on("show", function() {
	hearthStoned.port.emit("show");
});