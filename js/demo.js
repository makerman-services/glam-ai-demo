(function () {
  var SESSION = "glam_session_photo";
  var FACE = "glam_session_face";
  var ALLOWED = {
    "adult-light": "img/faces/adult-light.png",
    "adult-medium": "img/faces/adult-medium.png",
    "adult-deep": "img/faces/adult-deep.png"
  };

  function params() {
    return new URLSearchParams(window.location.search);
  }

  function isReopened() {
    var q = params();
    return q.get("reopened") === "1" || q.get("saved") === "1";
  }

  function storedSrc() {
    try {
      var id = window.sessionStorage.getItem(FACE);
      if (id && ALLOWED[id]) return ALLOWED[id];
      var src = window.sessionStorage.getItem(SESSION);
      if (src && Object.values(ALLOWED).indexOf(src) !== -1) return src;
    } catch (e) {}
    return null;
  }

  function saveFace(id) {
    if (!ALLOWED[id]) return;
    try {
      window.sessionStorage.setItem(FACE, id);
      window.sessionStorage.setItem(SESSION, ALLOWED[id]);
    } catch (e) {}
  }

  function attach() {
    var fig = document.getElementById("session-photo");
    var img = document.getElementById("photo-portrait");
    var note = document.getElementById("reopened-no-photo");
    if (isReopened()) {
      if (fig) fig.remove();
      if (img) img.remove();
      if (note) note.hidden = false;
      return;
    }
    var src = storedSrc();
    if (src && img) {
      img.src = src;
      img.alt = "Synthetic, code-drawn sample face. Not a real person.";
      if (fig) fig.hidden = false;
    } else if (fig) {
      fig.hidden = true;
    }
  }

  function bindSamples() {
    document.querySelectorAll("[data-sample-face]").forEach(function (el) {
      el.addEventListener("click", function (ev) {
        ev.preventDefault();
        var id = el.getAttribute("data-sample-face");
        saveFace(id);
        var href = el.getAttribute("href") || "analysis.html";
        window.location.href = href;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      attach();
      bindSamples();
    });
  } else {
    attach();
    bindSamples();
  }
})();
