iGesture
===
*New: The [Official Announcement][announce] has some background on how I came to write iGesture.*

iGesture provides an event-driven model for supporting *gestures* (like swiping the screen) in your web application. iGesture is especially useful if you are building an application for mobile devices such as the iPhone or iPad and wish to support the same gestures as a native application on both mobile devices and in standard browsers. Because iGesture is event-based, you can support gestures exactly the same way you support other interactions such as mouse clicks: By binding event handlers to DOM elements.

iGesture is a [jQuery][jq] plugin.

**doesn't mobile safari already give me gesture support?**

Mobile Safari has high-level support or handling scaling and rotation with two fingers. You can also get incredibly detailed and track each finger separately if you need to. However, if you want to use strokes like swiping up or down or drawing a circle with one finger, you have to track the touch movements yourself.

With iGesture, you have predefined gestures like "left," "top," and "scrub" (A back-and-forth wiping) that are automatically turned into jQuery custom events so you can bind functions to the individual gestures on specific elements rather than having a massive switch statement inside your `touchmove` handler. Your code is more 'jQuery-ish'.

**naughts and crosses**

[Naughts and crosses][nc] is a ridiculously simple game of naughts and crosses intended for "pass and play" on a standard browser or on an iPhone. Load it up in a modern browser, on an iPhone, or on an iPad. You should see a blank board:

![Blank][blank]

Drawn an "X" or an "O" starting inside any square. You can use your finger on an iPad or iPhone, a pen on a pen-enabled device, or mouse down and draw on a more conventional computer. *Do not draw on this document, silly! Draw on naughts\_and\_crosses.html!*. You don't need to draw entirely inside the square, the important thing is that you start drawing your gesture inside the square. All gestures must be drawn in one continuous set of strokes, so when drawing an X, do not lift your finger.

![Gestures][gestures]

So to draw an X you will need to use three strokes: One slash of the X, a connector stroke, and the other slash of the X. One way to draw an X is to stroke from top-left to bottom-right, from bottom-right to bottom-left, and from bottom-left to top-right. Strokes are named after their direction, so for development purposes we call these three strokes "bottom-right," "left," and "top-right."

The slashes of the "X" need to be close to 45 degrees to work properly. If you aren't getting an X, that's probably the issue. You can draw an "O" by drawing a circle. You can start the circle at any point, as long as you draw a full circle, you should get an O. You'll get the hang of drawing gestures very quickly. Play around for a bit, you may end up with something like this:

![In Play][oxox]

Now try a "scrub" gesture: Place your finger anywhere on the left side of the screen, stroke to the right, back to the left, and back to the right. We call this "right-left-right". You can also reverse the scrub's directions, "left-right-left." When you perform a scrub, all the Xs and Os you've drawn will disappear.

But wait, there's more! If you're using a multi-touch device (or a simulator), you can place two fingers on the screen and rotate your fingers. Rotate at least forty-five degrees and lift for fingers from the screen: The board position will "rotate."

**coding with iGesture**

Everything you've seen is handled in Javascript with iGesture and jQuery. If you're interested in gestures, you may already know that you can get lists of touches from the browser or register functions to be called in response to certain callbacks. How much code do think it would take to handle the events for Xs, Os, scrubs, and rotations? Twenty, thirty function calls? Maybe fewer than 100 lines of code?

How about just *six* function calls&#8253;

There's one to `.gesture` and five to bind the `X`, `O`, `scrub`, and `rotate` events. (If you counted four, it's because there's one circle event for each direction you can stroke, but all eight ways you can draw an X are the same event.) Here's <u>all</u> the iGesture-specific code in naughts and crosses:

    $('body')
	    .gesture(['close', 'circleclockwise', 'circlecounterclockwise', 'rotate', {
	        scrub: '.square:not(:empty)'
	    }]);

    $('.board')
	    .bind('gesture_rotate', function (event) {
	        rotate(event.rotation);
	    });

    $('.square')
	    .bind('gesture_circleclockwise', function (event) {
	        draw('naught', event.target)
	    })
	    .bind('gesture_circlecounterclockwise', function (event) {
	        draw('naught', event.target)
	    })
	    .bind('gesture_close', function (event) {
	        draw('cross', event.target)
	    })
	    .bind('gesture_scrub', function (event) {
	        $(this).empty();
	    });
	    
Let's take a look at it point by point. The most common use case is turning a gesture into an event that is invoked on the DOM element where the gesture starts. We want each square to handle the Xs and Os, and we want the board to handle rotate. To set that up, you simply give iGesture a list of gestures to turn into events:

    $('body')
	    .gesture(['close', 'circleclockwise', 'circlecounterclockwise', 'rotate', ...
    
Notice that the "X" gesture is actually called `close`, because in many UIs this looks like the little `x` you see in a close control, so it is used to dismiss things like dialogs. We're using it unconventionally: iGesture is not really designed as a handwriting recognition system. Likewise, Os are actually `circle` gestures. Circles are often used for rotating things because you might want your web application to work even if the browser does not support the multi-touch rotation gesture.

We bind a `draw` function to squares in the standard jQuery way:

    $('.square')
	    .bind('gesture_circleclockwise', function (event) {
	        draw('naught', event.target)
	    })
	    .bind('gesture_circlecounterclockwise', function (event) {
	        draw('naught', event.target)
	    })
	    .bind('gesture_close', function (event) {
	        draw('cross', event.target)
	    })
	    
The `rotate` gesture is handled by the board, so we bind the handler to the board. If it is performed in a square, it will bubble up just like any other event:

    $('.board')
	    .bind('gesture_rotate', function (event) {
	        rotate(event.rotation);
	    });

As you can see, there's no fuss, no muss, no dealing with multi-touch quirks like lists of touches or discriminating between strokes and multi-touch gestures. You want rotation, you get rotate events.

**scrubbing with dispatched events**

The gesture events used to draw naughts and crosses work much like a typical mouse event in the DOM: They are sent to the DOM element where the gesture starts being stroked. They then bubble up until they are handled.

One pattern that comes up commonly is a desire to have a gesture drawn anywhere on the screen, but you want one or more elements in the DOM to handle it individually. In the [go][go] web application, the "close" gesture we are using to drawn an X is used to dismiss any dialog or message on the screen. Instead of the body element doing a search for visible dialogs and closing them, iGesture simply forwards `gesture_close` events to the dialogs and they bind their own handlers for it.

Although there are other ways to clear the Xs and Os, naughts and crosses uses this technique to demonstrate dispatching events:

    $('body')
	    .gesture([ ..., {
	        scrub: '.square:not(:empty)'
	    }]);

When we passed the gesture names as strings, we were declaring we wanted custom events triggered on the elements where the first stroke began. But when we pass a an object associating gesture names and jQuery selectors, we are declaring that when the gesture is drawn anywhere on the screen, the event will be triggered on all elements selected by the selector.

In naughts and crosses, we are triggering `gesture_scrub` on all squares that are not empty. And naturally, our binding is straightforward:

	$('.square')
	    .bind('gesture_scrub', function (event) {
	        $(this).empty();
	    });
		
This should give you enough to get started. Review the code and how it's used in naughts and crosses. Then try incorporating it into your project. Good luck!

Sincerely,

[Reg Braithwaite][reg]

---

*iGesture is based on Nico Goeminne's [jGesture][jg] callback-oriented plugin. Thanks, Nico! iGesture would not have been possible without the motivation and support of the [Unspace](http://unspace.ca/ "Unspace") working environment. Thanks! Also, iGesture has nothing to do with the now-defunct [Fingerworks][fw], with [Dr. Maria Karam][mk]'s project, or with anything written in [Java][java].*
  
Follow [me](http://reginald.braythwayt.com) on [Twitter](http://twitter.com/raganwald) or [RSS](http://feeds.feedburner.com/raganwald "raganwald's rss feed").

[blank]: /raganwald/iGesture/raw/master/about/blank.png  "Blank"
[gestures]: /raganwald/iGesture/raw/master/about/gestures.png  "Example Gestures"
[oxox]: /raganwald/iGesture/raw/master/about/oxox.png  "In Play"

[mcu]: http://ozmm.org/posts/javascript_style.html "JavaScript Style"
[go]: http://github.com/raganwald/go "Go"
[fw]: http://www.fingerworks.com/index.html
[mk]: http://users.ecs.soton.ac.uk/amrk03r/
[java]: http://sourceforge.net/projects/igesture/
[reg]: http://reginald.braythwayt.com
[nc]: http://raganwald.github.com/iGesture/naughts_and_crosses.html
[jq]: http://jquery.com
[jg]: http://web.siruna.com/nico/jgesture/documentation.html
[announce]: http://github.com/raganwald/homoiconic/blob/master/2010/04/igesture.md#readme "Announcing iGesture"