iGesture
===

A fork of the [jGesture](http://web.siruna.com/nico/jgesture/documentation.html "jGesture Plugin for JQuery") plugin for Mobile Safari. With iGesture, your Mobile Safari applications can respond to *gestures*, shapes the user draws with their finger. You can respond to swiping up, down, left or right or at a 45 degree angle, you can support circles drawn clockwise or counterclockwise, and you can respond to more complex gestures such as a square or "X." Gestures can be drawn on the entire screen or you can support gestures drawn on specific elements of the page.

**naughts and crosses**

The [naughts and crosses](naughts_and_crosses.html) demonstration page is a ridiculously simple game of naughts and crosses intended for "pass and play." To try it, download [naughts\_and\_crosses.html](naughts\_and\_crosses.html), [naughts\_and\_crosses.js](naughts\_and\_crosses.js), and of course [igesture.jquery.mobile\_safari.js](igesture.jquery.mobile\_safari.js). Put them in the same directory and use Safari to open naughts\_and\_crosses.html.

You should see a blank board:

![Blank][blank]

Drawn an "X" or an "O" on any square. You can use your finger on an iPad or iPhone, a pen on a pen-enabled device, or mouse down and draw on a more conventional computer. Note: *Do not draw on this documentation, draw on your copy of naughts\_and\_crosses.html!*. All gestures must be drawn in one continuous set of strokes, so when drawing an X, do not lift your finger. So to draw an X you will need to use three strokes: One slash of the X, a connector stroke, and the other slash of the X. One way to draw an X is to stroke from top-left to bottom-right, from bottom-right to bottom-left, and from bottom-left to top-right. Strokes are named after their direction, so for development purposes we call these three strokes "bottom-right," "left," and "top-right."

You can draw an "O" by drawing a circle. You may need to practice a bit to get it right. Play around for a bit, you may end up with something like this:

![In Play][in_play]

Now try a "scrub" gesture: Place your finger on the left side of the screen, stroke to the right, back to the left, and back to the right. (You can also reverse the scrub's direction if you prefer, it's the same gesture). All the Xs and Os you've drawn will disappear. 

If you'd like to become the next great iPad millionaire, you can finish this application up. Add logic for recognizing when a game is won, undoing a move, playing over the internet, and using location services to find nearby players. Good luck!

**naughts and crosses with gesture events**

The naughts and crosses demonstration shows how to use one of iGesture's features, handling gestures using jQuery's custom events. Have a look at [naughts\_and\_crosses.js](naughts\_and\_crosses.js):

    $('body')
  		// generate close and rotate gestures
      .gesture(['close', 'rotateclockwise', 'rotatecounterclockwise'])
    
This tells the body of the page that we want three gestures to be treated as custom events: `close`, `rotateclockwise`, and `rotatecounterclockwise`. You nearly always want to execute this on the body. iGesture allows you to handle nearly any arbitrary sequence of strokes as a gesture, but the most common ones have names and you can easily handle them as custom events. The "X" gesture is known as "close" because it is commonly used to dismiss a dialog or close a window. The two "rotate" gestures are often used for rotating things. We're handling both so that it doesn't matter which way you draw a circle. It's often important to be liberal in the way you handle similar strokes: Different people draw common shapes in different ways.

Speaking of handling custom gesture events, here's the jQuery-powered code that does that:

    $('.square')
    	.bind('gesture_rotateclockwise', function(event) {
    		draw(event, 'naught')
    	})
    	.bind('gesture_rotatecounterclockwise', function(event) {
    		draw(event, 'naught')
    	})
    	.bind('gesture_close', function(event) {
    		draw(event, 'cross')
    	})
    	
This is pretty-much the same as if we were handling a click or other event. Each square responds to gestures by calling the `draw` function. If you're on the road to becoming the next gaming entrepreneur, you might want to put in some logic about not drawing twice in the same square and checking that turns alternate. But for now, this shows how easy it is to add gesture support to your Mobile Safari web applications!

**scrubbing with dispatched events**

The gesture events used to draw naughts and crosses work much like a typical mouse event in the DOM: They are sent to the DOM element where the gesture starts being stroked. They then bubble up until they are handled. Thus, if you want to be able to draw a gesture anywhere on the screen, you bind the handler to the `body` element.

One pattern that comes up commonly is a desire to have a gesture drawn anywhere on the screen, but you want one or more elements in the DOM to handle it individually. In the [go][go] web application, the "close" gesture we are using to drawn an X is used to dismiss any dialog or message on the screen. Instead of the body element doing a search for visible dialogs and closing them, iGesture simply forwards `gesture_close` events to the dialogs and they bind their own handlers for it.

Although there are other ways to clear the Xs and Os, naughts and crosses uses this technique to demonstrate dispatching events:

    $('body')
  		// dispatch "scrub" gestures to squares that are not empty
  		.gesture({
  			scrub: '.square:not(:empty)'
  		});

Note that when we passed an array of gesture names, we were declaring we wanted custom events triggered on the elements where the first stroke began. But when we pass a hash of gesture names and jQuery selectors, we are declaring that when the gesture is drawn anywhere on the screen, the event will be triggered on all elements selected by the selector.

In naughts and crosses, we are triggering `gesture_scrub` on all squares that are not empty. And naturally, our binding is straightforward:

	$('.square')
		.bind('gesture_scrub', function(event) {
			$(this).empty();
		});
		
This should give you enough to get started. Review the code and how it's used in naughts and crosses. Good luck!

---

Nota Bene: Although this repository is public, this plugin has NOT been released. I am in the process of "extracting" iGesture from another project, and it is under construction.

Disclaimer: This jQuery plugin has nothing to do with the hardware device from the now-defunct [Fingerworks][fw], with [Dr. Maria Karam][mk]'s project, or with the [Java-based gesture recognition framework][java].

Warning: iGesture [May Contain Underscores][mcu].

[blank]: /raganwald/iGesture/raw/master/about/blank.png  "Blank"
[in_play]: /raganwald/iGesture/raw/master/about/in_play.png  "In Play"

[mcu]: http://ozmm.org/posts/javascript_style.html "JavaScript Style"
[go]: http://github.com/raganwald/go "Go"
[fw]: http://www.fingerworks.com/index.html
[mk]: http://users.ecs.soton.ac.uk/amrk03r/
[java]: http://sourceforge.net/projects/igesture/