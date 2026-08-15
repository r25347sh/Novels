/**
 * トップページ用 — 前回の続きバナー
 */
(function () {
  "use strict";

  const STORAGE_KEY = "kojiki_lanobe_progress_v1";

  const EPISODE_MAP = {
    "01": "episodes/01.html",
    "02": "episodes/02.html",
    "03": "episodes/03.html",
    "04": "episodes/04.html",
    "05": "episodes/05.html",
    "06": "episodes/06.html",
    "07": "episodes/07.html",
    "08": "episodes/08.html",
    "09": "episodes/09.html",
    "10": "episodes/10.html",
    "11": "episodes/11.html",
    "12": "episodes/12.html",
    "13": "episodes/13.html",
    "14": "episodes/14.html",
    "15": "episodes/15.html",
    "16": "episodes/16.html"
  };

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data && data.episodeId && EPISODE_MAP[data.episodeId]) {
        return data;
      }
    } catch (e) {}
    return null;
  }

  function init() {
    const progress = loadProgress();
    const banner = document.getElementById("continue-banner");
    const link = document.getElementById("continue-link");
    const dismiss = document.getElementById("dismiss-continue");

    if (progress && banner && link) {
      link.href = EPISODE_MAP[progress.episodeId];
      banner.classList.remove("hidden");
    }

    if (dismiss) {
      dismiss.addEventListener("click", function () {
        if (banner) banner.classList.add("hidden");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
