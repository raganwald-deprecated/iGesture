<h1 id="igesture">iGesture</h1>

<p>A fork of the <a href="http://web.siruna.com/nico/jgesture/documentation.html" title="jGesture Plugin for JQuery">jGesture</a> plugin for modern browsers and especially Mobile Safari. With iGesture, your web applications can respond to <em>gestures</em>, shapes the user draws with their finger or pointing device. You can respond to swiping up, down, left or right or at a 45 degree angle, you can support circles drawn clockwise or counterclockwise, and you can respond to more complex gestures such as a plus or &#8220;X.&#8221; Gestures can be drawn on the entire screen or you can support gestures drawn on specific elements of the page.</p>

<p><strong>doesn&#8217;t mobile safari already give me gesture support?</strong></p>

<p>Mobile Safari has high-level support or handling scaling and rotation with two fingers. You can also get incredibly detailed and track each finger separately if you need to. However, if you want to use gestures like swiping up or down or drawing a circle with one finger, you have to track the touch movements yourself.</p>

<p>With iGesture, you have predefined gestures like &#8220;left,&#8221; &#8220;top,&#8221; and &#8220;scrub&#8221; (A back-and-forth wiping) that are automatically turned into jQuery custom events so you can bind functions to the individual gestures on specific elements rather than having a massive switch statement inside your <code>touchmove</code> handler. Your code is more &#8216;jQuery-ish&#8217;.</p>

<p>Have a look at &#8220;naughts and crosses,&#8221; a line of code really is worth a thousand words.</p>

<p><strong>naughts and crosses</strong></p>

<p>The <a href="naughts_and_crosses.html">naughts and crosses</a> demonstration page is a ridiculously simple game of naughts and crosses intended for &#8220;pass and play&#8221; on a standard browser (it has not been set up for Mobile Safari yet). To try it, download <a href="naughts_and_crosses.html">naughts_and_crosses.html</a>, <a href="naughts_and_crosses.js">naughts_and_crosses.js</a>, and of course <a href="igesture.jquery.mobile_safari.js">igesture.jquery.mobile_safari.js</a>. Put them in the same directory and use Safari to open naughts_and_crosses.html.</p>

<p>You should see a blank board:</p>

<p><img src="/raganwald/iGesture/raw/master/about/blank.png" alt="Blank" title="Blank"></p>

<p>Drawn an &#8220;X&#8221; or an &#8220;O&#8221; on any square. You can use your finger on an iPad or iPhone, a pen on a pen-enabled device, or mouse down and draw on a more conventional computer. Note: <em>Do not draw on this documentation, draw on your copy of naughts_and_crosses.html!</em>. All gestures must be drawn in one continuous set of strokes, so when drawing an X, do not lift your finger. So to draw an X you will need to use three strokes: One slash of the X, a connector stroke, and the other slash of the X. One way to draw an X is to stroke from top-left to bottom-right, from bottom-right to bottom-left, and from bottom-left to top-right. Strokes are named after their direction, so for development purposes we call these three strokes &#8220;bottom-right,&#8221; &#8220;left,&#8221; and &#8220;top-right.&#8221;</p>

<p>You can draw an &#8220;O&#8221; by drawing a circle. You may need to practice a bit to get it right. Play around for a bit, you may end up with something like this:</p>

<p><img src="/raganwald/iGesture/raw/master/about/in_play.png" alt="In Play" title="In Play"></p>

<p>Now try a &#8220;scrub&#8221; gesture: Place your finger on the left side of the screen, stroke to the right, back to the left, and back to the right. (You can also reverse the scrub&#8217;s direction if you prefer, it&#8217;s the same gesture). All the Xs and Os you&#8217;ve drawn will disappear. </p>

<p>If you&#8217;d like to become the next great iPad millionaire, you can finish this application up. Add logic for recognizing when a game is won, undoing a move, playing over the internet, and using location services to find nearby players. Good luck!</p>

<p><strong>naughts and crosses with gesture events</strong></p>

<p>The naughts and crosses demonstration shows how to use one of iGesture&#8217;s features, handling gestures using jQuery&#8217;s custom events. Have a look at <a href="naughts_and_crosses.js">naughts_and_crosses.js</a>:</p>

<pre><code>$('body')
    // generate close and circle gestures
  .gesture(['close', 'circleclockwise', 'circlecounterclockwise'])
</code></pre>

<p>This tells the body of the page that we want three gestures to be treated as custom events: <code>close</code>, <code>circleclockwise</code>, and <code>circlecounterclockwise</code>. You nearly always want to execute this on the body. iGesture allows you to handle nearly any arbitrary sequence of strokes as a gesture, but the most common ones have names and you can easily handle them as custom events. The &#8220;X&#8221; gesture is known as &#8220;close&#8221; because it is commonly used to dismiss a dialog or close a window. The two &#8220;circle&#8221; gestures are often used for rotating things. We&#8217;re handling both so that it doesn&#8217;t matter which way you draw a circle. It&#8217;s often important to be liberal in the way you handle similar strokes: Different people draw common shapes in different ways.</p>

<p>Speaking of handling custom gesture events, here&#8217;s the jQuery-powered code that does that:</p>

<pre><code>$('.square')
    .bind('gesture_circleclockwise', function(event) {
        draw(event, 'naught')
    })
    .bind('gesture_circlecounterclockwise', function(event) {
        draw(event, 'naught')
    })
    .bind('gesture_close', function(event) {
        draw(event, 'cross')
    })
</code></pre>

<p>This is pretty-much the same as if we were handling a click or other event. Each square responds to gestures by calling the <code>draw</code> function. If you&#8217;re on the road to becoming the next gaming entrepreneur, you might want to put in some logic about not drawing twice in the same square and checking that turns alternate. But for now, this shows how easy it is to add gesture support to your Mobile Safari web applications!</p>

<p><strong>scrubbing with dispatched events</strong></p>

<p>The gesture events used to draw naughts and crosses work much like a typical mouse event in the DOM: They are sent to the DOM element where the gesture starts being stroked. They then bubble up until they are handled. Thus, if you want to be able to draw a gesture anywhere on the screen, you bind the handler to the <code>body</code> element.</p>

<p>One pattern that comes up commonly is a desire to have a gesture drawn anywhere on the screen, but you want one or more elements in the DOM to handle it individually. In the <a href="http://github.com/raganwald/go" title="Go">go</a> web application, the &#8220;close&#8221; gesture we are using to drawn an X is used to dismiss any dialog or message on the screen. Instead of the body element doing a search for visible dialogs and closing them, iGesture simply forwards <code>gesture_close</code> events to the dialogs and they bind their own handlers for it.</p>

<p>Although there are other ways to clear the Xs and Os, naughts and crosses uses this technique to demonstrate dispatching events:</p>

<pre><code>$('body')
    // dispatch "scrub" gestures to squares that are not empty
    .gesture({
        scrub: '.square:not(:empty)'
    });
</code></pre>

<p>Note that when we passed an array of gesture names, we were declaring we wanted custom events triggered on the elements where the first stroke began. But when we pass a hash of gesture names and jQuery selectors, we are declaring that when the gesture is drawn anywhere on the screen, the event will be triggered on all elements selected by the selector.</p>

<p>In naughts and crosses, we are triggering <code>gesture_scrub</code> on all squares that are not empty. And naturally, our binding is straightforward:</p>

<pre><code>$('.square')
    .bind('gesture_scrub', function(event) {
        $(this).empty();
    });
</code></pre>

<p>This should give you enough to get started. Review the code and how it&#8217;s used in naughts and crosses. Good luck!</p>

<hr>

<p>Nota Bene: Although this repository is public, this plugin has NOT been released. I am in the process of &#8220;extracting&#8221; iGesture from another project, and it is under construction.</p>

<p>Disclaimer: This jQuery plugin has nothing to do with the hardware device from the now-defunct <a href="http://www.fingerworks.com/index.html">Fingerworks</a>, with <a href="http://users.ecs.soton.ac.uk/amrk03r/">Dr. Maria Karam</a>&#8217;s project, or with the <a href="http://sourceforge.net/projects/igesture/">Java-based gesture recognition framework</a>.</p>

<p>Warning: iGesture <a href="http://ozmm.org/posts/javascript_style.html" title="JavaScript Style">May Contain Underscores</a>.</p>
