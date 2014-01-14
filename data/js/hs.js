$(function(){
	var ajax = $.manageAjax.create({maxReq: 0, blockSameRequest: true});
	
	$("#dcf-cpp").keydown(function(event) {
		if (event.keyCode == 13) {
			var page_id = $('#deck-builder-paginate .current').text();
			 reload_deck_cards(page_id);
		}
        // Allow: backspace, delete, tab, escape, and enter
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
             // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) || 
             // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
                 // let it happen, don't do anything				 
                 return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault(); 
            }   
        }				
    });
	
	$("#dcf-cwf").keydown(function(event) {
		if (event.keyCode == 13) {
			var inp = $(this).val();
			var page_id = $('#deck-builder-paginate .current').text();
 			if(jQuery.trim(inp).length > 0) {
				$("#dcf-keywords").append('<span>'+  inp +'</span>');
				$(this).val("");		
				page_id = 1;
			}
			
			reload_deck_cards(page_id);
		}
    });
	
	$('#dcf-keywords').on("click", "span", function() {
		$(this).remove();
		var page_id = $('#deck-builder-paginate .current').text();
		reload_deck_cards(page_id);
	});
	
	$('#deck-creator').on("click", "#deck-builder-paginate a", function() {
		var page_id = $(this).attr("value");
		reload_deck_cards(page_id);
	});							
	
	$('#deck-creator-filter #dcf-o').change(function() {
		reload_deck_cards(1);
	});	
	$('#deck-creator-filter #dcf-rarity').change(function() {
		var newclass = $(this).find("option:selected").attr("class");
		$(this).attr("class","main-input "+newclass);
		reload_deck_cards(1);
	});	
	$('#deck-creator-filter #dcf-ctype').change(function() {
		reload_deck_cards(1);
	});	
	$('#deck-creator-filter #dcf-ddt').change(function() {
		reload_deck_cards(1);
	});		
	
	/*String.prototype.replaceAt=function(index, character) {
      return this.substr(0, index) + character + this.substr(index+character.length);
    }*/
	
	function replaceAt(stringValue, indexValue, characterValue) {
		return stringValue.substring(0, indexValue) + characterValue + stringValue.substring(indexValue + 1);
	}	
	
	function reload_deck_cards(page_id) {
		var endstamp = new Date();
		var difference = endstamp.getTime();		
		var player_class =  $('#deck-creator').attr("val");		
		var dcf = $('#deck-creator-filter');
		var cpp = dcf.find("#dcf-cpp").val();
		var o = dcf.find("#dcf-o option:selected").attr("value");
		//var r = dcf.find("#dcf-rarity option:selected").attr("value");
		//var ct = dcf.find("#dcf-ctype option:selected").attr("value");
		var ddt = dcf.find("#dcf-ddt option:selected").attr("value");
		
		
		var rarity = $('#dcf-rarity').val();
		var rarity_filter = "00000";
		
		$("#dcf-rarity option:selected").each(function() {
    		if ($(this).val() == "basic") {
				rarity_filter = replaceAt(rarity_filter,0,"1");
			}
			if ($(this).val() == "common") {
				rarity_filter = replaceAt(rarity_filter,1,"1");
			}
			if ($(this).val() == "rare") {
				rarity_filter = replaceAt(rarity_filter,2,"1");
			}
			if ($(this).val() == "epic") {
				rarity_filter = replaceAt(rarity_filter,3,"1");
			}
			if ($(this).val() == "legendary") {
				rarity_filter = replaceAt(rarity_filter,4,"1");
			}		
    	});
		if (rarity_filter == "00000") {
			rarity_filter = "11111";	
		}
		
		var card_type = $('#dcf-ctype').val();
		var ct_filter = "000";
		
		$("#dcf-ctype option:selected").each(function() {
    		if ($(this).val() == "equipment") {
				ct_filter = replaceAt(ct_filter,0,"1");
			}
			if ($(this).val() == "minion") {
				ct_filter = replaceAt(ct_filter,1,"1");
			}
			if ($(this).val() == "spell") {
				ct_filter = replaceAt(ct_filter,2,"1");
			}				
    	});
		if (ct_filter == "000") {
			ct_filter = "111";	
		}
		
		var keywords = "";
		$("#dcf-keywords span").each(function() {
    		keywords += $(this).text() + ":";
    	});
		
		ajax.add({
			success: function(html) {  		
				$('#deck-creator .card-list-wrapper').html(html);
				
				var new_card_id = 0;
				var selected_card_id = 0;
				//$('#deck-creator .card-list ul li').each(function( index ) {
				$('#deck-creator .card-list .deck-builder-card').each(function( index ) {					 
					var new_card = $(this);
					new_card_id = $(this).attr("val");					
					$('#deck-drop-zone ul li').each(function( sindex ) {
						var selected_card = $(this);
						selected_card_id = $(this).attr("val");
						if (new_card_id == selected_card_id) {
							var cc = parseInt(selected_card.attr("ccount"));
							var mcc = parseInt(new_card.attr("maxdeck"));
							var ncc = mcc - cc;
							if (ncc == 0) {
								new_card.css("opacity",0.1);
								new_card.attr("disabled","disabled");
							}
							new_card.attr("ccount",ncc);
							new_card.find(".card-count").text("x"+ncc);
						}
					});	
				});
			},
			url: "/ajax_main.php?req=deck_builder&player_class="+player_class+"&ct="+ct_filter+"&r="+rarity_filter+"&cpp="+cpp+"&ddt="+ddt+"&o="+o+"&kw="+encodeURI(keywords)+"&page="+page_id+"&stamp=" + difference
		});	
	}
	
	$('#dcf-rarity-clear').click(function() {
		$("#dcf-rarity option").removeProp('selected');
		var page_id = $('#deck-builder-paginate .current').text();
		reload_deck_cards(page_id);
	});
	$('#dcf-ctype-clear').click(function() {
		$("#dcf-ctype option").removeProp('selected');
		var page_id = $('#deck-builder-paginate .current').text();
		reload_deck_cards(page_id);
	});
	$('#dcf-cwf-clear').click(function() {
		$("#dcf-cwf").val("");
		$("#dcf-keywords").html("");
		var page_id = $('#deck-builder-paginate .current').text();
		reload_deck_cards(page_id);
	});
	
	$('#dcf-ddt').change(function() {
		var ddt = $(this).find("option:selected").attr("value");			
		$.cookie('dcf-ddt', ddt, { expires: 30, path: '/' });		
	});	
	
	$('#cbDeckLockToScreen').change(function() {
		var cb = $(this);
		var ddz = $('#deck-drop-zone');	
		var wdo = $('#dcf-wrapper-display-options');	
		if (cb.is(':checked')) {	
			ddz.css("top","0");		
			ddz.css("z-index","100");
			ddz.css("position","fixed");
			wdo.css("right","300px");	
			$.cookie('ddz-lock', '1', { expires: 30, path: '/' });
		} else {
			ddz.css("top","inherit");
			ddz.css("z-index","inherit");
			ddz.css("position","inherit");
			wdo.css("right","0");
			$.removeCookie('ddz-lock', { path: '/' });
		}
	});	
	
	$('#slCardListClass').change(function() {
		var newclass = $(this).find("option:selected").attr("class");
		$(this).attr("class","main-input "+newclass);
	});	
		
	
	$("#bCardListFilter").click(function() {
		var btn = $(this);
		btn.attr("disabled","disabled");
		var endstamp = new Date();
		var difference = endstamp.getTime();				
		var clf = $('#card-list-filter');	
		var cte = clf.find("#cbCardListTypeEquipment:checked" ).length;
		var cts = clf.find("#cbCardListTypeSpell:checked" ).length;
		var ctm = clf.find("#cbCardListTypeMinion:checked" ).length;
		
		var crb = clf.find("#cbCardListRarityBasic:checked" ).length;
		var crc = clf.find("#cbCardListRarityCommon:checked" ).length;
		var crr = clf.find("#cbCardListRarityRare:checked" ).length;
		var cre = clf.find("#cbCardListRarityEpic:checked" ).length;
		var crl = clf.find("#cbCardListRarityLegendary:checked" ).length;
		

		var cc = clf.find("#slCardListClass option:selected").attr("value");
		var ccn = clf.find("#cbCardListClassNeutral:checked" ).length;
		
		clf.find(".aloader").show();
		
		ajax.add({
			success: function(html) {
				btn.removeAttr("disabled");
				clf.find(".aloader").hide();
				$('#card-list').html(html);
				$("#table-card-list").tablesorter({        
					headers: { 
						7: { 
							sorter: false 
						} 
					} 
				}); 
			},
			url: "/ajax_main.php?req=card_list&class="+cc+"&neutral="+ccn+"&type="+cte+ctm+cts+"&r="+crb+crc+crr+cre+crl+"&stamp=" + difference
		});	
	});
	
	$('#txPuzzleCardSearch').keypress(function (e) {
		if(e.which == 13) {
			$("#bPuzzleCardSearch").click();
		}
	});		
	
	$('#card-list-filter input[type=checkbox]').change(function() {
        if($(this).is(":checked")) {
           $(this).next("label").removeClass("faded-text");
        } else {
			$(this).next("label").addClass("faded-text");
		}
    });
	
	$("#clf-type legend").click(function() {
		var l = $(this);
		if (l.attr("data-selected") == "1") {
			$("#clf-type input").each(function(index, element) {
                $(this).prop('checked', false);
				$(this).next("label").addClass("faded-text");
            });
			l.attr("data-selected", "0");
		} else {
			$("#clf-type input").each(function(index, element) {
                $(this).prop('checked', true);
				$(this).next("label").removeClass("faded-text");
            });
			l.attr("data-selected", "1");
		}
	});
	
	$("#clf-rarity legend").click(function() {
		var l = $(this);
		if (l.attr("data-selected") == "1") {
			$("#clf-rarity input").each(function(index, element) {
                $(this).prop('checked', false);
				$(this).next("label").addClass("faded-text");
            });
			l.attr("data-selected", "0");
		} else {
			$("#clf-rarity input").each(function(index, element) {
                $(this).prop('checked', true);
				$(this).next("label").removeClass("faded-text");
            });
			l.attr("data-selected", "1");
		}
	});
	
	$( "#deck-drop-zone" ).draggable();		
});