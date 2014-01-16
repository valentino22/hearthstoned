self.port.on("show", function onShow() {	
	$('#hsdeck-content table').filterTable();
	$(".filter-table input").focus();
});