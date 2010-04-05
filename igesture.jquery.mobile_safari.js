// Copyright 2010 Reginald Braithwaite, Portions Copyright 2008 Nico Goeminne
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// This code modified from jGesture, http://web.siruna.com/nico/jgesture/documentation.html,
// (c) 2008 Nico Goeminne and released under Apache License 2.0
// See: http://www.apache.org/licenses/LICENSE-2.0

// Mods (so far) include support for mobile touch events under Mobile Safari,
// storing the target for creating custom events, and expanding the predefined
// events so that things like "close" can be written with eight different
// symmetric gestures.

// Warning: May Contain Underscores 
//          http://ozmm.org/posts/javascript_style.html

jQuery.fn.gesture = function(fn, settings) {

	if (typeof(fn) == 'function') {
  	return this.each( function () 	{

			var topleft = 1;
			var top = 2;
			var topright = 3;
			var right = 4;
			var bottomright = 5;
			var bottom = 6;
			var bottomleft = 7;
			var left = 8;

		  var gesture = {
				target: null,
		    moves : "",
		    x : -1,
		    y : -1,
		    lastmove : "",
		    continuesmode: false,
		    getMoveNameAt: function (i) {
		      switch(Number(this.moves.charAt(i))){
		        case 1:
		          return "topleft";
		        case 2:
		          return "top";
		        case 3:
		          return "topright";
		        case 4:
		          return "right";
		        case 5:
		          return "bottomright";
		        case 6:
		          return "bottom";
		        case 7:
		          return "bottomleft";
		        case 8:
		          return "left";
		        default:
		          return "unknown";
		      }
		    },
		    getName : function(){
   
		      if(this.continuesmode && this.moves.length > 0){
		      	return this.getMoveNameAt(this.moves.length-1);
		      }
   
		      if(this.moves.length == 1) {
		        return this.getMoveNameAt(0);
		      }
		      if(this.moves.length == 2) {
		        return this.getMoveNameAt(0) + "_" + this.getMoveNameAt(1);
		      }
		
					if (this.moves.length < 7) {
						
		        if ( (Number(this.moves.charAt(0))== 4) &&
		             (Number(this.moves.charAt(this.moves.length-1)) == 4) &&
		             (this.moves.indexOf("8") != -1)
		           ) return "scrub";
	        
		        if ( (Number(this.moves.charAt(0))== 8) &&
		             (Number(this.moves.charAt(this.moves.length-1)) == 8) &&
		             (this.moves.indexOf("4") != -1)
		           ) return "scrub";
	
					}
	
					var g = this;
					var half_close_gestures = [
						{ start: bottomright, connect: top, finish: bottomleft }, { start: topleft, connect: bottom, finish: topright },
						{ start: bottomright, connect: left, finish: topright }, { start: topleft, connect: right, finish: bottomleft }
					];
			
					for (i in half_close_gestures) {
						var e = half_close_gestures[i];
		        if ( (Number(g.moves.charAt(0))== e.start) &&
		             (Number(g.moves.charAt(g.moves.length-1)) == e.finish) &&
		             (g.moves.indexOf('' + e.connect) != -1)
		           ) return 'close';
		        if ( (Number(g.moves.charAt(0))== e.finish) &&
		             (Number(g.moves.charAt(g.moves.length-1)) == e.start) &&
		             (g.moves.indexOf('' + e.connect) != -1)
		           ) return 'close';
					};

		      if (this.moves.length >= 7) {
		        if( (function (str){
		          for (var i = 1 ; i < 8; i++){
		            var pre = Number(str.charAt(i-1));
		            var cur = Number(str.charAt(i));
		            if (( pre + 1 == cur) || (pre == cur + 7)) {
		              continue;
		            }
		            return false;
		          }
		          return true;
		        })(this.moves) ) return "circleclockwise";

		        if( (function (str){
		          for (var i = 1 ; i < 8; i++){
		            var pre = Number(str.charAt(i-1));
		            var cur = Number(str.charAt(i));
		            if (( pre == cur + 1) || (pre + 7 == cur )) {
		              continue;
		            }
		            return false;
		          }
		          return true;
		        })(this.moves) ) return "circlecounterclockwise";
		      }

		      return "unknown";
		    }
		  };

		  settings = jQuery.extend({
		     startgesture: "mousedown",
		     stopgesture: "mouseup",
					intragesture: "mousemove",
		     button: "012",
		     mindistance: 10,
		     continuesmode: false,
		     repeat: false,
		     disablecontextmenu: true
		  }, settings);


		  $(this).bind(settings.startgesture, function (e) {
		    if (e.button != null && settings.button.indexOf("" + e.button) == -1) return;

				gesture.target = e.target;
   
		    // disable browser context menu.
		    if (settings.disablecontextmenu) {
		      $(this).bind("contextmenu", function(e) {
		        return false;
		      });
		    }
				if (e.preventDefault) { e.preventDefault(); } // added by reg to see if it fixes default image drag
 
		    gesture.moves = "";
		    gesture.x = -1;
		    gesture.y = -1;
		    gesture.continuesmode = settings.continuesmode;
   
		    $(this).bind(settings.intragesture, function(e){
					var x = typeof(e.screenX) == 'number' ? e.screenX : event.targetTouches[0].pageX;
					var y = typeof(e.screenY) == 'number' ? e.screenY : event.targetTouches[0].pageY;
		
		      if ((gesture.x == -1) && (gesture.y == -1)){
		        gesture.x = x;
		        gesture.y = y;
		        return;
		      }
		      var distance = Math.sqrt(Math.pow(x - gesture.x,2)+Math.pow(y - gesture.y,2));
		      if( distance > settings.mindistance){
		        var angle = Math.atan2(x - gesture.x, y - gesture.y) / Math.PI + 1;
		        var dir = 0;
		        if (3/8  < angle && angle < 5/8 ) dir = 8;
		        if (5/8  < angle && angle < 7/8 ) dir = 7;
		        if (7/8  < angle && angle < 9/8 ) dir = 6;
		        if (9/8  < angle && angle < 11/8) dir = 5;
		        if (11/8 < angle && angle < 13/8) dir = 4;
		        if (13/8 < angle && angle < 15/8) dir = 3;
		        if (15/8 < angle || angle < 1/8 ) dir = 2;
		        if (1/8  < angle && angle < 3/8 ) dir = 1;

		        gesture.x = x;
		        gesture.y = y;
       
		        if(gesture.moves.length == 0) {
		          gesture.moves += dir;
		          gesture.lastmove = "" + dir;
		        }
		        else {
		          if (settings.repeat || (gesture.moves.charAt(gesture.moves.length - 1) != dir) ){
						    gesture.moves += dir;
						    gesture.lastmove = "" + dir;
						  }
		        }
		        if (settings.continuesmode){
		          var t = $(this);
			  			t.hfn = fn;
		          t.hfn(gesture);
		        }
		      }
		    });
		  });

		  $(this).bind(settings.stopgesture, function (e) {
		    if (e.button != null && settings.button.indexOf("" + e.button) == -1) return;

		    if (!settings.disablecontextmenu) {
		      $(this).unbind("contextmenu");
		    }
		    $(this).unbind(settings.intragesture);
		    if (gesture.moves.length != 0) {
		      var t = $(this);
		      t.hfn = fn;
		      t.hfn(gesture);
		    }
		  });

	  	return this;

	  });
	}
	// when an object is given, this is a hash for dispatching gestures,
	// as in $('body').gesture({
	//	close: ...,
	//  left: ...
	//})
	//
	// the key is the name of a gesture, the value is:
	// 1. a string denoting a jQuery selector, or;
	// 2. a function taking the target as a parameter and
	//    answering a selection
	//
	// e.g. $('body').gesture({ close: '.wants_close' });
	//
	// sends all nodes with the class 'wants_close' the custom
	// event 'gesture_close' when a close is drawn anywhere in
	// the body.
	//
	// the custom event 'gesture_x' will be sent to objects in
	// the selection (where x is the name of the gesture)
	else if (typeof(fn) == 'object' && typeof(fn.length) == 'undefined') {
     (function (dispatch_table, gesture_events) {
			for (i in gesture_events) {
				if (dispatch_table[i]) {
					gesture_events[i] = dispatch_table[i];
				}
			}
			$(this).gesture(function (gesture_data) {
					var name = gesture_data.getName();
					if (name != null && dispatch_table[name]) {
						var receiver_expr = dispatch_table[name];
						var event = jQuery.Event("gesture_" + name);
						event.gesture_data = gesture_data;
						if (typeof(receiver_expr) == 'string') {
							$(receiver_expr).trigger(event);
						}
						else if (typeof(receiver_expr) == 'function') {
							var triggerees = receiver_expr($(event.gesture_data.target)); // andand!
							if (triggerees) {
								triggerees.trigger(event);
							}
						}
						$(gesture_data.target).trigger(event);
					}
					return false;
				}, gesture_events);
		})(fn, {
				startgesture: "touchstart mousedown",
				stopgesture: "touchend mouseup",
				intragesture: "touchmove mousemove"
			});
		return this;
	}
	// when an array is given, this is a list of gestures that are
	// to be sent as events to their targets,
	// as in $('div.sketchpad').gesture([ 'close', 'left', 'right' ... ]);
	//
	// This sets things up so that a div with the class 'sketchpad' and all
	// of its children will receive 'gesture_close', 'gesture_left',
	// and 'gesture_right' custom events when these gestures are drawn in
	// them.
	else if (typeof(fn) == 'object') {
		(function (argv, gesture_events) {
			var gesture_names = [];
			jQuery.each(argv, function (i, arg) {
				if (typeof(arg) == 'string') {
					gesture_names.push(arg);
				}
				else if (typeof(arg) == 'object') {
					for (i in gesture_events) {
						if (arg[i]) {
							gesture_events[i] = arg[i];
						}
					}
				}
			});
			$(this).gesture(function (gesture_data) {
					var name = gesture_data.getName();
					if (name != null && jQuery.inArray(name, gesture_names) != -1) {
						var event = jQuery.Event("gesture_" + name);
						event.gesture_data = gesture_data;
						event.unhandled = true;
						$(gesture_data.target).trigger(event);
					}
					return false;
				}, gesture_events);
		})(fn, {
				startgesture: "touchstart mousedown",
				stopgesture: "touchend mouseup",
				intragesture: "touchmove mousemove"
			});
		return this;
	}
};