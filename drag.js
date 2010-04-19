$(document).ready(function() {
	
	// pick an image, any image
	var image_number = Math.floor(Math.random() * 10);
	
	$('.viewport img')
		.attr('src', 'star_wars/' + image_number + '.jpeg');
	
	var navigation_mode;
	var panning_mode;
	
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
		navigation_mode();
		return false;
	};
	
	navigation_mode = function () {
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
					panning_mode();
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
	
	panning_mode = function () {
		$('.viewport')
			.dragscrollable()
			.bind('mouseup.drag', function () {
				navigation_mode();
				return false;
			});
		$('.viewport img')
			.removegesture()
			.unbind('.drag');
	};
	
	navigation_mode();
});