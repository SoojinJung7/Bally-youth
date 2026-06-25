/* ===== BALLY BALLY — manual KR/EN i18n =====
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
    if (el.getAttribute("data-ko") === null) {
      el.setAttribute("data-ko", el.textContent);
    }
    var en = el.getAttribute("data-en");
    el.textContent = (lang === "en" && en !== null) ? en : el.getAttribute("data-ko");
  }

  function apply(next) {
    lang = (next === "en") ? "en" : "ko";
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-en]").forEach(swap);
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
