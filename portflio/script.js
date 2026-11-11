(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     Project Monographs (Strictly sourced from Manasvi Patil's Resume)
     ------------------------------------------------------------------------ */
  const MONOGRAPHS = [
    {
      id: "sentiment-analysis",
      num: "01",
      domain: "AI / ML & NLP",
      title: "Sentiment Analysis of Social Media Presence",
      subtitle: "Applied NLP Text Classification & Visualization Pipeline",
      overview:
        "An end-to-end Natural Language Processing classification workflow designed to evaluate social media sentiment signals and verify pipeline reliability under structured QA suites.",
      highlights: [
        "Constructed an ML text classification pipeline (TF-IDF + Logistic Regression) classifying social media sentiment with high accuracy.",
        "Created a real-time Streamlit visualization interface tested rigorously with black-box and white-box test suites."
      ],
      blueprint: [
        "Text Preprocessing",
        "TF-IDF Vectorizer",
        "Logistic Regression",
        "Streamlit Live UI",
        "Black & White-Box QA"
      ],
      stack: ["Python", "Machine Learning", "NLP", "Streamlit", "React.js"]
    },
    {
      id: "atelier-ai",
      num: "02",
      domain: "AI & Web Studio",
      title: "Atelier AI",
      subtitle: "Smart Digital Wardrobe & Stylist Studio",
      overview:
        "A personal styling studio and closet intelligence system combining algorithmic color theory with weather and occasion curation across dual-layer persistence.",
      highlights: [
        "Developed a smart closet and AI outfit generator implementing color theory rules, slot locking, and weather/occasion matching.",
        "Built a 7-day auto-styled lookbook offering 6 visual themes and dual-layer persistence (SQLite REST API with local fallback)."
      ],
      blueprint: [
        "Wardrobe Catalog UI",
        "Color Theory & Slot Lock",
        "Python Flask API",
        "SQLite + Local Fallback",
        "7-Day Lookbook"
      ],
      stack: ["Python Flask", "SQLite", "HTML5", "CSS3", "JavaScript"]
    },
    {
      id: "apex-drive",
      num: "03",
      domain: "Full-Stack & 3D",
      title: "Apex Drive",
      subtitle: "Automotive Telemetry & 3D Engineering Platform",
      overview:
        "An interactive 3D engineering showcase and telemetry platform spanning 20 supercars, uniting real-time WebGL inspection with a structured Java Spring Boot 3 REST architecture.",
      highlights: [
        "Built an interactive 3D web platform covering 20 supercars with an interactive Three.js viewer, exploded-view deconstruction, and custom GLB upload.",
        "Engineered a Spring Boot REST backend with Java Stream API query filtering and a 1/4-mile drag race simulator featuring a telemetry soundboard."
      ],
      blueprint: [
        "Three.js Viewer",
        "GLB Upload & Exploded View",
        "Spring Boot 3 REST API",
        "Java Stream Query Filter",
        "Drag Simulator & Audio"
      ],
      stack: ["Three.js", "JavaScript", "Java Spring Boot 3", "REST API", "Java Stream API"]
    },
    {
      id: "quantum-calculator",
      num: "04",
      domain: "Frontend Systems",
      title: "Stark Industries Quantum Scientific Calculator",
      subtitle: "Shunting-Yard Expression Engine & Web Audio Synth",
      overview:
        "A precision client-side mathematical workstation pairing formal parser evaluation with procedural Web Audio sound design and voice feedback.",
      highlights: [
        "Engineered a Shunting-Yard expression evaluator supporting trigonometric, combinatoric, and hyperbolic mathematical operations.",
        "Integrated speech-synthesis voice output, procedural sound synthesis, calculation history tracking, and 6 custom UI themes."
      ],
      blueprint: [
        "Token Parser",
        "Shunting-Yard Evaluator",
        "Web Audio Synth",
        "Speech Synthesis",
        "History & 6 Themes"
      ],
      stack: ["JavaScript (ES6+)", "Web Audio API", "Speech Synthesis", "HTML5", "CSS3"]
    }
  ];

  const EMAIL = "manasvi78044@gmail.com";
  const THEME_STORAGE_KEY = "manasvi-portfolio-theme";

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2400);
  }

  function copyEmail() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(EMAIL)
        .then(() => showToast("Email copied — " + EMAIL))
        .catch(() => fallbackCopy(EMAIL));
    } else {
      fallbackCopy(EMAIL);
    }
  }

  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      showToast("Email copied — " + text);
    } catch (_) {
      showToast(text);
    }
    document.body.removeChild(area);
  }

  /* ------------------------------------------------------------------------
     Theme Edition Switcher (Ivory / Noir)
     ------------------------------------------------------------------------ */
  const rootEl = document.documentElement;
  const themeBtn = $("#theme-toggle");
  const themeLabel = $("#theme-label");

  function applyTheme(theme) {
    const isNoir = theme === "noir";
    if (isNoir) {
      rootEl.setAttribute("data-theme", "noir");
    } else {
      rootEl.removeAttribute("data-theme");
    }
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", String(isNoir));
      themeBtn.setAttribute(
        "aria-label",
        isNoir ? "Switch to Ivory light edition" : "Switch to Noir dark edition"
      );
    }
    if (themeLabel) {
      themeLabel.textContent = isNoir ? "Noir" : "Ivory";
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, isNoir ? "noir" : "ivory");
    } catch (_) {
      /* Ignore storage restriction on file:// */
    }
  }

  function initTheme() {
    let saved = "ivory";
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "noir" || stored === "ivory") {
        saved = stored;
      }
    } catch (_) {
      saved = "ivory";
    }
    applyTheme(saved);

    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const next = rootEl.getAttribute("data-theme") === "noir" ? "ivory" : "noir";
        applyTheme(next);
        showToast(next === "noir" ? "Noir Edition active" : "Ivory Edition active");
      });
    }
  }

  /* ------------------------------------------------------------------------
     Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    const toggleBtn = $("#mobile-menu-toggle");
    const mobileNav = $("#mobile-nav");
    if (!toggleBtn || !mobileNav) return;

    const closeNav = () => {
      mobileNav.hidden = true;
      toggleBtn.setAttribute("aria-expanded", "false");
    };

    toggleBtn.addEventListener("click", () => {
      const willOpen = mobileNav.hidden;
      mobileNav.hidden = !willOpen;
      toggleBtn.setAttribute("aria-expanded", String(willOpen));
    });

    $$("a", mobileNav).forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 900 && !mobileNav.hidden) {
        closeNav();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Project Filter Tabs
     ------------------------------------------------------------------------ */
  function initProjectFilters() {
    const filterButtons = $$(".filter-btn");
    const cards = $$(".project-card");
    const statusEl = $("#filter-status");
    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter || "all";
        filterButtons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", String(active));
        });

        let visibleCount = 0;
        cards.forEach((card) => {
          const tags = (card.dataset.category || "").split(",");
          const match = filter === "all" || tags.includes(filter);
          card.hidden = !match;
          if (match) visibleCount += 1;
        });

        if (statusEl) {
          statusEl.textContent = "Showing " + visibleCount + " of " + cards.length + " works.";
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Project Monograph Dialog
     ------------------------------------------------------------------------ */
  let activeMonographIndex = 0;

  function renderMonograph(index) {
    const data = MONOGRAPHS[index];
    if (!data) return;
    activeMonographIndex = index;

    $("#monograph-kicker").textContent = "FOLIO " + data.num + " · " + data.domain.toUpperCase();
    $("#monograph-title").textContent = data.title;
    $("#monograph-sub").textContent = data.subtitle;
    $("#monograph-overview").textContent = data.overview;

    const highlightsList = $("#monograph-highlights");
    highlightsList.textContent = "";
    data.highlights.forEach((point) => {
      const li = document.createElement("li");
      li.textContent = point;
      highlightsList.appendChild(li);
    });

    const blueprint = $("#monograph-blueprint");
    blueprint.textContent = "";
    data.blueprint.forEach((step, idx) => {
      const node = document.createElement("span");
      node.className = "blueprint-node";
      node.textContent = step;
      blueprint.appendChild(node);

      if (idx < data.blueprint.length - 1) {
        const arrow = document.createElement("span");
        arrow.className = "blueprint-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        blueprint.appendChild(arrow);
      }
    });

    const stackEl = $("#monograph-stack");
    stackEl.textContent = "";
    data.stack.forEach((tech) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = tech;
      stackEl.appendChild(tag);
    });

    $("#monograph-counter").textContent = data.num + " / 0" + MONOGRAPHS.length;
  }

  function initMonographDialog() {
    const dialog = $("#monograph-dialog");
    if (!dialog) return;

    $$("[data-monograph]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const id = trigger.dataset.monograph;
        const idx = MONOGRAPHS.findIndex((m) => m.id === id);
        if (idx === -1) return;
        renderMonograph(idx);
        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        } else {
          dialog.setAttribute("open", "");
        }
      });
    });

    const closeBtn = $("#monograph-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => dialog.close());
    }

    const prevBtn = $("#monograph-prev");
    const nextBtn = $("#monograph-next");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const prev = (activeMonographIndex - 1 + MONOGRAPHS.length) % MONOGRAPHS.length;
        renderMonograph(prev);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const next = (activeMonographIndex + 1) % MONOGRAPHS.length;
        renderMonograph(next);
      });
    }

    // Light dismiss on backdrop click
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Atelier Concierge (⌘K Command Palette)
     ------------------------------------------------------------------------ */
  function initConcierge() {
    const dialog = $("#concierge-dialog");
    const openBtn = $("#concierge-open");
    const closeBtn = $("#concierge-close");
    const input = $("#concierge-input");
    const log = $("#concierge-log");
    if (!dialog || !input || !log) return;

    const RESPONSES = {
      help:
        "Available commands: about · experience · projects · skills · education · achievements · contact · copy · theme · print · clear",
      about:
        "Manasvi Patil — BCA graduate (CGPA 7.73) and first-year MCA student focused on AI/ML & Data Science, grounded in Python, Java, C, C++, JavaScript, SQL/SQLite, and applied NLP.",
      experience:
        "1. Coordinator — IDoSTEM NCEIR Innovation Tech Pvt. Ltd. (May 2026): Robotics/STEM/AI school programs & rural Lab-as-a-Service outreach.\n2. AI/ML Intern — InternPe (Aug 2024 – Sept 2024): ML data pipelines, EDA, predictive modeling, and feature preprocessing.",
      projects:
        "01. Sentiment Analysis of Social Media Presence (Python, ML, NLP, Streamlit, React.js)\n02. Atelier AI (Python Flask, SQLite, HTML5/CSS3/JS)\n03. Apex Drive (Three.js, JavaScript, Java Spring Boot 3, REST API)\n04. Stark Industries Quantum Scientific Calculator (ES6+, Web Audio API)",
      skills:
        "Languages: Python, Java, C, C++, JavaScript\nWeb & DB: HTML5, CSS3, SQL, SQLite, DBMS\nAI & Data Science: Machine Learning, NLP, Streamlit, Power BI\nLeadership: Strong English Communication, Team Coordination, Workshop Management, Problem-Solving",
      education:
        "• Master of Computer Applications (MCA) — 2026–Present (First Year)\n• Bachelor of Computer Applications (BCA) — 2023–2026 (CGPA: 7.73)\n• HSC, Science — Feb 2023 (68.83%)\n• SSC — 2021 (77.00%)",
      achievements:
        "• Winner (1st Position) — College-Level Smart India Hackathon (SIH) Internal Hackathon\n• Certified — Microsoft & upGrad Generative AI Foundations Certificate Program\n• Certified — Intel & Digital India AI for All Program",
      contact:
        "Email: manasvi78044@gmail.com\nPhone: +91 96992 77161\nLinkedIn: linkedin.com/in/manasvi-patil-667361321\nGitHub: github.com/patilmanasvi329-lab"
    };

    function appendEntry(cmd, responseText) {
      const entry = document.createElement("div");
      entry.className = "concierge-entry";

      const cmdLine = document.createElement("div");
      cmdLine.className = "concierge-entry__cmd";
      cmdLine.textContent = "> " + cmd;

      const resLine = document.createElement("div");
      resLine.className = "concierge-entry__res";
      resLine.textContent = responseText;

      entry.appendChild(cmdLine);
      entry.appendChild(resLine);
      log.appendChild(entry);
      log.scrollTop = log.scrollHeight;
    }

    function executeCommand(raw) {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;

      if (cmd === "clear") {
        log.textContent = "";
        appendEntry("clear", "Atelier Index cleared. Type 'help' or choose a topic above.");
        return;
      }

      if (cmd === "theme") {
        const next = rootEl.getAttribute("data-theme") === "noir" ? "ivory" : "noir";
        applyTheme(next);
        appendEntry("theme", "Switched edition to " + (next === "noir" ? "Noir." : "Ivory."));
        return;
      }

      if (cmd === "copy") {
        copyEmail();
        appendEntry("copy", "Copied " + EMAIL + " to clipboard.");
        return;
      }

      if (cmd === "print") {
        dialog.close();
        window.setTimeout(() => window.print(), 150);
        return;
      }

      const answer =
        RESPONSES[cmd] ||
        "Unrecognized entry '" +
          cmd +
          "'. Try: about, experience, projects, skills, education, achievements, contact, theme, copy, print, or clear.";
      appendEntry(cmd, answer);
    }

    function openConcierge() {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
      window.setTimeout(() => input.focus(), 40);
    }

    if (openBtn) openBtn.addEventListener("click", openConcierge);
    if (closeBtn) closeBtn.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        executeCommand(input.value);
        input.value = "";
      }
    });

    $$(".concierge-chip", dialog).forEach((chip) => {
      chip.addEventListener("click", () => {
        executeCommand(chip.dataset.cmd || chip.textContent);
        input.focus();
      });
    });

    document.addEventListener("keydown", (event) => {
      const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isCmdK) {
        event.preventDefault();
        if (dialog.open) {
          dialog.close();
        } else {
          openConcierge();
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     Scroll Progress, Active Nav Highlight & Gentle Reveal
     ------------------------------------------------------------------------ */
  function initScrollAndReveal() {
    const progressFill = $("#reading-progress-fill");
    const sections = $$("main section[id]");
    const navLinks = $$(".site-nav a");

    function updateScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
      if (progressFill) {
        progressFill.style.width = pct.toFixed(1) + "%";
      }

      let currentId = "";
      const offset = window.scrollY + 140;
      sections.forEach((sec) => {
        if (offset >= sec.offsetTop) {
          currentId = sec.id;
        }
      });

      navLinks.forEach((link) => {
        const hrefId = (link.getAttribute("href") || "").replace("#", "");
        link.classList.toggle("is-active", hrefId === currentId);
      });
    }

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    const revealEls = $$(".reveal");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-revealed"));
    }
  }

  /* ------------------------------------------------------------------------
     Wire Global Action Buttons
     ------------------------------------------------------------------------ */
  function initActions() {
    $$("[data-copy-email]").forEach((btn) => {
      btn.addEventListener("click", copyEmail);
    });

    $$("[data-print-cv]").forEach((btn) => {
      btn.addEventListener("click", () => window.print());
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileNav();
    initProjectFilters();
    initMonographDialog();
    initConcierge();
    initScrollAndReveal();
    initActions();
  });
})();
