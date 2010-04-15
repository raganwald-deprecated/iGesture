$(document).ready(function() {
    // pretty pictures of naughts and crosses
    var images = {
        crosses: [
        {
            href: 'http://www.flickr.com/photos/21450297@N06/3704425796',
            src: 'http://static.flickr.com/2582/3704425796_946ef43a78_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/92745470@N00/4314534040',
            src: 'http://static.flickr.com/4020/4314534040_817702fc30_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/38782010@N00/2875992647',
            src: 'http://static.flickr.com/3213/2875992647_26a0c2d248_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/38782010@N00/4041988011',
            src: 'http://static.flickr.com/2451/4041988011_0357a85107_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/63943575@N00/3368759877',
            src: 'http://static.flickr.com/3657/3368759877_5b0e1867e0_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/7460644@N08/3530516768',
            src: 'http://static.flickr.com/3631/3530516768_a0a55beec3_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/63943575@N00/3368759877',
            src: 'http://static.flickr.com/3657/3368759877_5b0e1867e0_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/26762616@N02/3551105932',
            src: 'http://static.flickr.com/3331/3551105932_f001950429_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/38782010@N00/3126080585',
            src: 'http://static.flickr.com/3112/3126080585_33ba9f9341_t.jpg'
        }
        ],
        naughts: [
        {
            href: 'http://www.flickr.com/photos/49968232@N00/4046514052',
            src: 'http://static.flickr.com/2545/4046514052_6535474602_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/74838778@N00/4373107191',
            src: 'http://static.flickr.com/4047/4373107191_bc8bce3822_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/49968232@N00/4417616914',
            src: 'http://static.flickr.com/4029/4417616914_5030916a55_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/92745470@N00/4330625006',
            src: 'http://static.flickr.com/4011/4330625006_80a21660aa_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/18203311@N08/4331098233',
            src: 'http://static.flickr.com/4004/4331098233_2599be21a1_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/18203311@N08/4331098233',
            src: 'http://static.flickr.com/4004/4331098233_2599be21a1_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/92686475@N00/4263232073',
            src: 'http://static.flickr.com/4015/4263232073_0764693148_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/92686475@N00/4263232073',
            src: 'http://static.flickr.com/4015/4263232073_0764693148_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/74838778@N00/4373866218',
            src: 'http://static.flickr.com/2700/4373866218_3f269e741a_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/49968232@N00/4318188483',
            src: 'http://static.flickr.com/4052/4318188483_efc3f3f25d_t.jpg'
        },
        {
            href: 'http://www.flickr.com/photos/92686475@N00/4285269162',
            src: 'http://static.flickr.com/2739/4285269162_13d062b8c8_t.jpg'
        }
        ]
    };

    // here's our function that generates a naught or a cross
    var draw = function(what, where) {
        $(where)
	        .filter(':empty')
		        .each(function(index, element) {
		            var arr = (what == 'naught') ? images.naughts: images.crosses;
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

    var rotate = function(degrees) {
        var turns = (8 + Math.round(degrees / 45.0)) % 8;
        if (turns == 0) return;
        var squares = {
            top: {
                left: $('.row.top .square.left > *')
                .detach(),
                centre: $('.row.top .square.centre > *')
                .detach(),
                right: $('.row.top .square.right > *')
                .detach()
            },
            middle: {
                left: $('.row.middle .square.left > *')
                .detach(),
                centre: $('.row.middle .square.centre > *')
                .detach(),
                right: $('.row.middle .square.right > *')
                .detach()
            },
            bottom: {
                left: $('.row.bottom .square.left > *')
                .detach(),
                centre: $('.row.bottom .square.centre > *')
                .detach(),
                right: $('.row.bottom .square.right > *')
                .detach()
            }
        };
        for (times = 1; times <= turns; times++) {
            squares = {
                top: {
                    left: squares.middle.left,
                    centre: squares.top.left,
                    right: squares.top.centre
                },
                middle: {
                    left: squares.bottom.left,
                    centre: squares.middle.centre,
                    right: squares.top.right
                },
                bottom: {
                    left: squares.bottom.centre,
                    centre: squares.bottom.right,
                    right: squares.middle.right
                }
            };
        }
        $('.row.top .square.left')
        	.append(squares.top.left);
        $('.row.top .square.centre')
        	.append(squares.top.centre);
        $('.row.top .square.right')
        	.append(squares.top.right);
        $('.row.middle .square.left')
        	.append(squares.middle.left);
        $('.row.middle .square.centre')
        	.append(squares.middle.centre);
        $('.row.middle .square.right')
        	.append(squares.middle.right);
        $('.row.bottom .square.left')
        	.append(squares.bottom.left);
        $('.row.bottom .square.centre')
        	.append(squares.bottom.centre);
        $('.row.bottom .square.right')
        	.append(squares.bottom.right);
    };

    $('body')
	    .gesture(['close', 'circleclockwise', 'circlecounterclockwise', 'rotate',
			{ scrub: '.square:not(:empty)' },
			{ about: /^(2.*)?4.*6.*8.*6$/  }
		]);

    $('.board')
	    .bind('gesture_rotate', function (event) {
	        rotate(event.rotation);
	    })
	    .bind('gesture_about', function (event) {
	        alert('Naughts and Crosses was written by Reg Braithwaite.');
	    });

    $('.square')
	    .bind('gesture_circleclockwise', function (event) {
	        draw('naught', this)
	    })
	    .bind('gesture_circlecounterclockwise', function (event) {
	        draw('naught', this)
	    })
	    .bind('gesture_close', function (event) {
	        draw('cross', this)
	    })
	    .bind('gesture_scrub', function (event) {
	        $(this).empty();
	    });

});