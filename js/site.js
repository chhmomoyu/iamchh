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
      return [
        item.getAttribute("data-slug") || "",
        item.getAttribute("data-kind") || "",
        item.getAttribute("data-kind-label") || "",
        title ? title.textContent : "",
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

  var works = {
    hud: {
      title: "小游戏界面",
      sub: "战斗状态与血条设计",
      cat: "游戏前端",
      image: "assets/hud.png",
      alt: "深色科幻风战斗界面示意，圆形仪表与金色刻度",
      body: [
        "这是一件为站点作品集准备的示意项目，用来呈现战斗界面中的状态与血条设计，并不代表已经对外发布的真实作品。",
        "画面围绕圆形仪表展开：中心锚点、分层刻度、两侧信息面板和角部定位饰件，用来表达战斗中需要被快速读取的关键数值。金色只作为强调，避免干扰主视觉。",
        "如果后续落到真实项目里，这类界面通常会和血量、护盾、技能冷却等数据绑定，并由日志或调试接口辅助验收。"
      ]
    },
    editor: {
      title: "工具小窗口",
      sub: "编辑器工具与参数面板",
      cat: "游戏前端",
      image: "assets/editor.png",
      alt: "深色编辑器小窗口示意，左侧代码与右侧工具栏",
      body: [
        "这是一件示意项目，用来展示编辑器工具小窗口和参数面板的排布，不是已发布的产品截图。",
        "窗口里是参数绑定、滑动条和开关一类的编辑器工作流。目标是让调参发生在一个克制的小面板里，而不是散落在完整 IDE 中。",
        "这类工具适合和游戏运行时并排使用：改一处参数，立刻在画面里看到结果。"
      ]
    },
    practice: {
      title: "练习页面",
      sub: "参数调试与动效练习",
      cat: "练习",
      image: "assets/grid.png",
      alt: "深色网格练习页示意，节点与金色锚点分布在格子上",
      body: [
        "这是一件示意练习，用来放参数调试和动效试验，不作为已完成的上线功能。",
        "网格提供对齐和节奏；空心控制点和金色锚点用来标记关键位置。右上角的斜向高光是为了让画面有一层轻微的玻璃感。",
        "练习页的价值在于可以单独打开、反复微调，而不必每次都进入完整关卡。"
      ]
    },
    toolchain: {
      title: "Cocos Creator 3D 引擎工具链",
      sub: "性能分析、可视化调试、构建优化工具集",
      cat: "游戏前端",
      image: "assets/nodes.png",
      alt: "节点连线示意图，表示工具链中的多个处理步骤",
      body: [
        "这是一件示意项目，概括性能分析、可视化调试和构建优化可能组成的工具链，并非已发布的完整工具集。",
        "用节点和连线表达数据从采集、过滤到输出的路径。每个节点只保留必要的标题和接口，强调结构而不是装饰。",
        "真实落地时，这类工具更适合作为可复用的命令行或编辑器插件，并为验收提供可执行的输出。"
      ]
    },
    codegen: {
      title: "Prompt 驱动的 UI 代码生成器",
      sub: "从自然语言到 Cocos TS + UI 组件",
      cat: "AI 辅助开发",
      image: "assets/code.png",
      alt: "深色代码编辑画面示意，高亮一行与生成 UI 相关的调用",
      body: [
        "这是一件示意项目，用来表达从自然语言描述生成 Cocos TypeScript 与 UI 组件的方向，不是已经对外提供的生成器。",
        "图中的代码只是版式占位：输入一句界面描述，再落到可编辑的组件结构上。关键不在一次生成完毕，而在结果可以被人继续改。",
        "如果投入使用，生成结果需要配套验收：打开页面、核对层级和交互，而不是只看提示词是否写得完整。"
      ]
    },
    shader: {
      title: "Shader 效果库与编辑器插件",
      sub: "粒子特效、溶解、描边、后处理集合",
      cat: "游戏前端",
      image: "assets/shader.png",
      alt: "金色与橙色粒子迸发的抽象特效示意",
      body: [
        "这是一件示意项目，用来展示粒子、溶解、描边和后处理一类效果的集合感，并不代表已经整理完成的效果库。",
        "画面采用金色粒子云，作为特效方向的视觉索引，而不是某一条具体shader的还原。",
        "效果类资产如果要进入项目，通常还需要参数面板、预览场景，以及在真机或预览页里的实际验收。"
      ]
    }
  };

  var posts = {
    "acceptance-scripts": {
      title: "用自动化脚本给 Cocos 构建「可执行的验收」",
      date: "2026-10-18",
      tag: "示意笔记",
      body: [
        "这是一篇示意文章，用来展示博客页的阅读版式，并不代表已经正式发布的原文。",
        "写功能时只看代码，很难确认界面里的按钮、动效和状态切换是否真的成立。更稳妥的做法，是让验收留下可以再次执行的证据：脚本、日志、截图，或一次真实的页面走查。",
        "对游戏前端来说，画布里的控件往往不是普通 DOM。自动化如果只识别网页按钮，会漏掉最关键的交互。这时可以配合游戏日志、调试接口，或基于画面的核对，把「点过了」和「真正成功」分开。",
        "这篇文章在站点里只作为结构示意。若以后写正式笔记，会从具体的验收步骤和失败案例写起。"
      ]
    },
    "hp-bar": {
      title: "战斗界面里的血条，不只是一条进度条",
      date: "2026-09-02",
      tag: "示意笔记",
      body: [
        "这是一篇示意文章，用来占位博客的阅读体验，不是已发布的设计总结。",
        "血条要解决的是可读性：残血时能不能被立刻看见，护盾和吸血要不要分层，数字是跟随还是只在变化时出现。这些选择会直接影响战斗中的判断速度。",
        "动效同样需要克制。过强的闪烁会干扰瞄准和读招；完全静止又不容易察觉变化。通常会在数值突变、受击和回血时给短暂反馈，并保持主条本身稳定。",
        "正式文章会补上对比图和交互说明。当前页面只保留这个方向，便于浏览站点结构。"
      ]
    },
    "ai-workflow": {
      title: "把 AI 辅助开发嵌进日常工作流的几个原则",
      date: "2026-08-21",
      tag: "示意笔记",
      body: [
        "这是一篇示意文章，讨论如何把 AI 放进日常开发，而不是当成偶尔使用的聊天窗口。正文为占位，并非已发表的完整经验总结。",
        "比较有效的用法，是让模型处理改文件、跑检查、整理验收步骤这些可重复的工作，并把关键判断留在自己手里。输出需要能被再次执行，而不是一段无法验证的描述。",
        "另一条原则是限制上下文。把整段日志或整个项目反复塞回对话，既贵也容易跑偏。更稳的是给出范围、验收标准和失败时的现象。",
        "这些原则在这里只作目录式展示。以后若写成正式笔记，会附上具体的工作流和反例。"
      ]
    },
    "param-panel": {
      title: "编辑器小工具：参数面板为什么值得单独做",
      date: "2026-07-14",
      tag: "示意笔记",
      body: [
        "这是一篇示意文章，用来说明参数面板作为独立小工具的价值，并不代表已经完成的工具文档。",
        "调参如果总要回到完整工程里改字段、编译、进场景，反馈会很慢。一个只负责暴露关键参数的小窗口，能让数值调整和画面反馈靠得更近。",
        "面板不必一开始就做得很重。滑动条、开关、重置和复制当前配置，往往就够支撑一轮动效或战斗数值的试验。",
        "当前正文只保留这个观点，作为博客列表的可读示意。"
      ]
    }
  };

  function qs(name) {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get(name);
    } catch (e) {
      return null;
    }
  }

  function setText(sel, text) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.textContent = text;
    });
  }

  function renderParagraphs(container, lines) {
    if (!container) return;
    container.textContent = "";
    lines.forEach(function (line) {
      var p = document.createElement("p");
      p.textContent = line;
      container.appendChild(p);
    });
  }

  var workRoot = document.querySelector("[data-work-page]");
  if (workRoot) {
    var id = qs("id") || "";
    var work = works[id];
    var fallback = document.querySelector("[data-work-fallback]");
    var article = document.querySelector("[data-work-article]");
    if (work && article) {
      document.title = work.title + " · iamchh";
      setText("[data-work-title]", work.title);
      setText("[data-work-sub]", work.sub);
      setText("[data-work-cat]", "示意 · " + work.cat);
      var img = document.querySelector("[data-work-image]");
      if (img) {
        img.src = work.image;
        img.alt = work.alt;
      }
      renderParagraphs(document.querySelector("[data-work-body]"), work.body);
      if (fallback) fallback.hidden = true;
      article.hidden = false;
    } else if (fallback && article) {
      article.hidden = true;
      fallback.hidden = false;
    }
  }

  var postRoot = document.querySelector("[data-post-page]");
  if (postRoot) {
    var pid = qs("id") || "";
    var post = posts[pid];
    var pFallback = document.querySelector("[data-post-fallback]");
    var pArticle = document.querySelector("[data-post-article]");
    if (post && pArticle) {
      document.title = post.title + " · iamchh";
      setText("[data-post-title]", post.title);
      setText("[data-post-date]", "示意日期 " + post.date);
      setText("[data-post-tag]", post.tag);
      renderParagraphs(document.querySelector("[data-post-body]"), post.body);
      if (pFallback) pFallback.hidden = true;
      pArticle.hidden = false;
    } else if (pFallback && pArticle) {
      pArticle.hidden = true;
      pFallback.hidden = false;
    }
  }
})();
