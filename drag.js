$(document).ready(function() {
	// pick an image, any image
	var image_number = Math.floor(Math.random() * 10);
	
	$('.viewport img')
		.attr('src', 'star_wars/' + image_number + '.jpeg');
	
	var gesture_mode;
	var dragscroll_mode;
	
	gesture_mode = function () {
		$('.viewport img')
			.gesture(['left', 'right', 'hold'])
			.bind({
				'gesture_right.drag': function () {
					image_number = ++image_number % 10;
					$(this)
						.attr('src', 'star_wars/' + image_number + '.jpeg');
					return false;
				},
				'gesture_left.drag': function () {
					image_number = (--image_number + 10) % 10;
					$(this)
						.attr('src', 'star_wars/' + image_number + '.jpeg');
					return false;
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