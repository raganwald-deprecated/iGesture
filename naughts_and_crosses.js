$(document).ready(function () {
	// pretty pictures of naughts and crosses
  var images = {
    crosses: [
      { href: 'http://www.flickr.com/photos/21450297@N06/3704425796', 
        src: 'http://static.flickr.com/2582/3704425796_946ef43a78_t.jpg' },
      { href: 'http://www.flickr.com/photos/92745470@N00/4314534040', 
        src: 'http://static.flickr.com/4020/4314534040_817702fc30_t.jpg' }, 
      { href: 'http://www.flickr.com/photos/38782010@N00/2875992647', 
        src: 'http://static.flickr.com/3213/2875992647_26a0c2d248_t.jpg' },
      { href: 'http://www.flickr.com/photos/38782010@N00/4041988011', 
        src: 'http://static.flickr.com/2451/4041988011_0357a85107_t.jpg' },
      { href: 'http://www.flickr.com/photos/63943575@N00/3368759877', 
        src: 'http://static.flickr.com/3657/3368759877_5b0e1867e0_t.jpg' },
      { href: 'http://www.flickr.com/photos/7460644@N08/3530516768', 
        src: 'http://static.flickr.com/3631/3530516768_a0a55beec3_t.jpg' },
      { href: 'http://www.flickr.com/photos/63943575@N00/3368759877', 
        src: 'http://static.flickr.com/3657/3368759877_5b0e1867e0_t.jpg' },
      { href: 'http://www.flickr.com/photos/26762616@N02/3551105932', 
        src: 'http://static.flickr.com/3331/3551105932_f001950429_t.jpg' },
      { href: 'http://www.flickr.com/photos/38782010@N00/3126080585', 
        src: 'http://static.flickr.com/3112/3126080585_33ba9f9341_t.jpg' },
      { href: 'http://www.flickr.com/photos/74838778@N00/4373107191', 
        src: 'http://static.flickr.com/4047/4373107191_bc8bce3822_t.jpg' }
      ],
    naughts: [
      { href: 'http://www.flickr.com/photos/49968232@N00/4046514052', 
        src: 'http://static.flickr.com/2545/4046514052_6535474602_t.jpg' },
      { href: 'http://www.flickr.com/photos/74838778@N00/4373107191', 
        src: 'http://static.flickr.com/4047/4373107191_bc8bce3822_t.jpg' },
      { href: 'http://www.flickr.com/photos/49968232@N00/4417616914', 
        src: 'http://static.flickr.com/4029/4417616914_5030916a55_t.jpg' },
      { href: 'http://www.flickr.com/photos/92745470@N00/4330625006', 
        src: 'http://static.flickr.com/4011/4330625006_80a21660aa_t.jpg' },
      { href: 'http://www.flickr.com/photos/18203311@N08/4331098233', 
        src: 'http://static.flickr.com/4004/4331098233_2599be21a1_t.jpg' },
      { href: 'http://www.flickr.com/photos/18203311@N08/4331098233', 
        src: 'http://static.flickr.com/4004/4331098233_2599be21a1_t.jpg' },
      { href: 'http://www.flickr.com/photos/92686475@N00/4263232073', 
        src: 'http://static.flickr.com/4015/4263232073_0764693148_t.jpg' },
      { href: 'http://www.flickr.com/photos/92686475@N00/4263232073', 
        src: 'http://static.flickr.com/4015/4263232073_0764693148_t.jpg' },
      { href: 'http://www.flickr.com/photos/74838778@N00/4373866218', 
        src: 'http://static.flickr.com/2700/4373866218_3f269e741a_t.jpg' },
      { href: 'http://www.flickr.com/photos/49968232@N00/4318188483', 
        src: 'http://static.flickr.com/4052/4318188483_efc3f3f25d_t.jpg' },
      { href: 'http://www.flickr.com/photos/92686475@N00/4285269162', 
        src: 'http://static.flickr.com/2739/4285269162_13d062b8c8_t.jpg' }
      ]
  };
	// tell iGesture that we want to generate close and circle gestures
  $('body').gesture(['close', 'circleclockwise', 'circlecounterclockwise']);
	
	// here's our function  that generates a naught or a cross
	var draw = function(event, what) {
		$(event.target).filter(':empty').each(function(index, element) {
			var arr = (what == 'naught') ? images.naughts : images.crosses;
			var links = arr[Math.floor(Math.random() * arr.length)];
			$('<a></a>')
				.attr('href', links.href)
				.prepend(
					$('<img/>')
						.attr('src', links.src)
						.attr('alt', what)
				)
				.prependTo($(element));
		});
	};
	
	// here are our bindings, they look just like any other event in jQuery
	$('.square')
		.bind('gesture_circleclockwise', function(event) {
			draw(event, 'naught')
		})
		.bind('gesture_circlecounterclockwise', function(event) {
			draw(event, 'naught')
		})
		.bind('gesture_close', function(event) {
			draw(event, 'cross')
		})
});