// Export hotkeys for every sketch (do not bind these keys in sketch code):
//   s  save the canvas as PNG
//   g  save a 5-second GIF
//   v  start / stop video recording (p5.capture, webm)
// Uses a plain document listener so sketches stay free to define keyPressed().
(function () {
  var CAPTURE_URL = "https://cdn.jsdelivr.net/npm/p5.capture@1.6.1/dist/p5.capture.umd.js";

  // p5.capture hooks into p5's "init", so it has to load before the window load
  // event that starts global mode. A script injected here (during parsing) delays
  // that event until it has loaded.
  var captureScript = document.createElement("script");
  captureScript.src = CAPTURE_URL;
  captureScript.onload = function () {
    P5Capture.setDefaultOptions({ disableUi: true, format: "webm", framerate: 60 });
  };
  captureScript.onerror = function () {
    console.warn("[export] could not load p5.capture; video recording disabled");
  };
  document.head.appendChild(captureScript);

  var gifBusy = false;

  function stamp() {
    var d = new Date();
    var p = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" +
      p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
  }

  function baseName() {
    var parts = location.pathname.split("/").filter(Boolean);
    var last = parts[parts.length - 1];
    if (last && /\.html?$/.test(last)) parts.pop();
    return (parts[parts.length - 1] || "sketch") + "-" + stamp();
  }

  function toggleVideo() {
    if (typeof P5Capture === "undefined" || !P5Capture.getInstance()) {
      console.warn("[export] p5.capture is not ready");
      return;
    }
    var capture = P5Capture.getInstance();
    if (capture.state === "idle") {
      capture.start({ baseFilename: function () { return baseName(); } });
      console.log("[export] recording video... press v to stop");
    } else if (capture.state === "capturing") {
      capture.stop();
      console.log("[export] encoding video...");
    } else {
      console.log("[export] still encoding, please wait");
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    var el = e.target;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    if (typeof saveCanvas !== "function") return; // p5 not running in global mode

    var key = e.key.toLowerCase();
    if (key === "s") {
      saveCanvas(baseName(), "png");
    } else if (key === "g") {
      if (gifBusy) return console.log("[export] GIF already in progress");
      gifBusy = true;
      console.log("[export] recording 5s GIF...");
      Promise.resolve(saveGif(baseName(), 5)).finally(function () { gifBusy = false; });
    } else if (key === "v") {
      toggleVideo();
    }
  });
})();
