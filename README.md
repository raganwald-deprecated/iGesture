iGesture
===

A fork of the [jGesture](http://web.siruna.com/nico/jgesture/documentation.html "jGesture Plugin for JQuery") plugin for modern browsers and especially Mobile Safari. With iGesture, your web applications can respond to *gestures*, strokes the user draws with their finger or pointing device. You can respond to swiping up, down, left or right or at a 45 degree angle, you can support circles drawn clockwise or counterclockwise, and you can respond to more complex combinations of strokes such as a square or "X." Gestures can be drawn on the entire screen or you can support gestures drawn on specific elements of the page.

**doesn't mobile safari already give me gesture support?**

Mobile Safari has high-level support or handling scaling and rotation with two fingers. You can also get incredibly detailed and track each finger separately if you need to. However, if you want to use strokes like swiping up or down or drawing a circle with one finger, you have to track the touch movements yourself.

With iGesture, you have predefined gestures like "left," "top," and "scrub" (A back-and-forth wiping) that are automatically turned into jQuery custom events so you can bind functions to the individual gestures on specific elements rather than having a massive switch statement inside your `touchmove` handler. Your code is more 'jQuery-ish'.

Have a look at "naughts and crosses," the demo explained next. Sometimes one line of code really is worth a thousand words.

**naughts and crosses**

The [naughts and crosses](naughts_and_crosses.html) demonstration page is a ridiculously simple game of naughts and crosses intended for "pass and play" on a standard browser or on an iPhone. To try it, download [naughts\_and\_crosses.html](/raganwald/iGesture/raw/master/naughts_and_crosses.html), [naughts\_and\_crosses.js](n/raganwald/iGesture/raw/master/naughts_and_crosses.js), and of course [igesture.jquery.mobile\_safari.js](/raganwald/iGesture/raw/master/igesture.jquery.mobile_safari.js). Put them in the same directory and use Safari to open naughts\_and\_crosses.html.

If you want to try it on Mobile Safari, drop them in the Sites directory on your Macintosh and access them with your iPhone or iPhone Simulator's Safari browser.

You should see a blank board:

![Blank][blank]

Drawn an "X" or an "O" starting inside any square. You can use your finger on an iPad or iPhone, a pen on a pen-enabled device, or mouse down and draw on a more conventional computer. *Do not draw on this documentation, draw on your copy of naughts\_and\_crosses.html!*. You don't need to draw entirely inside the square, the important thingis that you start drawing your gesture inside the square. All gestures must be drawn in one continuous set of strokes, so when drawing an X, do not lift your finger.

![Gestures][gestures]

So to draw an X you will need to use three strokes: One slash of the X, a connector stroke, and the other slash of the X. One way to draw an X is to stroke from top-left to bottom-right, from bottom-right to bottom-left, and from bottom-left to top-right. Strokes are named after their direction, so for development purposes we call these three strokes "bottom-right," "left," and "top-right."

You can draw an "O" by drawing a circle. You may need to practice a bit to get it right. Play around for a bit, you may end up with something like this:

![In Play][oxox]

Now try a "scrub" gesture: Place your finger on the left side of the screen, stroke to the right, back to the left, and back to the right. (You can also reverse the scrub's directions). All the Xs and Os you've drawn will disappear. 

If you'd like to become the next great iPad millionaire, you can finish this application up. Add logic for recognizing when a game is won, undoing a move, playing over the internet, and using location services to find nearby players. Good luck!

**naughts and crosses with gesture events**

The naughts and crosses demonstration shows how to use one of iGesture's features, handling gestures using jQuery's custom events. Have a look at [naughts\_and\_crosses.js](naughts\_and\_crosses.js):

    $('body')
  		.gesture([
  			'close',
  			'circleclockwise', 'circlecounterclockwise',
    		# ...
    	]);
    
The `.gesture` function takes a list of gestures as its argument (there's also a way to pass settings, but we won't go into that now). The simplest case is to pass the names of predefined gestures you want. iGesture to handle. iGesture will handle gestures drawn on the receiving node(s) by triggering custom events on the node where the gesture started. In this case we want custom events for `close`, `circleclockwise`, and `circlecounterclockwise` triggered.

When the user performs one of these gestures anywhere in the body, iGesture will generate the appropriate custom event: `gesture_close`, `gesture_circleclockwise`, or `gesture_circlecounterclockwise`. The "X" gesture is known as "close" because it is commonly used to dismiss a dialog or close a window. The two "circle" gestures are often used for rotating things because you might want your web application to work even if the browser does not support the multi-touch rotation gesture.

Here is the jQuery-powered code that handles these custom events:

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

Since we're only defining handlers on squares, gestures drawn on other elements would be ignored because the custom events would bubble up and vanish. There are no other elements in this simple demo, but as you can see custom events make for a very natural way to handle gestures, just like clicks and other events you are already handling with jQuery.

**scrubbing with dispatched events**

The gesture events used to draw naughts and crosses work much like a typical mouse event in the DOM: They are sent to the DOM element where the gesture starts being stroked. They then bubble up until they are handled. Thus, if you want to be able to draw a gesture anywhere on the screen, you bind the handler to the `body` element.

One pattern that comes up commonly is a desire to have a gesture drawn anywhere on the screen, but you want one or more elements in the DOM to handle it individually. In the [go][go] web application, the "close" gesture we are using to drawn an X is used to dismiss any dialog or message on the screen. Instead of the body element doing a search for visible dialogs and closing them, iGesture simply forwards `gesture_close` events to the dialogs and they bind their own handlers for it.

Although there are other ways to clear the Xs and Os, naughts and crosses uses this technique to demonstrate dispatching events:

    $('body')
  		.gesture([
  			# ...
  			{ scrub: '.square:not(:empty)' }
  		]);
  		
Note that when we passed the gesture names as strings, we were declaring we wanted custom events triggered on the elements where the first stroke began. But when we pass a an object associating gesture names and jQuery selectors, we are declaring that when the gesture is drawn anywhere on the screen, the event will be triggered on all elements selected by the selector.

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
[gestures]: /raganwald/iGesture/raw/master/about/gestures.png  "Example Gestures"
[oxox]: /raganwald/iGesture/raw/master/about/oxox.png  "In Play"

[mcu]: http://ozmm.org/posts/javascript_style.html "JavaScript Style"
[go]: http://github.com/raganwald/go "Go"
[fw]: http://www.fingerworks.com/index.html
[mk]: http://users.ecs.soton.ac.uk/amrk03r/
[java]: http://sourceforge.net/projects/igesture/