$.fn.makeRipple = function (options) {
	var settings = $.extend({
		effect : "ripple",
		scale : 6,
		speed : 300,					// ms
		transitionEnd : function(){}	// callback when transition ends.
	}, options);

	return this.each(function() {
		var $this = $(this);
		var classes = $this.attr('class');
		var scale = settings.scale;
		if (classes) $.each(classes.split(/\s+/), function(i, name){
			if (name.indexOf('rs') > -1) scale = parseFloat(name.match(/\d|\./g).join(""));
		});
		var supportEvent = ('ontouchstart' in window ) ? 'touchstart':'mousedown';
		$this.on(supportEvent, function(e) {		//bind touch/click event
			// e.preventDefault();
			$this.append('<div class="'+settings.effect+'"></div>');	
			// Fetch click position and size
			var posX = $this.offset().left,
				posY = $this.offset().top;
			var w = $this.width(),
				h = $this.height();
			var targetX= e.pageX - posX;
			var targetY= e.pageY - posY;
			
			//Fix target position
			if(!targetX || !targetY){
				targetX = e.originalEvent.touches[0].pageX - posX;
				targetY = e.originalEvent.touches[0].pageY - posY;
			}
			
			var ratio = scale / 2;				
					
			var $effectElem = $this.children().last();

			//Animate Start
			$("body").css("max-width", $("body").width());
			$("body").css("max-height", $("body").height());
			// $effectElem.css("max-width", $effectElem.width());
			// $effectElem.css("max-height", $effectElem.height());
			$effectElem.addClass(settings.effect+"-stop").css({
							"top" : targetY,
							"left" : targetX,
							"width" : h * scale,
							"height" : h * scale,
							"margin-left" : -h * ratio ,
							"margin-top" : -h * ratio ,
							"transition-duration" : settings.speed+"ms",
							"-webkit-transition-duration" : settings.speed+"ms",
							"-moz-transition-duration" : settings.speed+"ms",
							"-o-transition-duration" : settings.speed+"ms"
						});
			$effectElem.removeClass(settings.effect+"-stop");

			//Animate End
			setTimeout(function(){
				$effectElem.addClass(settings.effect+"-out").css({
					"transition-duration" : settings.speed+"ms",
					"-webkit-transition-duration" : settings.speed+"ms",
					"-moz-transition-duration" : settings.speed+"ms",
					"-o-transition-duration" : settings.speed+"ms"
				});
				setTimeout(function(){
					$this.find("."+settings.effect).first().remove();
					$("body").css("max-width", '');
					$("body").css("max-height", '');
					// $effectElem.css("max-width", '');
					// $effectElem.css("max-height", '');
					settings.transitionEnd.call(this);
				},settings.speed);
			}, settings.speed);
		});
	});
}

var nav = $(".navbar");
var content = $("#about");
var $root = $('html, body');

$(window).scroll(function(){
	determineNav();
});

function determineNav() {
	var navbottom = $("#homeNav").offset().top + $("#homeNav").outerHeight();
	var abouttop = $("#about").offset().top - parseFloat($("#about").css("margin-top")) - 60;
	if ($(window).scrollTop() >= abouttop){
		if (!nav.hasClass('slideDown')) nav.addClass('slideDown');
	}
	else if (nav.hasClass('slideDown')) {
		nav.removeClass('slideDown');
		if ($(window).scrollTop() >= navbottom) {
			nav.addClass('slideUp');
			nav.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',	 
				function(e) {
					nav.removeClass('slideUp');
				}
			);
		}
	}
}

$(window).resize(function(){
	var title = $("#title");
	while (title.height() - $(".square").height() > 5) {
		var currentFontSize = title.css("font-size");
		title.css("font-size", (parseFloat(currentFontSize) - 1) + "px");
	}
	while (title.height() - $(".square").height() < -5) {
		var currentFontSize = title.css("font-size");
		title.css("font-size", (parseFloat(currentFontSize) + 1) + "px");
	}
	$(".me").css("height", $(".info").height());
	$("[data-match-height]").each(function(){
		var parentRow = $(this),
			childrenCols = $(this).find("[data-height-watch]");
		childrenCols.css('min-height', '');
		var childHeights = childrenCols.map(function(){ return $(this).outerHeight(); }).get(),
			tallestChild = Math.max.apply(Math, childHeights);
		childrenCols.css('min-height', tallestChild);
	});
	$("[data-match-width]").each(function() {
		var parentRow = $(this),
			childrenCols = $(this).find("[data-width-watch]");
		childrenCols.css('min-width', '');
		var childWidths = childrenCols.map(function(){ return $(this).outerWidth(); }).get(),
			widestChild = Math.max.apply(Math, childWidths) + 120;
		childrenCols.css('min-width', widestChild);
	});
});

$('.aniscroll a').click(function(e) {
    var id = $(this).attr('href');
    if ($(id).length === 0) return;
    e.preventDefault();    
    $('body, html').animate({scrollTop: (id == "#home") ? 0 : ($(id).offset().top - 60)});
    collapsemenu();
});

function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
}

$(document).ready(function(){
	$('.button').makeRipple();
	$('#home').makeRipple();
	$('nav').makeRipple();
	$('#footer').makeRipple();
	// $("#home div").addClass("fadeIn");
	$(window).resize();
	determineNav();
	$(document).foundation();
});

function togglemenu(){
	$("#menucontent").toggleClass("collapsed");
}

document.onmousedown = window.onmousedown = function (e) {
    if(e.which == 2) {
        e = e || window.event;
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
    }
};

var time_stamp=0;// Or Date.now()
window.addEventListener("touchstart",function(event_){
	if (event_.timeStamp-time_stamp<300){// A tap that occurs less than 300 ms from the last tap will trigger a double tap. This delay may be different between browsers.
	    event_.preventDefault();
	    return false;// Not sure if you really need this anymore, but whatever.
	}
});

function submitForm() {
	$.ajax({type:'POST', url: 'submit.php', data:$('#contactForm').serialize(), success: function(response) {
	    $('#contactForm').find('.formResult').html(response);
	}});
}