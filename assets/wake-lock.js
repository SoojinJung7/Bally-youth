/*
 * wake-lock.js — 태블릿/키오스크 화면 꺼짐 방지
 * 이 스크립트를 불러온 페이지가 화면에 떠 있는 동안 기기가 잠들지 않게 유지한다.
 *
 * 1순위: Screen Wake Lock API (삼성 인터넷 14+, Chrome 84+ 등 최신 브라우저)
 * 2순위: 위 API가 없을 때 보이지 않는 무음 반복 영상으로 화면을 깨워둔다 (구형 폴백)
 *
 * HTTPS(보안 컨텍스트)에서만 Wake Lock API가 동작한다. bally-junior.com은 HTTPS라 OK.
 */
(function () {
  "use strict";

  var wakeLock = null;

  function requestWakeLock() {
    if (!("wakeLock" in navigator)) {
      startVideoFallback();
      return;
    }
    // 화면이 보일 때만 요청 가능
    if (document.visibilityState !== "visible") return;

    navigator.wakeLock
      .request("screen")
      .then(function (lock) {
        wakeLock = lock;
        // OS가 잠금을 해제하면(예: 전원 버튼) 다시 잡을 수 있게 기록만 해둔다
        lock.addEventListener("release", function () {
          wakeLock = null;
        });
      })
      .catch(function () {
        // 사용자 제스처 필요 등으로 실패하면 폴백으로 전환
        startVideoFallback();
      });
  }

  // 탭이 백그라운드로 갔다가 다시 보이면 Wake Lock이 자동 해제되므로 재요청
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && wakeLock === null) {
      requestWakeLock();
    }
  });

  // 일부 브라우저는 첫 사용자 제스처 이후에만 허용 → 첫 터치/클릭 때 한 번 더 시도
  function onFirstGesture() {
    if (wakeLock === null) requestWakeLock();
  }
  document.addEventListener("click", onFirstGesture, { once: true });
  document.addEventListener("touchstart", onFirstGesture, { once: true, passive: true });

  // ── 폴백: 보이지 않는 무음 반복 영상 (Wake Lock API 미지원 구형 대비) ──
  var fallbackStarted = false;
  function startVideoFallback() {
    if (fallbackStarted) return;
    fallbackStarted = true;

    var video = document.createElement("video");
    video.setAttribute("muted", "");
    video.muted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("loop", "");
    video.style.cssText =
      "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:0;top:0;";

    // 1프레임짜리 초소형 무음 mp4 (data URI) — 외부 파일 불필요
    var src = document.createElement("source");
    src.type = "video/mp4";
    src.src =
      "data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAA" +
      "Gm1kYXQAAAGzABAHAAABthBgUYI9t+8AAAMNbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6A" +
      "AAAAAAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAA" +
      "AAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAB9HRyYWsA" +
      "AABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAA" +
      "AAAEAAAAAAAAAAAAAAAAAAEAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
      "AAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    video.appendChild(src);
    document.documentElement.appendChild(video);

    var tryPlay = function () {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    };
    tryPlay();
    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("touchstart", tryPlay, { once: true, passive: true });
  }

  // 최초 시도
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", requestWakeLock);
  } else {
    requestWakeLock();
  }
})();
