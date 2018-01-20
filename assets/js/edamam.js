
/* ................. Variables */
var totalSpaces, objectsNum, objectsSpace, minHeight;

/* ................. Functions */
function logoPosition() {
  var logo = $("#head").outerHTML();

  if (vPortW <= 1024) {
    if ($("#main #head").exists()) {
      $("#head").remove();
      $(".header-inner .group-1").prepend(logo);
    }
  }
  else {
    if ($(".header-inner #head").exists()) {
      $("#head").remove();
      $("#main").prepend(logo);
    }
  }
}

function elements() {
  minHeight = $("header").height() + $("#head").height() + $("#search-box").height() + $("#error-txt").height() + $("footer").height();		
  if (vPortW > 1024) {objectsNum = 8} else {objectsNum = 4}
  objectsSpace = objectsNum*25;
}

function setSpaces() {
  totalSpaces = vPortH - minHeight;
  
  if (vPortH > minHeight + objectsSpace) {$("#head, #search-box, #error-txt").css("margin-top", parseInt(totalSpaces / objectsNum));}
  else {$("#head, #search-box, #error-txt").css("margin-top", "40px");}
}

jQuery(document).ready(function() {
  
  $("body").css("min-height", minHeight + objectsSpace);
  
  logoPosition(); elements(); setSpaces();
  
  $(window).resize(function() {
    logoPosition(); elements(); setSpaces();
  });
  
});


/* ................. JSON */
function getJSON(url){
	var s = document.createElement('script');
	s.setAttribute('src',url);
	document.getElementsByTagName('head')[0].appendChild(s);
}

function shortenFunc(url) {
	var longURL   = url;
	var apiCall   = APIlocation
	            +"?"+ signature
	            +"&"+ format
	            +"&"+ action
	            +"&" + callbackLink
	            +"&url=" + encodeURIComponent( longURL );

	apiCall = apiCall.replace('#', '%23');
	getJSON(apiCall);
}

/* ...... JSON Infinite Scroll */ // ajic == Ajax JSON Infinite Content
function ajic_startup(data_type, api_url, api_params, ajic_callback, data_params, first_callback, second_callback) {
	$.ajax({
		type: 'GET',
		cache: false,
		url: api_url,
		data: api_params
	}).done(function(response) {
		if (response.hits.length > 0) {
			data_params.parent.append('<div class="temp none" />');
			data_params.build_html(response, data_params.call_index);
			data_params.list.append(data_params.parent.find(".temp").html());
			data_params.list.find(".itm").removeAttr("id");
			data_params.parent.find(".temp").remove();
			
			$(".nano").nanoScroller({flash: true, iOSNativeScrolling: true});
			
			data_params.scroller.bind("scroll", function() {
				data_params.scroller.unbind("scroll");
				
				data_params.call_index = data_params.call_index + 1;
				api_params.from = api_params.from + data_params.step;
				api_params.to = api_params.to + data_params.step;
				
				ajic_request(data_type, api_url, api_params, ajic_callback, data_params, second_callback);
			});
			
			if ( first_callback) { first_callback();}
			if (second_callback) {second_callback();}
		}
	});
}

function ajic_request(data_type, api_url, api_params, ajic_callback, data_params, second_callback) {
	$.ajax({
		type: 'GET',
		cache: false,
		url: api_url,
		data: api_params
	}).done(function(response) {
		ajic_callback(data_type, api_url, api_params, response, data_params, second_callback);
	});
}

function ajic_callback(data_type, api_url, api_params, response, data_params, second_callback) {
	if (response.hits.length > 0) {
		data_params.parent.append('<div class="temp none" />');
		data_params.build_html(response, data_params.call_index);
	}

	var scroll_timer = null;
	data_params.scroller.bind("scroll", function() {
	    if (scroll_timer != null) { return; }
	    scroll_timer = setTimeout(function() {
			if (data_params.scroller.scrollTop() + data_params.parent_h > data_params.list.height() - (data_params.parent_h * 1.5)) {
				data_params.scroller.unbind("scroll");

				data_params.list.append(data_params.parent.find(".temp").html());
				data_params.list.find(".itm").removeAttr("id");
				data_params.parent.find(".temp").remove();
				$(".nano").nanoScroller({iOSNativeScrolling: true});

				if (response.hits.length == data_params.step) {
					data_params.call_index = data_params.call_index + 1;
					api_params.from = api_params.from + data_params.step;
					api_params.to = api_params.to + data_params.step;
					ajic_request(data_type, api_url, api_params, ajic_callback, data_params, second_callback);
				}
				
				if (second_callback) {second_callback();}
			}

			scroll_timer = null;
	    }, 50);
	});
}

/* ........... Radio Selection */
// Обновяване стиловото оформление на радио бутоните
function radioSelection(obj) {
	function refreshSelection(obj) {
		obj.find(".selected").removeClass("selected");
		obj.find("input").each(function() {
			if ($(this).is(":checked")) {
				$(this).parent().addClass("selected");
			}
		});
	}

	if (!obj) {
		$(".radio-selection").each(function() {
			refreshSelection($(this));
		});
	}
	else {
		refreshSelection(obj);
	}
}


