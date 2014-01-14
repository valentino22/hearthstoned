// Listen for the "show" event being sent from the main add-on code. It means that the panel's about to be shown.
self.port.on("show", function onShow() {
	var cardList = $("#table-card-list");
	$("html body").html(cardList);
	$('td:nth-child(2),th:nth-child(2)').hide();
	$('td:nth-child(4),th:nth-child(4)').hide();
	$('td:nth-child(5),th:nth-child(5)').hide();
	$('td:nth-child(9),th:nth-child(9)').hide();
	$('#table-card-list').filterTable();
	$(".filter-table input").focus();
});