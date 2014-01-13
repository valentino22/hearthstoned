var HS_CardData = [{"whid":922,"name":"Goldshire Footman","hpid":564},{"whid":602,"name":"Fen Creeper","hpid":476},{"whid":841,"name":"Holy Nova","hpid":671},{"whid":734,"name":"Mind Control Tech","hpid":368},{"whid":8,"name":"Mind Control","hpid":401},{"whid":376,"name":"Inner Fire","hpid":207},{"whid":279,"name":"Holy Smite","hpid":409},{"whid":479,"name":"Lesser Heal","hpid":126},{"whid":1099,"name":"Mind Vision","hpid":438},{"whid":613,"name":"Power Word: Shield","hpid":431},{"whid":692,"name":"Druid of the Claw","hpid":587},{"whid":1050,"name":"Claw","hpid":532},{"whid":773,"name":"Healing Touch","hpid":258},{"whid":467,"name":"Moonfire","hpid":619},{"whid":213,"name":"Mark of the Wild","hpid":480},{"whid":742,"name":"Savage Roar","hpid":329},{"whid":64,"name":"Swipe","hpid":620},{"whid":1124,"name":"Wild Growth","hpid":282}];

self.port.emit("hs-cards", HS_CardData);

var cardsWrapper = $("#cards-wrapper");

// Listen for the "show" event being sent from the
// main add-on code. It means that the panel's about
// to be shown.
//
// Set the focus to the text area so the user can
// just start typing.
self.port.on("show", function onShow() {
	$.ajax({
		url: 'http://www.hsdeck.com/cards/',
		type: 'GET',
		success: function(res) {
			var card-table = $(res.responseText).find('#table-card-list').text();
			cardsWrapper.html(card-table);
		}
	});
	// cardsWrapper.html(JSON.stringify(HS_CardData, null, 4));
});