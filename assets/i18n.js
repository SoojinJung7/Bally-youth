/* ===== BALLY JUNIOR — manual KR/EN i18n =====
   Translatable elements carry a data-en="..." attribute holding the English
   text. The original Korean is captured into data-ko on first run. Toggling
   swaps textContent between the two and persists the choice in localStorage.

   Dynamically-rendered nodes (works/news cards): the renderer sets data-en on
   the node it creates, then calls window.BallyI18n.apply() so the new nodes
   pick up the current language. */
(function () {
  "use strict";
  var KEY = "bally-lang";
  var lang = localStorage.getItem(KEY) || "ko";

  function swap(el) {
    // innerHTML so translations can include simple inline markup (e.g. <br>).
    // All data-en / data-ko values are author-controlled — no user input.
    if (el.hasAttribute("data-en")) {
      if (el.getAttribute("data-ko") === null) {
        el.setAttribute("data-ko", el.innerHTML);
      }
      el.innerHTML = (lang === "en") ? el.getAttribute("data-en") : el.getAttribute("data-ko");
    }
    // placeholder translation for form fields
    if (el.hasAttribute("data-en-ph")) {
      if (el.getAttribute("data-ko-ph") === null) {
        el.setAttribute("data-ko-ph", el.getAttribute("placeholder") || "");
      }
      el.setAttribute("placeholder", (lang === "en") ? el.getAttribute("data-en-ph") : el.getAttribute("data-ko-ph"));
    }
  }

  function apply(next) {
    lang = (next === "en") ? "en" : "ko";
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-en], [data-en-ph]").forEach(swap);
    document.querySelectorAll(".lang").forEach(function (b) {
      b.textContent = (lang === "en") ? "EN" : "KR";
    });
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  // exposed so JS-rendered content can re-apply after injecting nodes
  window.BallyI18n = {
    apply: function () { apply(lang); },
    get: function () { return lang; },
    toggle: function () { apply(lang === "en" ? "ko" : "en"); }
  };

  document.addEventListener("DOMContentLoaded", function () {
    apply(lang);
    document.querySelectorAll(".lang").forEach(function (b) {
      b.addEventListener("click", function () { apply(lang === "en" ? "ko" : "en"); });
    });
  });
})();

/* ===== Casual media-save deterrent =====
   Blocks right-click / long-press save, image drag, and the video
   download button. NOT foolproof — a determined user can still pull
   media via dev tools / network tab — but it stops the casual copy. */
(function () {
  "use strict";
  // block right-click & mobile long-press context menu site-wide
  document.addEventListener("contextmenu", function (e) { e.preventDefault(); }, false);

  // CSS: disable touch-callout, drag, and the native download control
  var st = document.createElement("style");
  st.textContent =
    "img,video{-webkit-touch-callout:none;-webkit-user-drag:none;user-select:none;}" +
    "video::-webkit-media-controls-download-button{display:none!important;}" +
    "video::-internal-media-controls-download-button{display:none!important;}";
  (document.head || document.documentElement).appendChild(st);

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img, video").forEach(function (el) {
      el.setAttribute("draggable", "false");
      el.addEventListener("dragstart", function (e) { e.preventDefault(); });
    });
    document.querySelectorAll("video").forEach(function (v) {
      v.setAttribute("controlsList", "nodownload");
      v.setAttribute("disablePictureInPicture", "");
    });
  });
})();
