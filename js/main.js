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
});

$('.aniscroll a').click(function(e) {
    var id = $(this).attr('href');
    if ($(id).length === 0) return;
    e.preventDefault();    
    $('body, html').animate({scrollTop: (id == "#home") ? 0 : ($(id).offset().top - 60)});
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
	$("#home div").addClass("fadeIn");
	$(window).resize();
	determineNav();
});

$("#menubutton").click(function(){
	$("#menucontent").toggleClass("collapsed");
});