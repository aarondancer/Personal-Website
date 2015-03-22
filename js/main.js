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
			e.preventDefault();
			$this.append('<div class="'+settings.effect+'"></div>');	
			// Fetch click position and size
			var posX = $this.offset().left,
				posY = $this.offset().top;
			var w = $this.width(),
				h = $this.height();
			var targetX= e.pageX;
			var targetY= e.pageY;
			if (!$this.is('section')) {
				targetX -= posX;
				targetY -= posY;
			}
			// alert(targetY);
			
			//Fix target position
			if(!targetX || !targetY){
				targetX = e.originalEvent.touches[0].pageX - posX;
				targetY = e.originalEvent.touches[0].pageY - posY;
			}
			
			var ratio = scale / 2;    		
					
			var $effectElem = $this.children(':last');

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
	if ($(window).scrollTop() >= $("#home").height()) {
		nav.addClass('sticky');
		content.addClass('stickyPadding');
	} else {
		nav.removeClass('sticky');
		content.removeClass('stickyPadding');
	}
});

$('.navbar a').click(function() {
	var t = $(this);
	var href = $.attr(this, 'href');
	if (!t.hasClass("animating")){
		t.addClass("animating");
		$root.animate({
			scrollTop: (href == "#home") ? 0 : $(href).offset().top
		}, 500, function () {
			window.location.hash = href;
			t.removeClass("animating");
		});
	}
	return false;
});

$('.button').makeRipple();
$('#home').makeRipple();
$('nav').makeRipple();
$('#footer').makeRipple();