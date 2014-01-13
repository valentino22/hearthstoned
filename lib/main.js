var data = require("sdk/self").data;
// Construct a panel, loading its content from the "cards.html"
// file in the "data" directory, and loading the "get-cards.js" script
// into it.
var hearthStoned = require("sdk/panel").Panel({
  width: 250,
  height: 230,
  contentURL: data.url("cards.html"),
  // contentURL: "http://www.hsdeck.com/cards/",
  contentScriptFile: [data.url("jquery-1.10.2.min.js"),data.url("get-cards.js")]
});
// Create a widget, and attach the panel to it, so the panel is
// shown when the user clicks the widget.
require("sdk/widget").Widget({
  label: "HearthStoned",
  id: "hearth-stoned",
  contentURL: "http://us.battle.net/hearthstone/static/images/icons/favicon.ico",
  panel: hearthStoned
});

hearthStoned.port.once("hs-cards", function (text) {
  // console.log(text);
});

// When the panel is displayed it generated an event called
// "show": we will listen for that event and when it happens,
// send our own "show" event to the panel's script, so the
// script can prepare the panel for display.
hearthStoned.on("show", function() {
  hearthStoned.port.emit("show");
});
// Listen for messages called "text-entered" coming from
// the content script. The message payload is the text the user
// entered.
// In this implementation we'll just log the text to the console.
hearthStoned.port.on("text-entered", function (text) {
  console.log(text);
  hearthStoned.hide();
});