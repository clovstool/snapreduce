var _events = [
        "loadstart",
        "progress",
        "suspend",
        "abort",
        "error",
        "emptied",
        "stalled",
        "play",
        "pause",
        "loadedmetadata",
        "loadeddata",
        "waiting",
        "playing",
        "canplay",
        "canplaythrough",
        "seeking",
        "seeked",
        "timeupdate",
        "ended",
        "ratechange",
        "resize",
        "durationchange",
        "volumechange"          
];

// SnapReduce onStall callback
var handleStall = function (o) {

  var stalls = o.stallCount,
      vidSrc = o.src;
      
  srlog.value += ("\n[SnapReduce].onStall: STALLED(" + stalls + ")\n-->" + vidSrc);

}

document.addEventListener("DOMContentLoaded", function (event) {

    var timer = document.getElementById("time"); // Log elapsed time
    var logWin = document.getElementById("tlog"); // Log video events
    var srlog = document.getElementById("srlog"); // Log snapreduce actions
    var sr;
    
    
    var timerRefresh = function () {
    
      timer.textContent = vtag.currentTime.toFixed(2);

    }
    
    var handleEvents = function (event) {
    
      var _msg = event;
      
      return function() {
      
        logWin.value += ("\n" + _msg);

        if (_msg === "timeupdate" || _msg === "durationchange") {
        
          timerRefresh();
          
        }
        
        if (_msg === "play") {
        
          if(!sr) {
          
            sr = new SnapReduce('vtag', handleStall);
            
          };
          
          sr.start();
        
        } else if (_msg === "pause" || _msg === "end") {
        
          sr.stop();
        
        }

      }
    
    }

    if (vtag.addEventListener) {
    
        for (var i = 0; i < _events.length; i++) {
        
            vtag.addEventListener(
                _events[i], 
                handleEvents(_events[i]),
                false);
                
        }
    
    }
    
    return 1;
    
});


// Toggle canvas visibility
var toggle = function () {

  var panel = document.getElementById('panel');
  var panelView = panel.style;


  if (panelView.display === "" || panelView.display === "block") {
    panelView.display = "none";
  
  } else {
    panelView.display = "block";
  
  }
  
  return panelView.display; 
  
}
