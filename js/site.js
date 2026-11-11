(function () {
  "use strict";

  var body = document.body;
  var toggle = document.querySelector(".menu-toggle");
  var drawer = document.querySelector(".drawer");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
      if (drawer) drawer.setAttribute("aria-hidden", open ? "false" : "true");
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && body.classList.contains("menu-open")) {
      body.classList.remove("menu-open");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "打开菜单");
        toggle.focus();
      }
    }
  });

  document.querySelectorAll(".filters").forEach(function (group) {
    if (group.hasAttribute("data-collect-filter")) return;
    var buttons = group.querySelectorAll(".filter-btn");
    var targetSel = group.getAttribute("data-target");
    var items = targetSel ? document.querySelectorAll(targetSel) : [];

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter") || "all";
        buttons.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        items.forEach(function (item) {
          var cat = item.getAttribute("data-cat") || "";
          var show = filter === "all" || cat === filter;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  });


  var collectTools = document.querySelector("[data-collect]");
  if (collectTools) {
    var collectItems = Array.prototype.slice.call(document.querySelectorAll(".collect-grid .collect-item"));
    var catButtons = collectTools.querySelectorAll('[data-collect-filter="cat"] .filter-btn');
    var kindButtons = collectTools.querySelectorAll('[data-collect-filter="kind"] .filter-btn');
    var searchInput = collectTools.querySelector(".collect-search input");
    var emptyNote = document.querySelector(".collect-empty");
    var collectGrid = document.querySelector(".collect-grid");
    var collectCat = "all";
    var collectKind = "all";

    function collectBlob(item) {
      var title = item.querySelector("h3");
      var why = item.querySelector(".collect-item__why");
      var src = item.querySelector(".collect-item__src");
      return [
        item.getAttribute("data-slug") || "",
        item.getAttribute("data-kind") || "",
        item.getAttribute("data-kind-label") || "",
        title ? title.textContent : "",
        src ? src.textContent : "",
        why ? why.textContent : ""
      ].join("\n").toLowerCase();
    }

    function applyCollectFilters() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var visible = 0;
      collectItems.forEach(function (item) {
        var cat = item.getAttribute("data-cat") || "";
        var kind = item.getAttribute("data-kind") || "";
        var catOk = collectCat === "all" || cat === collectCat;
        var kindOk = collectKind === "all" || kind === collectKind;
        var searchOk = !query || collectBlob(item).indexOf(query) !== -1;
        var show = catOk && kindOk && searchOk;
        item.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      if (emptyNote) emptyNote.hidden = visible !== 0;
      if (collectGrid) collectGrid.classList.toggle("is-empty", visible === 0);
    }

    catButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        collectCat = btn.getAttribute("data-filter") || "all";
        catButtons.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        applyCollectFilters();
      });
    });

    kindButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = btn.getAttribute("data-kind") || "all";
        collectKind = collectKind === next ? "all" : next;
        kindButtons.forEach(function (b) {
          var on = (b.getAttribute("data-kind") || "") === collectKind;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        applyCollectFilters();
      });
    });

    if (searchInput) searchInput.addEventListener("input", applyCollectFilters);
  }


})();
