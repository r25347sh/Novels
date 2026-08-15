/**
 * 各話ページ用
 * - localStorage：開いてから約8秒後に保存（誤開防止）
 * - 表示設定（文字サイズ・背景）
 */
(function () {
  "use strict";

  const SAVE_DELAY_MS = 8000;
  const STORAGE_KEY = "kojiki_lanobe_progress_v1";
  const SETTINGS_KEY = "kojiki_lanobe_settings_v1";

  let saveTimer = null;

  function getEpisodeId() {
    const el = document.body;
    return el ? el.dataset.episodeId : null;
  }

  function scheduleSave() {
    const id = getEpisodeId();
    if (!id) return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            episodeId: id,
            savedAt: Date.now()
          })
        );
      } catch (e) {}
      saveTimer = null;
    }, SAVE_DELAY_MS);
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        applyTheme(s.theme || "light");
        applySize(s.size || "medium");
        return;
      }
    } catch (e) {}
    applyTheme("light");
    applySize("medium");
  }

  function saveSettings() {
    const theme = document.documentElement.getAttribute("data-theme") || "light";
    const size = document.documentElement.getAttribute("data-size") || "medium";
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme: theme, size: size }));
    } catch (e) {}
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll(".bg-btns button").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.bg === theme);
    });
  }

  function applySize(size) {
    document.documentElement.setAttribute("data-size", size);
    document.querySelectorAll(".size-btns button").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.size === size);
    });
  }

  function initSettingsUI() {
    const panel = document.getElementById("settings-panel");
    const openBtn = document.getElementById("settings-btn");
    const closeBtn = document.getElementById("close-settings");

    if (openBtn && panel) {
      openBtn.addEventListener("click", function () {
        panel.classList.remove("hidden");
      });
    }
    if (closeBtn && panel) {
      closeBtn.addEventListener("click", function () {
        panel.classList.add("hidden");
      });
    }
    if (panel) {
      panel.addEventListener("click", function (e) {
        if (e.target === panel) panel.classList.add("hidden");
      });
    }

    document.querySelectorAll(".size-btns button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applySize(btn.dataset.size);
        saveSettings();
      });
    });
    document.querySelectorAll(".bg-btns button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTheme(btn.dataset.bg);
        saveSettings();
      });
    });
  }

  function init() {
    loadSettings();
    initSettingsUI();
    scheduleSave();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
