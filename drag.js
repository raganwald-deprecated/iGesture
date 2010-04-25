$(document).ready(function() {
	
	var img_src = function (num) {
		return 'star_wars/' + num + '.jpeg';
	};
	
	//preflight
	for(var n = 0; n < 10; ++n) {
		var img = new Image();
		img.src = img_src(n);
	}
	
	// pick an image, any image
	var image_number = Math.floor(Math.random() * 10);
	
	var navigation_mode;
	var panning_mode;
	var viewport_element = $('.viewport');
	var dragger_element = $('.viewport .dragger')
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
					.effect("shake", { times:3 }, 100)
					.trigger(event.gesture_data.originalEvent);
			}
		});
	var image_element = $('.viewport .dragger img')
		.attr('src', img_src(image_number));
	
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
		image_element
			.hide("slide", { direction: hide_direction }, 1000, function () {
				$('<img/>')
					.attr('src', img_src(image_number))
					.hide()
					.prependTo($('.dragger'))
					.show("slide", { direction: show_direction }, 1000);
			})
			.remove();
		return false;
	};
	
	navigation_mode = function () {
		dragger_element
			.gesture(['left', 'right', 'hold']);
		viewport_element
			.removedragscrollable()
			.unbind('.drag');
	}
	
	panning_mode = function () {
		viewport_element
			.dragscrollable()
			.bind('mouseup.drag', function () {
				navigation_mode();
				return false;
			});
		dragger_element
			.removegesture();
	};
	
	navigation_mode();
});