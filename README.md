iGesture
===

A fork of the [jGesture](http://web.siruna.com/nico/jgesture/documentation.html "jGesture Plugin for JQuery") plugin for Mobile Safari. With iGesture, your Mobile Safari applications can respond to *gestures*, shapes the user draws with their finger. You can respond to swiping up, down, left or right or at a 45 degree angle, you can support circles drawn clockwise or counterclockwise, and you can respond to more complex gestures such as a square or "X." Gestured can be drawn on the entire screen or you can support gestures drawn on specific elements of the page.

**naughts and crosses**

The [naughts and crosses](naughts_and_crosses.html) demonstration page is a ridiculously simple game of naughts and crosses intended for "pass and play." To try it, download [naughts\_and\_crosses.html](naughts\_and\_crosses.html), [naughts\_and\_crosses.js](naughts\_and\_crosses.js), and of course [igesture.jquery.mobile\_safari.js](igesture.jquery.mobile\_safari.js). Put them in the same directory and use Safari to open naughts\_and\_crosses.html.

You should see a blank board:

![Blank][blank]

Drawn an "X" or an "O" on any square. You can use your finger on an iPad or iPhone, a pen on a pen-enabled device, or mouse down and draw on a more conventional computer. Note: *Do not draw on this documentation, draw on your copy of naughts\_and\_crosses.html!*. All gestures must be drawn in one continuous set of strokes, so when drawing an X, do not lift your finger. So to draw an X you will need to use three strokes: One slash of the X, a connector stroke, and the other slash of the X. One way to draw an X is to stroke from top-left to bottom-right, from bottom-right to bottom-left, and from bottom-left to top-right. Strokes are named after their direction, so for development purposes we call these three strokes "bottom-right," "left," and "top-right."

You can draw an "O" by drawing a circle. You may need to practice a bit to get it right. Play around for a bit, you may end up with something like this:

![In Play][in_play]

If you'd like to become the next great iPad millionaire, you can finish this application up. Add logic for recognizing when a game is won, undoing a move, playing over the internet, and using location services to find nearby players. Good luck!

**under the hood**

The naughts and crosses demonstration shows how to use one of iGesture's features, handling gestures using jQuery's custom events. Have a look at [naughts\_and\_crosses.js](naughts\_and\_crosses.js). the first interesting line is:

    $('body').gesture(['close', 'rotateclockwise', 'rotatecounterclockwise']);
    
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

**other powers**

iGesture also supports directly handling gestures with callbacks and a dispatching model that is handy for applications where you want to allow gestures drawn anywhere on the screen to be routed to specific nodes in the DOM. Documentation and examples will follow in the fullness of time...

---

Nota Bene: Although this repository is public, this plugin has NOT been released. I am in the process of "extracting" iGesture from another project, and it is under construction.

Warning: iGesture [May Contain Underscores](http://ozmm.org/posts/javascript_style.html "JavaScript Style").

[blank]: /raganwald/iGesture/raw/master/about/blank.png  "Blank"
[in_play]: /raganwald/iGesture/raw/master/about/in_play.png  "In Play"