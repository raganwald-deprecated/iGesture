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
jQuery.fn.gesture = function(events) {
	
	var return_target = function(target) { return target; };
	
	var selector_maker = function (selector) {
		return function() { return $(selector); };
	};
	
	var stroke_events = {};
	var gesture_events = {};
	var default_settings = {
	  startStroke: "touchstart mousedown",
	  stopStroke: "touchend mouseup",
	  continueStroke: "touchmove mousemove",
	  startGesture: "gesturestart",
	  stopGesture: "gestureend",
	  continueGesture: "gesturechange",
	  button: "012",
	  minDistance: 10,
	  minScale: 0.25,
	  minRotation: 22.5,
	  continuesmode: false,
	  repeat: false,
	  disablecontextmenu: true
  };
	var settings = {};
	
	jQuery.each(events, function (i, e) {
		if (e == 'scale' || e == 'rotate') {
			gesture_events[e] = return_target;
		}
		else if (typeof(e) == 'string') {
			stroke_events[e] = return_target;
		}
		else {
			for (i in e) {
				if (typeof(default_settings[i]) == 'undefined') {
					var h = (i == 'scale' || i == 'rotate') ? gesture_events : stroke_events;
					if (typeof(e[i]) == 'function') {
						h[i] = e[i];
					}
					else if (typeof(e[i]) == 'string'){
						h[i] = selector_maker(e[i]);
					}
				}
				else {
					settings[i] = e[i];
				}
			}
		}
	});

  settings = jQuery.extend(default_settings, settings);

	if (!jQuery.isEmptyObject(stroke_events)) {

    var topleft = 1;
    var top = 2;
    var topright = 3;
    var right = 4;
    var bottomright = 5;
    var bottom = 6;
    var bottomleft = 7;
    var left = 8;
	
		var stroke_handler = function (e) {

       var gesture = {
           target: null,
           moves: "",
           x: -1,
           y: -1,
           lastmove: "",
           continuesmode: false,
           getMoveNameAt: function(i) {
               switch (Number(this.moves.charAt(i))) {
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
           getName: function() {
       
               if (this.continuesmode && this.moves.length > 0) {
                   return this.getMoveNameAt(this.moves.length - 1);
               }
       
               if (this.moves.length == 1) {
                   return this.getMoveNameAt(0);
               }
               if (this.moves.length == 2) {
                   return this.getMoveNameAt(0) + "_" + this.getMoveNameAt(1);
               }
       
               if (this.moves.length < 7) {
       
                   if ((Number(this.moves.charAt(0)) == 4) &&
                   (Number(this.moves.charAt(this.moves.length - 1)) == 4) &&
                   (this.moves.indexOf("8") != -1)
                   ) return "scrub";
       
                   if ((Number(this.moves.charAt(0)) == 8) &&
                   (Number(this.moves.charAt(this.moves.length - 1)) == 8) &&
                   (this.moves.indexOf("4") != -1)
                   ) return "scrub";
       
               }
       
               var g = this;
               var half_close_gestures = [
               {
                   start: bottomright,
                   connect: top,
                   finish: bottomleft
               },
               {
                   start: topleft,
                   connect: bottom,
                   finish: topright
               },
               {
                   start: bottomright,
                   connect: left,
                   finish: topright
               },
               {
                   start: topleft,
                   connect: right,
                   finish: bottomleft
               }
               ];
       
               for (i in half_close_gestures) {
                   var e = half_close_gestures[i];
                   if ((Number(g.moves.charAt(0)) == e.start) &&
                   (Number(g.moves.charAt(g.moves.length - 1)) == e.finish) &&
                   (g.moves.indexOf('' + e.connect) != -1)
                   ) return 'close';
                   if ((Number(g.moves.charAt(0)) == e.finish) &&
                   (Number(g.moves.charAt(g.moves.length - 1)) == e.start) &&
                   (g.moves.indexOf('' + e.connect) != -1)
                   ) return 'close';
               };
       
               if (this.moves.length >= 7) {
                   if ((function(str) {
                       for (var i = 1; i < 8; i++) {
                           var pre = Number(str.charAt(i - 1));
                           var cur = Number(str.charAt(i));
                           if ((pre + 1 == cur) || (pre == cur + 7)) {
                               continue;
                           }
                           return false;
                       }
                       return true;
                   })(this.moves)) return "circleclockwise";
       
                   if ((function(str) {
                       for (var i = 1; i < 8; i++) {
                           var pre = Number(str.charAt(i - 1));
                           var cur = Number(str.charAt(i));
                           if ((pre == cur + 1) || (pre + 7 == cur)) {
                               continue;
                           }
                           return false;
                       }
                       return true;
                   })(this.moves)) return "circlecounterclockwise";
               }
       
               return "unknown";
           }
       };
       e.preventDefault();
       e.stopPropagation();

       if (e.button != null && settings.button.indexOf("" + e.button) == -1) return;

       gesture.target = e.target;

       // disable browser context menu.
       if (settings.disablecontextmenu) {
           $(this).bind("contextmenu",
           function(e) {
               return false;
           });
       }

       gesture.moves = "";
       gesture.x = -1;
       gesture.y = -1;
       gesture.continuesmode = settings.continuesmode;

       $(this).bind(settings.continueStroke,
       function(e) {
         	var x;
				 	var y;
				 	if (typeof(e.screenX) != 'undefined') {
						x = e.screenX;
						y = e.screenY;
					}
					else if (typeof(e.targetTouches) != 'undefined') {
						x = e.targetTouches[0].pageX;
						y = e.targetTouches[0].pageY;
					}
					else if (typeof(e.originalEvent) == 'undefined') {
						var str = '';
						for (i in e) {
							str += ', ' + i + ': ' + e[i];
						}
						console.log("don't understand x and y for " + e.type + ' event: ' + str);
					}
					else if (typeof(e.originalEvent.screenX) != 'undefined') {
						x = e.originalEvent.screenX;
						y = e.originalEvent.screenY;
					}
					else if (typeof(e.originalEvent.targetTouches) != 'undefined') {
						x = e.originalEvent.targetTouches[0].pageX;
						y = e.originalEvent.targetTouches[0].pageY;
					}
					
           if ((gesture.x == -1) && (gesture.y == -1)) {
               gesture.x = x;
               gesture.y = y;
               return;
           }
           var distance = Math.sqrt(Math.pow(x - gesture.x, 2) + Math.pow(y - gesture.y, 2));
           if (distance > settings.minDistance) {
               var angle = Math.atan2(x - gesture.x, y - gesture.y) / Math.PI + 1;
               var dir = 0;
               if (3 / 8 < angle && angle < 5 / 8) dir = 8;
               if (5 / 8 < angle && angle < 7 / 8) dir = 7;
               if (7 / 8 < angle && angle < 9 / 8) dir = 6;
               if (9 / 8 < angle && angle < 11 / 8) dir = 5;
               if (11 / 8 < angle && angle < 13 / 8) dir = 4;
               if (13 / 8 < angle && angle < 15 / 8) dir = 3;
               if (15 / 8 < angle || angle < 1 / 8) dir = 2;
               if (1 / 8 < angle && angle < 3 / 8) dir = 1;

               gesture.x = x;
               gesture.y = y;

               if (gesture.moves.length == 0) {
                   gesture.moves += dir;
                   gesture.lastmove = "" + dir;
               }
               else {
                   if (settings.repeat || (gesture.moves.charAt(gesture.moves.length - 1) != dir)) {
                       gesture.moves += dir;
                       gesture.lastmove = "" + dir;
                   }
               }
               if (settings.continuesmode && stroke_events[gesture.getName()]) {
								 var gesture_event = jQuery.Event("gesture_" + name);
		             gesture_event.gesture_data = gesture;
		             stroke_events[gesture.getName()]($(gesture.target)).trigger(gesture_event);
               }
           }
       });
    
       $(this).bind(settings.stopStroke,
       function(e) {
           if (e.button != null && settings.button.indexOf("" + e.button) == -1) return;

           if (!settings.disablecontextmenu) {
               $(this).unbind("contextmenu");
           }
           $(this).unbind(settings.continueStroke);
           if (gesture.moves.length != 0 && stroke_events[gesture.getName()]) {
						console.log(gesture.getName() + ' generated by ' + event.type + ' and event created');
						 var gesture_event = jQuery.Event("gesture_" + gesture.getName());
             gesture_event.gesture_data = gesture;
             stroke_events[gesture.getName()]($(gesture.target)).trigger(gesture_event);
           }
					else if (gesture.moves.length != 0) {
						console.log(gesture.getName() + ' generated by ' + event.type);
					}
				});
			
		};
	
		this.bind(settings.startStroke, stroke_handler);
		
	};
	
	if (!jQuery.isEmptyObject(gesture_events)) {
		
		var gesture_handler = function (e) {
    
      gesture.target = e.target;

      // disable browser context menu.
      if (settings.disablecontextmenu) {
          $(this).bind("contextmenu",
          function(e) {
              return false;
          });
      }

      gesture.moves = "";
      gesture.x = -1;
      gesture.y = -1;
      gesture.continuesmode = settings.continuesmode;

      gesture.scale = 1.0;
      gesture.rotation = 0;

      $(this).bind(settings.continueGesture,
      function(e) {
          var scale_diff = e.scale - 1.0;
          gesture.scale += scale_diff;
          if (Math.abs(gesture.scale - 1.0) >= settings.minScale) {
              gesture.name = 'scale';
              if (settings.continuesmode&& gesture_events['scale']) {
								 var gesture_event = jQuery.Event("gesture_" + 'scale');
		             gesture_event.gesture_data = gesture;
		             gesture_events['scale']($(gesture.target)).trigger(gesture_event);
                 gesture.scale = 1.0;
								 gesture.rotation = 0;
              }
          }
          e.preventDefault();
      });

	    $(this).bind(settings.stopGesture,
	    function(e) {
	      if (Math.abs(gesture.scale - 1.0) >= settings.minScale && gesture_events['scale']) {
	        gesture.name = 'scale';
				  var gesture_event = jQuery.Event("gesture_" + 'scale');
	        gesture_event.gesture_data = gesture;
	        gesture_events['scale']($(gesture.target)).trigger(gesture_event);
	      }
	      $(this).unbind(settings.continueGesture);
	    });
	
		};
		
		this.bind(settings.startGesture, gesture_handler);
		
	};
	
};