// Polyfill for browsers which haven't implemented Uint8ClampedArray.prototype.reduce
(function() {

  if (typeof Uint8ClampedArray.prototype.reduce === 'undefined') {
  
    Uint8ClampedArray.prototype.reduce = Array.prototype.reduce;
    
  }
    
})();

// SnapReduce constructor
function SnapReduce (video, callback) {

  var STALL_THRESHOLD = 0;
  var CANVAS_SCALE = .05;
  var SAMPLE_INTERVAL = 500;
  var _video = document.getElementById(video);
  var _imgData = null;
  var _stallCount = 0;
  var _canvas;
  var _context;
  var _timer;
      
  var initCanvas = (function () {
  
    var el, parent;
    
    el = document.createElement('canvas');
    parent = _video.parentNode;
    _canvas = parent.appendChild(el);
    _context = _canvas.getContext('2d');
    
    return _context;
  
  })();

  var canvasSize = (function () {
  
    var w, h, ratio;
    
    w = _video.videoWidth || 640;
    h = _video.videoHeight || 480;
    
    ratio = w / h;
    w *= CANVAS_SCALE;
    h = w / ratio;
    
    _canvas.width = w;
    _canvas.height = h;
  
    return {
      height : h,
      width : w
    }
  
  })();
  
  var getSampleInterval = function () {
  
    return SAMPLE_INTERVAL;
  
  }
  
  var clearStallCount = function () {
  
    _stallCount = 0;
    return _stallCount;
  
  }
  
  var getVideoData = function () {
  
    var w = canvasSize.width,
        h = canvasSize.height;
  
    _context.drawImage(_video, 0, 0, w, h);
    return _context.getImageData(0, 0, w, h);
    
  }
  
  var processData = function (img) {

    return img.data.reduce(function(a, b) {return a + b;});

  }
  
  var snap = function () {
  
    var arto = processData( getVideoData() );
    
    if (_imgData === null) {
    
      srlog.value += "\n[SnapReduce].snap(): Init...";
      _imgData = arto;
      
      return _imgData;
    
    }
    
    if (_imgData === arto) {
    
      ++_stallCount;
      _imgData = arto;
      
      if (_stallCount > STALL_THRESHOLD) {
        
        if (typeof callback === 'function') {
        
          callback.call( null, { stallCount: _stallCount, src: _video.currentSrc } );
        
        }
        
      }

      return _stallCount;
      
    } else {
    
      srlog.value += ('\n[SnapReduce].snap(): ' + arto)
      _imgData = arto;
      
      return arto;
    
    }
    
  }
  
  this.run = snap;
  this.timer = _timer;
  this.resetStallCount = clearStallCount;
  this.sampleInterval = getSampleInterval();

}

SnapReduce.prototype.start = function () {
  
    srlog.value += ("\n[SnapReduce].start()");
    
    this.timer = setInterval(this.run, this.sampleInterval);
  
}
  
SnapReduce.prototype.stop = function () {
  
    srlog.value += ("\n[SnapReduce].stop()");
   
    this.resetStallCount();
    clearInterval(this.timer);

}
