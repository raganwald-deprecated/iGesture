$(document).ready(function() {
	
	// pick an image, any image
	var image_number = Math.floor(Math.random() * 10);
	
	$('.viewport img')
		.attr('src', 'star_wars/' + image_number + '.jpeg');
	
	var navigation_mode;
	var panning_mode;
	
	var bring_image_from = function (show_direction) {
		var hide_direction;
		if (show_direction == 'left') {
			image_number = (--image_number + 10) % 10;
			hide_direction = 'right';
		} else {
			image_number = ++image_number % 10;
			show_direction = 'right';
			hide_direction = 'left';
		}
		$('.viewport img')
			.hide("slide", { direction: hide_direction }, 1000, function () {
				$('<img/>')
					.attr('src', 'star_wars/' + image_number + '.jpeg')
					.hide()
					.prependTo($('.dragger'))
					.show("slide", { direction: show_direction }, 1000);
			});
		return false;
	};
	
	navigation_mode = function () {
		$('.viewport .dragger')
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
		$('.viewport .dragger')
			.removegesture()
			.unbind('.drag');
	};
	
	navigation_mode();
});