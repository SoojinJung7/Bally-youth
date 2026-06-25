/* ===== BALLY BALLY — interactions ===== */
(function () {
  "use strict";

  // ----- Data (original placeholder content) -----
  var works = [
    { num: "01", cat: "Soccer / Futsal", name: "축구 / 풋살", en: "Soccer / Futsal", url: "application/sports/soccer.html", grad: "linear-gradient(135deg,#FF5F14,#C90404)" },
    { num: "02", cat: "Basketball", name: "농구", en: "Basketball", url: "application/sports/basketball.html", grad: "linear-gradient(135deg,#C90404,#1A1919)" },
    { num: "03", cat: "Badminton / Pickleball", name: "배드민턴 / 피클볼", en: "Badminton / Pickleball", url: "application/sports/badminton.html", grad: "linear-gradient(135deg,#FF5F14,#1A1919)" },
    { num: "04", cat: "Inline / Fitness", name: "인라인 / 생활체육", en: "Inline / Fitness", url: "application/sports/inline.html", grad: "linear-gradient(135deg,#1A1919,#FF5F14)" },
    { num: "05", cat: "Pilates", name: "키즈 필라테스", en: "Kids Pilates", url: "application/sports/pilates.html", grad: "linear-gradient(135deg,#C90404,#FF5F14)" },
    { num: "06", cat: "Dance", name: "키즈 방송댄스", en: "Kids K-Pop Dance", url: "application/sports/dance.html", grad: "linear-gradient(135deg,#1A1919,#C90404)" }
  ];

  // ----- Render works -----
  var wg = document.getElementById("worksGrid");
  works.forEach(function (w) {
    var a = document.createElement("a");
    a.className = "work";
    a.href = w.url || "#";
    if (w.url) { a.target = "_blank"; a.rel = "noopener"; }
    a.style.setProperty("--grad", w.grad);
    a.innerHTML =
      '<span class="work-num">' + w.num + "</span>" +
      '<div class="work-info">' +
      '<div class="work-cat">' + w.cat + "</div>" +
      '<div class="work-name" data-en="' + w.en + '">' + w.name + "</div>" +
      '<div class="work-go" data-en="View →">소개 보기 →</div></div>';
    wg.appendChild(a);
  });
  if (window.BallyI18n) window.BallyI18n.apply();

  // ----- BALLY NEWS cards (pink carousel, SM-benchmarked) -----
  (function initBallyNews() {
    var track = document.getElementById("bnewsTrack");
    if (!track) return;

    var news = [
      { title: "발리 유소년 여름 스포츠 프로모션 시작", titleEn: "BALLY JUNIOR Summer Sports Promotion", body: "축구·농구·배드민턴·필라테스·방송댄스 전 종목 여름 특별 프로모션을 진행합니다. 신규 등록 회원 대상 혜택을 확인하세요.", bodyEn: "A special summer promotion across every program — soccer, basketball, badminton, Pilates, and dance. See the benefits for newly enrolled members.", date: "2026.06.21", url: "application/promotion.html" },
      { title: "키즈 필라테스 신규 클래스 오픈", titleEn: "New Kids Pilates Class Open", body: "성장기 바른 자세와 코어 근력을 위한 키즈 필라테스 클래스가 새롭게 열립니다. 전문 강사진과 함께 시작하세요.", bodyEn: "A new Kids Pilates class for healthy posture and core strength during the growth years. Start with our expert instructors.", date: "2026.06.14", url: "application/sports/pilates.html" },
      { title: "키즈 방송댄스, 신규 안무 클래스 공개", titleEn: "New Kids K-Pop Dance Choreography Class", body: "최신 K-POP 안무로 구성된 키즈 방송댄스 새 클래스를 공개합니다. 리듬감과 표현력을 함께 키워요.", bodyEn: "A new Kids K-Pop dance class built on the latest choreography. Grow rhythm and expression together.", date: "2026.06.07", url: "application/sports/dance.html" },
      { title: "농구 클래스 회원 모집 안내", titleEn: "Basketball Class Member Recruitment", body: "기본기부터 실전 경기 감각까지, 체계적인 커리큘럼의 농구 클래스 회원을 모집합니다.", bodyEn: "From fundamentals to real-game sense — now recruiting members for our structured basketball class.", date: "2026.05.30", url: "application/sports/basketball.html" },
      { title: "축구 · 풋살 정규 클래스 일정 업데이트", titleEn: "Soccer · Futsal Class Schedule Update", body: "여름 시즌 축구·풋살 정규 클래스 시간표가 업데이트되었습니다. 스케줄을 확인하고 신청하세요.", bodyEn: "The summer soccer and futsal class timetable has been updated. Check the schedule and sign up.", date: "2026.05.22", url: "application/sports/soccer.html" }
    ];

    news.forEach(function (n) {
      var a = document.createElement("a");
      a.className = "bnews-card";
      a.href = n.url || "#";
      if (n.url) { a.target = "_blank"; a.rel = "noopener"; }
      a.innerHTML =
        '<h3 class="bnews-card-title" data-en="' + n.titleEn + '">' + n.title + "</h3>" +
        '<p class="bnews-card-body" data-en="' + n.bodyEn + '">' + n.body + "</p>" +
        '<div class="bnews-card-foot">' +
        '<span class="bnews-card-go" aria-hidden="true">→</span>' +
        '<span class="bnews-card-date">' + n.date + "</span>" +
        "</div>";
      track.appendChild(a);
    });
    if (window.BallyI18n) window.BallyI18n.apply();

    function stepWidth() {
      var card = track.querySelector(".bnews-card");
      if (!card) return 320;
      var styles = getComputedStyle(track);
      var gap = parseInt(styles.columnGap || styles.gap, 10) || 28;
      return card.getBoundingClientRect().width + gap;
    }
    var prev = document.getElementById("bnewsPrev");
    var next = document.getElementById("bnewsNext");
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -stepWidth(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: stepWidth(), behavior: "smooth" }); });
  })();

  // ----- Hero slideshow (data-driven from assets/slides.json) -----
  (function initSlideshow() {
    var stage = document.getElementById("heroSlideshow");
    if (!stage) return;

    var FALLBACK = {
      intervalMs: 3000,
      slides: [
        { src: "assets/slides/slide-1.jpg", alt: "" },
        { src: "assets/slides/slide-2.jpg", alt: "" },
        { src: "assets/slides/slide-3.jpg", alt: "" }
      ]
    };

    fetch("assets/slides.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(build)
      .catch(function () { build(FALLBACK); });

    function build(cfg) {
      var slides = (cfg && cfg.slides) || [];
      if (!slides.length) return;
      var interval = (cfg && cfg.intervalMs) || 3000;

      var els = slides.map(function (s, i) {
        var div = document.createElement("div");
        div.className = "hero-slide" + (i === 0 ? " active" : "");
        div.style.backgroundImage = 'url("' + s.src + '")';
        div.setAttribute("role", "img");
        if (s.alt) div.setAttribute("aria-label", s.alt);
        stage.appendChild(div);
        // preload
        var img = new Image();
        img.src = s.src;
        return div;
      });

      // indicator dots
      var dots = document.createElement("div");
      dots.className = "hero-dots";
      var dotEls = slides.map(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "슬라이드 " + (i + 1));
        if (i === 0) b.className = "active";
        b.addEventListener("click", function () { go(i); restart(); });
        dots.appendChild(b);
        return b;
      });
      stage.parentNode.appendChild(dots);

      var current = 0, timer = null;
      function go(n) {
        els[current].classList.remove("active");
        dotEls[current].classList.remove("active");
        current = (n + els.length) % els.length;
        els[current].classList.add("active");
        dotEls[current].classList.add("active");
      }
      function next() { go(current + 1); }
      function start() {
        if (els.length > 1) timer = setInterval(next, interval);
      }
      function restart() { clearInterval(timer); start(); }
      start();

      // pause when tab is hidden
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) clearInterval(timer);
        else restart();
      });
    }
  })();

  // ----- BALLY NEWS playlist (auto-advance + synced title/caption) -----
  (function initNews() {
    var video = document.getElementById("newsVideo");
    var titleEl = document.getElementById("newsTitle");
    var bodyEl = document.getElementById("newsBody");
    var indexEl = document.getElementById("newsIndex");
    var dotsEl = document.getElementById("newsDots");
    if (!video || !titleEl || !bodyEl) return;

    fetch("assets/news.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (cfg) { build((cfg && cfg.items) || []); })
      .catch(function () {/* leave static fallback content as-is */});

    function build(items) {
      if (!items.length) return;
      var current = 0;
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };

      // indicator dots
      var dotEls = items.map(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "영상 " + (i + 1));
        b.addEventListener("click", function () { load(i, true); });
        dotsEl.appendChild(b);
        return b;
      });

      function paintMeta(i) {
        var it = items[i];
        // fade text out/in for a smooth swap
        titleEl.classList.add("news-fading");
        bodyEl.classList.add("news-fading");
        setTimeout(function () {
          var en = window.BallyI18n && window.BallyI18n.get() === "en";
          titleEl.setAttribute("data-ko", it.title || "");
          titleEl.setAttribute("data-en", it.titleEn || it.title || "");
          bodyEl.setAttribute("data-ko", it.caption || "");
          bodyEl.setAttribute("data-en", it.captionEn || it.caption || "");
          titleEl.textContent = en ? titleEl.getAttribute("data-en") : titleEl.getAttribute("data-ko");
          bodyEl.textContent = en ? bodyEl.getAttribute("data-en") : bodyEl.getAttribute("data-ko");
          indexEl.textContent = pad(i + 1) + " / " + pad(items.length);
          titleEl.classList.remove("news-fading");
          bodyEl.classList.remove("news-fading");
        }, 200);
        dotEls.forEach(function (d, di) { d.classList.toggle("active", di === i); });
      }

      function load(i, autoplay) {
        current = (i + items.length) % items.length;
        var it = items[current];
        video.src = it.src;
        video.load();
        paintMeta(current);
        if (autoplay) {
          var p = video.play();
          if (p && p.catch) p.catch(function () {/* autoplay blocked — user can press play */});
        }
      }

      // when a clip ends, immediately continue to the next one
      video.addEventListener("ended", function () { load(current + 1, true); });

      // initial clip (no autoplay yet — starts when scrolled into view)
      load(0, false);

      // muted autoplay once the section is visible (mobile-friendly)
      if ("IntersectionObserver" in window) {
        var started = false;
        var vio = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting && !started) {
                started = true;
                var p = video.play();
                if (p && p.catch) p.catch(function () {});
              }
            });
          },
          { threshold: 0.5 }
        );
        vio.observe(video);
      }
    }
  })();

  // ----- Sticky header on scroll -----
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ----- Mobile menu -----
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // ----- Language toggle is handled by assets/i18n.js -----

  // ----- Suppress transition flicker while resizing -----
  var root = document.documentElement;
  var resizeEnd;
  window.addEventListener("resize", function () {
    root.classList.add("is-resizing");
    clearTimeout(resizeEnd);
    resizeEnd = setTimeout(function () {
      root.classList.remove("is-resizing");
    }, 200);
    // leaving mobile width: make sure the menu isn't stuck open
    if (window.innerWidth > 880 && nav.classList.contains("open")) {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  }, { passive: true });

  // ----- Reveal on scroll -----
  var revealEls = document.querySelectorAll(".card, .work");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e, i) {
          if (e.isIntersecting) {
            setTimeout(function () { e.target.classList.add("in"); }, i * 80);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // ----- Animated counters -----
  var counters = document.querySelectorAll(".stat-num");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var statIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCounter(e.target); statIO.unobserve(e.target); }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) { statIO.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  // ----- Year -----
  var yr = document.getElementById("year");
  if (yr) yr.textContent = "2026";
})();
