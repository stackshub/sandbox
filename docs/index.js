window.onload = function() {
  var canvas = document.getElementById('mainCanvas');
  var context = canvas.getContext('2d');
  var shareButtonRect = new Rect(250, 10, 100, 50);

  (function() {
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '20px sans-serif';
    context.lineWidth = 1;
    context.strokeStyle = 'white';
    addTouchStartListener(canvas, onTouchStart);
    paint();
  })();

  function onTouchStart(x, y) {
    if (shareButtonRect.contains(x, y)) {
      commandShare();
    }
  }

  function commandShare() {
    if (navigator.share) {
      alert('navigator.share');
      navigator
        .share({
          title: 'no title',
          text: document.title,
          url: location.href
        })
        .then(function() {})
        .catch(function(err) {
          alert(err);
        });
      return;
    }
    alert('mailto');
    location.href =
      'mailto:?subject=' +
      encodeURIComponent(document.title) +
      '&body=' +
      encodeURIComponent(location.href);
  }

  function paint() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    paintButton('Share', shareButtonRect);
  }

  function paintButton(text, rect) {
    context.strokeRect(rect.left, rect.top, rect.width, rect.height);
    context.fillText(text, rect.centerX(), rect.centerY());
  }
};

function addTouchStartListener(target, listener) {
  target.addEventListener(
    'mousedown',
    function(event) {
      preventEvent(event);
      if (!target.touchFirst) {
        var rect = event.target.getBoundingClientRect();
        listener(event.clientX - rect.left, event.clientY - rect.top);
      }
    },
    false
  );
  target.addEventListener(
    'touchstart',
    function(event) {
      preventEvent(event);
      target.touchFirst = true;
      var rect = event.target.getBoundingClientRect();
      for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        listener(touch.clientX - rect.left, touch.clientY - rect.top);
      }
    },
    false
  );
}

function preventEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

function Rect(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;
}

Rect.prototype.right = function() {
  return this.left + this.width;
};

Rect.prototype.bottom = function() {
  return this.top + this.height;
};

Rect.prototype.centerX = function() {
  return this.left + this.width / 2;
};

Rect.prototype.centerY = function() {
  return this.top + this.height / 2;
};

Rect.prototype.contains = function(x, y) {
  return (
    x >= this.left && x < this.right() && y >= this.top && y < this.bottom()
  );
};
