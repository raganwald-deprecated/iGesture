iGesture
===
*New: The [Official Announcement][announce] has some background on how I came to adapt jGesture into iGesture.*

iGesture provides an event-driven model for supporting *gestures* (like swiping the screen) in your web application. iGesture is especially useful if you are building an application for mobile devices such as the iPhone or iPad and wish to support the same gestures as a native application on both mobile devices and in standard browsers. Because iGesture is event-based, you can support gestures exactly the same way you support other interactions such as mouse clicks: By binding event handlers to DOM elements.

iGesture is a [jQuery][jq] plugin.

**Naughts and Crosses**

[Naughts and crosses][nc] is a ridiculously simple game of Naughts and Crosses intended for "pass and play" on a standard browser or on an iPhone. Load it up in a modern browser, on an iPhone, or on an iPad. You should see a blank board:

![Blank][blank]

Drawn an "X" or an "O" starting inside any square. You can use your finger on an iPad or iPhone, a pen on a pen-enabled device, or mouse down and draw on a more conventional computer. *Do not draw on this document, silly! Draw on naughts\_and\_crosses.html!*. You don't need to draw entirely inside the square, the important thing is that you start drawing your gesture inside the square. All gestures must be drawn in one continuous set of strokes, so when drawing an X, do not lift your finger.

![Gestures][gestures]

So to draw an X you will need to use three strokes: One slash of the X, a connector stroke, and the other slash of the X. One way to draw an X is to stroke from top-left to bottom-right, from bottom-right to bottom-left, and from bottom-left to top-right. Strokes are named after their direction, so for development purposes we call these three strokes "bottom-right," "left," and "top-right."

The slashes of the "X" need to be close to 45 degrees to work properly. If you aren't getting an X, that's probably the issue. You can draw an "O" by drawing a circle. You can start the circle at any point, as long as you draw a full circle, you should get an O. You'll get the hang of drawing gestures very quickly. Play around for a bit, you may end up with something like this:

![In Play][oxox]

**what about the kinds of gestures in a typical iPhone application?**

Let's try something a lot simpler, the swipe gesture that is very common in the iPhone user interface. If you've used the Mail app on an iPhone or iPod Touch, you may know that when you swipe from left to right or right to left across a message in your inbox or other folder, a red delete button appears on the message, allowing you to delete it.

> [Apple Newton's] "scrub" erase remains an awesome design achievement that is still easier to use than anything else I see in the mobile device market&#8212;[Todd Ogasawara][quote]

Make a "right" or "left" gesture with your finger starting inside an existing naught or cross by swiping from left to right or right to left. Swipe smoothly so that the browser doesn't think you're clicking the image. You will see a red delete button appear. If you swipe again, it disappears. Just like iPhone's Mail application.

![Swipe to reveal delete][swipe]

Now try a "scrub" gesture: Place your finger anywhere on the left side of the screen, stroke to the right, back to the left, and back to the right. We call this "right-left-right". You can also reverse the scrub's directions, "left-right-left." When you perform a scrub, all the Xs and Os you've drawn will disappear.

But wait, there's more! If you're using a multi-touch device (or a simulator), you can place two fingers on the screen and rotate your fingers. Rotate at least forty-five degrees and lift for fingers from the screen: The board position will "rotate."

**coding with iGesture**

Everything you've seen is handled in Javascript with iGesture and jQuery. If you're interested in gestures, you may already know that you can get lists of touches from the browser or register functions to be called in response to certain callbacks. How much code do think it would take to handle the events for Xs, Os, swipes, scrubs, and rotations? Twenty, thirty function calls? Maybe 100 lines of code?

Here's <u>all</u> the iGesture-specific code in Naughts and Crosses:

    $('.board')
	    .gesture(['left', 'right', 'close', 'circleclockwise', 'circlecounterclockwise', 'rotate',
  			{ scrub: '.square:not(:empty)' }
  		])
	    .bind({
  			gesture_rotate: function (event) {
  				rotate(event.rotation);
  	    },
		  });

    $('.square')
	    .bind({
  			'gesture_circleclockwise gesture_circlecounterclockwise': function (event) {
  		      draw('naught', this)
  		  },
  	    gesture_close: function (event) {
  	        draw('cross', this)
  	    },
  	    gesture_scrub: function (event) {
  	        $(this).empty();
  	    },
  			'gesture_left gesture_right': function (event) {
  				  toggle_delete(this);
  			}
		});
	    
Let's take a look at it point by point. The most common use case is turning a gesture into an event that is invoked on the DOM element where the gesture starts. We want each square to handle the Xs, Os, and swipes. We want the board to handle rotates. To set that up, you simply give a list of gestures to a DOM element:

    $('.board')
	    .gesture(['left', 'right', 'close', 'circleclockwise', 'circlecounterclockwise', 'rotate', ...
    
iGesture will bind the appropriate mouse and touch events to the DOM element for you.

(Notice that the "X" gesture is actually called `close`, because in many UIs this looks like the little `x` you see in a close control, so it is used to dismiss things like dialogs. We're using it unconventionally: iGesture is not really designed as a handwriting recognition system. Likewise, Os are actually `circle` gestures. Circles are also handy for rotating things because you might want your web application to work even if the browser does not support the multi-touch rotation gesture.)

We bind the `draw` and `toggle_delete` functions to squares using jQuery by passing a hash of events and functions to the `.bind` method:

    $('.square')
      .bind({
        'gesture_circleclockwise gesture_circlecounterclockwise': function (event) {
            draw('naught', this)
        },
        gesture_close: function (event) {
          	draw('cross', this)
        },
  			'gesture_left gesture_right': function (event) {
  				  toggle_delete(this);
  			}
      });
	    
The `rotate` gesture is handled by the board, so we bind the handler to the board:

    $('.board')
      .bind({
        gesture_rotate: function (event) {
          rotate(event.rotation);
        }
      });

As you can see, there's no fuss, no muss, no dealing with multi-touch quirks like lists of touches or discriminating between strokes and multi-touch gestures. If you want to support multi-touch rotation gestures, you handle rotate gesture events and iGesture takes care of the rest.

**scrubbing with dispatched events**

The gesture events used to draw Naughts and Crosses work much like a typical mouse event in the DOM: They are sent to the DOM element where the gesture starts being stroked. They then bubble up until they are handled.

One pattern that comes up commonly is a desire to have a gesture drawn anywhere on the screen, but you want one or more elements in the DOM to handle it individually. In the [go][go] web application, the "close" gesture we are using to drawn an X is used to dismiss any dialog or message on the screen. Instead of the body element doing a search for visible dialogs and closing them, iGesture simply forwards `gesture_close` events to the dialogs and they bind their own handlers for it.

Although there are other ways to clear the Xs and Os, Naughts and Crosses uses this technique to demonstrate dispatching events:

    $('.board')
	    .gesture([ ..., {
	        scrub: '.square:not(:empty)'
	    }]);

When we passed the gesture names as strings, we were declaring we wanted custom events triggered on the elements where the first stroke began. But when we pass an object associating gesture names and jQuery selectors, we are declaring that when the gesture is drawn anywhere on the board, the event will be triggered on all elements selected by the selector.

In Naughts and Crosses, we are triggering `gesture_scrub` on all squares that are not empty. And naturally, our binding is straightforward:

    $('.square')
      .bind({
        gesture_scrub: function (event) {
          	$(this).empty();
        }
      });
		
This should give you enough to get started. Review the code and how it's used in Naughts and Crosses. Then try incorporating it into your project. Good luck!

Sincerely,

[Reg Braithwaite][reg]

p.s. [Naughts and Crosses][nc] has an [Easter Egg][eegg]. It shouldn't be too difficult to find it and discover how to create your own custom gestures.

---

*iGesture is based on Nico Goeminne's [jGesture][jg] callback-oriented plugin. Thanks, Nico! iGesture would not have been possible without the motivation and support of the [Unspace](http://unspace.ca/ "Unspace") working environment. Thanks! Also, iGesture has nothing to do with the now-defunct [Fingerworks][fw], with [Dr. Maria Karam][mk]'s project, or with anything written in [Java][java].*
  
Follow [me](http://reginald.braythwayt.com) on [Twitter](http://twitter.com/raganwald) or [RSS](http://feeds.feedburner.com/raganwald "raganwald's rss feed").

[blank]: /raganwald/iGesture/raw/master/about/blank.png  "Blank"
[gestures]: /raganwald/iGesture/raw/master/about/gestures.png  "Example Gestures"
[oxox]: /raganwald/iGesture/raw/master/about/oxox.png  "In Play"
[swipe]: /raganwald/iGesture/raw/master/about/swipe.png "Swipe"

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
[eegg]: http://en.wikipedia.org/wiki/Easter_egg_(media)
[quote]: http://www.mediabistro.com/mobilecontenttoday/apple/apple_newton_developer_returns_after_15_years_tablet_in_apples_future_137076.asp
