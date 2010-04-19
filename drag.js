$(document).ready(function() {
	
	// pick an image, any image
	var image_number = Math.floor(Math.random() * 10);
	
	$('.viewport img')
		.attr('src', 'star_wars/' + image_number + '.jpeg');
	
	var gesture_mode;
	var dragscroll_mode;
	
	var bring_image_from = function (direction) {
		if (direction == 'left')
			image_number = ++image_number % 10;
		else
			image_number = (--image_number + 10) % 10;
		$('.viewport img')
			.detach()
			.clone()
				.attr('src', 'star_wars/' + image_number + '.jpeg')
				.hide()
				.prependTo($('.dragger'))
				.show("slide", { direction: direction }, 1000);
		gesture_mode();
		return false;
	};
	
	gesture_mode = function () {
		$('.viewport img')
			.gesture(['left', 'right', 'hold'])
			.bind({
				'gesture_right.drag': function () {
					return bring_image_from('left');
				},
				'gesture_left.drag': function () {
					return bring_image_from('right');
				},
				'gesture_hold.drag': function (event) {
					dragscroll_mode();
					$(this)
						.effect("shake", { times:3 }, 100, function () {
							$(this)
								.parent()
									.trigger(event.gesture_data.originalEvent);
						})
				}
			});
		$('.viewport')
			.removedragscrollable()
			.unbind('.drag');
	}
	
	dragscroll_mode = function () {
		$('.viewport')
			.dragscrollable({dragSelector: '.dragger:first'})
			.bind('mouseup.drag', function () {
				gesture_mode();
				return false;
			});
		$('.viewport img')
			.removegesture()
			.unbind('.drag');
	};
	
	gesture_mode();
});