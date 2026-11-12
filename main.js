document.documentElement.classList.add("js");

// The three crawlable HTML pages share one structure. Switching languages
// updates only copy and descriptive attributes, preserving scroll, form input
// and the existing motion state without rebuilding the page.
const siteRoot = new URL(".", document.currentScript.src);
const localePaths = { es: "", en: "en/", "pt-BR": "pt-br/" };
const languageLinks = [...document.querySelectorAll(".language-switch a[data-lang]")];
const localeCache = new Map();
let currentLocale = document.documentElement.lang || "es";
let localeRequest = 0;
const uiCopy = {
  es: { open: "Abrir menú", close: "Cerrar menú", pause: "Pausar animaciones", resume: "Reanudar animaciones", pauseText: "Pausar movimiento", resumeText: "Reanudar movimiento", photo: "Fotografía no disponible de" },
  en: { open: "Open menu", close: "Close menu", pause: "Pause animations", resume: "Resume animations", pauseText: "Pause motion", resumeText: "Resume motion", photo: "Photo unavailable for" },
  "pt-BR": { open: "Abrir menu", close: "Fechar menu", pause: "Pausar animações", resume: "Retomar animações", pauseText: "Pausar animações", resumeText: "Retomar animações", photo: "Foto indisponível de" }
};

for (const element of document.querySelectorAll("img[src], link[href], script[src]")) {
  for (const field of ("src" in element ? ["src"] : ["href"])) {
    const value = element.getAttribute(field);
    if (value?.startsWith("./") || value?.startsWith("../")) element.setAttribute(field, new URL(value, location.href).href);
  }
}
const bodyTextNodes = (root) => {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
};
const localeFromPath = (path) => path.startsWith(siteRoot.pathname + "en/") ? "en" : path.startsWith(siteRoot.pathname + "pt-br/") ? "pt-BR" : "es";
const localeUrl = (locale) => new URL(localePaths[locale] + location.hash, siteRoot);
const updateLanguageLinks = () => {
  for (const link of languageLinks) {
    const locale = link.dataset.lang;
    link.href = localeUrl(locale).href;
    if (locale === currentLocale) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
};
const refreshDynamicLabels = () => {
  const words = uiCopy[currentLocale];
  const menu = document.querySelector(".menu-toggle");
  if (menu) menu.setAttribute("aria-label", menu.getAttribute("aria-expanded") === "true" ? words.close : words.open);
  const motion = document.querySelector(".motion-toggle");
  if (motion) {
    const paused = motion.getAttribute("aria-pressed") === "true";
    motion.setAttribute("aria-label", paused ? words.resume : words.pause);
    motion.querySelector(".motion-toggle-text").textContent = paused ? words.resumeText : words.pauseText;
  }
};
const loadLocale = async (locale) => {
  if (!localeCache.has(locale)) {
    const url = new URL(localePaths[locale], siteRoot);
    localeCache.set(locale, fetch(url).then(async (response) => {
      if (!response.ok) throw new Error(`Language page unavailable: ${locale}`);
      return new DOMParser().parseFromString(await response.text(), "text/html");
    }));
  }
  return localeCache.get(locale);
};
const applyLocale = async (locale, push = true) => {
  const request = ++localeRequest;
  if (locale === currentLocale) return;
  const target = await loadLocale(locale);
  if (request !== localeRequest) return;
  const sourceNodes = bodyTextNodes(document.body);
  const targetNodes = bodyTextNodes(target.body);
  if (sourceNodes.length !== targetNodes.length) throw new Error("Language pages have different structures");
  const attributes = [];
  for (const field of ["aria-label", "alt"]) {
    const source = [...document.body.querySelectorAll(`[${field}]`)];
    const translated = [...target.body.querySelectorAll(`[${field}]`)];
    if (source.length !== translated.length) throw new Error(`Language attributes differ: ${field}`);
    attributes.push({ field, source, translated });
  }
  sourceNodes.forEach((node, index) => { node.nodeValue = targetNodes[index].nodeValue; });
  for (const { field, source, translated } of attributes) {
    source.forEach((element, index) => element.setAttribute(field, translated[index].getAttribute(field)));
  }
  document.documentElement.lang = locale;
  document.title = target.title;
  for (const selector of ['meta[name="description"]', 'meta[property^="og:"]', 'meta[name^="twitter:"]', 'link[rel="canonical"]']) {
    const current = [...document.querySelectorAll(selector)];
    const translated = [...target.querySelectorAll(selector)];
    if (current.length !== translated.length) throw new Error(`Metadata differs: ${selector}`);
    current.forEach((element, index) => {
      const field = element.tagName === "LINK" ? "href" : "content";
      element.setAttribute(field, translated[index].getAttribute(field));
    });
  }
  currentLocale = locale;
  try { localStorage.setItem("impulso365-language", locale); } catch {}
  if (push) history.pushState({ locale }, "", localeUrl(locale));
  updateLanguageLinks();
  refreshDynamicLabels();
};
languageLinks.forEach((link) => link.addEventListener("click", async (event) => {
  if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const locale = link.dataset.lang;
  try { await applyLocale(locale); } catch { location.assign(link.href); }
}));
window.addEventListener("popstate", () => {
  const locale = localeFromPath(location.pathname);
  applyLocale(locale, false).catch(() => location.reload());
  updateLanguageLinks();
});
window.addEventListener("hashchange", updateLanguageLinks);
updateLanguageLinks();

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");

if (menuButton && navigation) {
  const closeMenu = () => {
    navigation.removeAttribute("data-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", uiCopy[currentLocale].open);
  };

  menuButton.addEventListener("click", () => {
    if (navigation.hasAttribute("data-open")) {
      closeMenu();
    } else {
      navigation.setAttribute("data-open", "");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", uiCopy[currentLocale].close);
    }
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.hasAttribute("data-open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (navigation.hasAttribute("data-open") && !event.target.closest(".site-header")) closeMenu();
  });
}

document.querySelector(".inquiry-form")?.addEventListener("submit", (event) => event.preventDefault());
for (const portrait of document.querySelectorAll(".team-portrait img[data-fallback-name]")) {
  portrait.addEventListener("error", () => {
    portrait.src = new URL("assets/team/avatar-neutral.svg", siteRoot).href;
    portrait.alt = `${uiCopy[currentLocale].photo} ${portrait.dataset.fallbackName}`;
    portrait.removeAttribute("data-fallback-name");
  }, { once: true });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canAnimate = !reduceMotion.matches && "IntersectionObserver" in window;
const motionButton = document.querySelector(".motion-toggle");
let motionPaused = false;
const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')].map((link) => ({
  link,
  section: document.querySelector(link.getAttribute("href"))
})).filter(({ section }) => section);
let activeSection = null;
const updateCurrentNav = () => {
  const focusLine = window.innerHeight * .34;
  let currentSection = sectionLinks[0]?.section;
  for (const { section } of sectionLinks) {
    const bounds = section.getBoundingClientRect();
    if (bounds.top <= focusLine) currentSection = section;
  }
  if (currentSection === activeSection) return;
  activeSection = currentSection;
  sectionLinks.forEach(({ link, section }) => {
    if (section === currentSection) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
};

if (canAnimate && motionButton) {
  motionButton.addEventListener("click", () => {
    motionPaused = !motionPaused;
    document.documentElement.classList.toggle("motion-paused", motionPaused);
    motionButton.setAttribute("aria-pressed", String(motionPaused));
    motionButton.setAttribute("aria-label", motionPaused ? uiCopy[currentLocale].resume : uiCopy[currentLocale].pause);
    motionButton.querySelector(".motion-toggle-text").textContent = motionPaused ? uiCopy[currentLocale].resumeText : uiCopy[currentLocale].pauseText;
  });
}

if (canAnimate) {
  const revealTargets = [
    ...document.querySelectorAll(".services-intro, .service-row, .services-bridge, .sectors-intro, .sector-item, .services-followup, .method-copy, .team-intro, .team-member, .contact-copy, .contact-form-wrap, .site-footer")
  ];
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in-view");
        revealObserver.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px 12% 0px", threshold: 0.01 });

  revealTargets.forEach((target, index) => {
    target.classList.add("will-reveal");
    if (target.matches(".service-row, .sector-item, .team-member")) {
      target.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
    }
    const bounds = target.getBoundingClientRect();
    if (bounds.top < window.innerHeight * .93 && bounds.bottom > 0) {
      target.classList.add("is-in-view");
    } else {
      revealObserver.observe(target);
    }
  });

  const heroStage = document.querySelector(".hero-stage");
  if (heroStage) {
    const heroVisibility = new IntersectionObserver(([entry]) => {
      heroStage.classList.toggle("is-idle", !entry.isIntersecting);
    });
    heroVisibility.observe(heroStage);
  }
  document.addEventListener("visibilitychange", () => {
    document.documentElement.classList.toggle("motion-hidden", document.hidden);
  });

  for (const details of document.querySelectorAll(".sector-item")) {
    const summary = details.querySelector("summary");
    const content = details.querySelector(".sector-offerings");
    if (!summary || !content || !content.animate) continue;
    let activeAnimation;
    summary.addEventListener("click", (event) => {
      if (motionPaused || reduceMotion.matches) return;
      event.preventDefault();
      activeAnimation?.finish();
      const opening = !details.open;
      if (opening) details.open = true;
      const height = content.scrollHeight;
      content.style.overflow = "hidden";
      activeAnimation = content.animate(
        opening
          ? [{ height: "0px", opacity: 0, transform: "translateY(-12px)" }, { height: `${height}px`, opacity: 1, transform: "translateY(0)" }]
          : [{ height: `${height}px`, opacity: 1, transform: "translateY(0)" }, { height: "0px", opacity: 0, transform: "translateY(-12px)" }],
        { duration: opening ? 440 : 320, easing: "cubic-bezier(.22, 1, .36, 1)" }
      );
      activeAnimation.onfinish = () => {
        if (!opening) details.open = false;
        content.style.overflow = "";
        activeAnimation = undefined;
      };
    });
  }

  document.documentElement.classList.add("motion-ready");

  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  const manifesto = document.querySelector(".manifesto");
  const method = document.querySelector(".method");
  const sequence = document.querySelector(".method-sequence");
  const methodSteps = sequence ? [...sequence.querySelectorAll(".method-steps li")] : [];
  const serviceRows = [...document.querySelectorAll(".service-row")];
  const sectorSection = document.querySelector(".sectors");
  const sectorList = document.querySelector(".sector-list");
  const sectorRows = [...document.querySelectorAll(".sector-item")];
  const teamList = document.querySelector(".team-list");
  const teamRows = [...document.querySelectorAll(".team-member")];
  const desktopScene = window.matchMedia("(min-width: 901px) and (min-height: 680px)");
  const finePointer = window.matchMedia("(pointer: fine) and (min-width: 901px)");
  const clamp = (value) => Math.min(1, Math.max(0, value));
  let framePending = false;

  if (hero && heroStage) {
    hero.addEventListener("pointermove", (event) => {
      if (motionPaused || !finePointer.matches) return;
      const bounds = heroStage.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2)));
      const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2)));
      heroStage.style.setProperty("--pointer-x", `${(x * 8).toFixed(1)}px`);
      heroStage.style.setProperty("--pointer-y", `${(y * 8).toFixed(1)}px`);
    }, { passive: true });
    hero.addEventListener("pointerleave", () => {
      heroStage.style.setProperty("--pointer-x", "0px");
      heroStage.style.setProperty("--pointer-y", "0px");
    });
  }

  const updateScrollState = () => {
    framePending = false;
    const viewportHeight = window.innerHeight;
    const scrollable = document.documentElement.scrollHeight - viewportHeight;
    const pageRatio = scrollable > 0 ? clamp(window.scrollY / scrollable) : 0;
    const heroBounds = hero?.getBoundingClientRect();
    const manifestoBounds = manifesto?.getBoundingClientRect();
    const methodBounds = method?.getBoundingClientRect();
    const sequenceBounds = sequence && !desktopScene.matches ? sequence.getBoundingClientRect() : null;
    const sequenceHeight = sequence?.clientHeight ?? 0;
    const sectorBounds = sectorSection?.getBoundingClientRect();
    const sectorListBounds = sectorList?.getBoundingClientRect();
    const teamListBounds = teamList?.getBoundingClientRect();
    const visibleSectors = sectorBounds && sectorBounds.top < viewportHeight && sectorBounds.bottom > 0
      ? sectorRows.map((row) => ({ row, bounds: row.getBoundingClientRect() }))
      : [];

    if (header) {
      header.style.setProperty("--scroll-progress", String(pageRatio));
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    }
    updateCurrentNav();
    if (motionPaused) return;

    const focusLine = viewportHeight * .58;
    let focusedRow = null;
    let nearestDistance = Infinity;
    for (const row of serviceRows) {
      const bounds = row.getBoundingClientRect();
      if (bounds.top > viewportHeight * .9 || bounds.bottom < viewportHeight * .2) continue;
      const distance = Math.abs((bounds.top + bounds.bottom) / 2 - focusLine);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        focusedRow = row;
      }
    }
    serviceRows.forEach((row) => row.classList.toggle("is-spotlight", row === focusedRow));

    if (sectorListBounds && sectorList) {
      const sectorProgress = clamp((viewportHeight * .5 - sectorListBounds.top) / Math.max(1, sectorListBounds.height));
      sectorList.style.setProperty("--sector-progress", String(sectorProgress));
      let focusedSector = null;
      let nearestSector = Infinity;
      for (const { row, bounds } of visibleSectors) {
        if (bounds.top > viewportHeight * .9 || bounds.bottom < viewportHeight * .12) continue;
        const distance = Math.abs((bounds.top + bounds.bottom) / 2 - viewportHeight * .52);
        if (distance < nearestSector) {
          nearestSector = distance;
          focusedSector = row;
        }
      }
      sectorRows.forEach((row) => row.classList.toggle("is-current", row === focusedSector));
    }

    if (teamListBounds && teamList) {
      const teamProgress = clamp((viewportHeight * .55 - teamListBounds.top) / Math.max(1, teamListBounds.height));
      teamList.style.setProperty("--team-progress", String(teamProgress));
      let focusedMember = null;
      let nearestMember = Infinity;
      for (const member of teamRows) {
        const bounds = member.getBoundingClientRect();
        if (bounds.top > viewportHeight * .88 || bounds.bottom < viewportHeight * .16) continue;
        const distance = Math.abs((bounds.top + bounds.bottom) / 2 - viewportHeight * .52);
        if (distance < nearestMember) {
          nearestMember = distance;
          focusedMember = member;
        }
      }
      teamRows.forEach((member) => member.classList.toggle("is-current", member === focusedMember));
    }

    if (heroBounds && heroStage) {
      const progress = clamp(-heroBounds.top / Math.max(1, heroBounds.height));
      heroStage.style.setProperty("--hero-shift", `${(-38 * progress).toFixed(1)}px`);
      heroStage.style.setProperty("--hero-scale", String((1 - .08 * progress).toFixed(3)));
    }

    if (manifestoBounds) {
      const start = viewportHeight * .72;
      const end = viewportHeight * .18;
      const ratio = clamp((start - manifestoBounds.top) / Math.max(1, manifestoBounds.height + start - end));
      manifesto.style.setProperty("--manifesto-progress", `${(ratio * 100).toFixed(2)}%`);
    }

    if (methodBounds && sequence) {
      let ratio;
      if (desktopScene.matches) {
        const range = Math.max(1, methodBounds.height - viewportHeight);
        ratio = clamp(-methodBounds.top / range);
      } else {
        const focusLine = viewportHeight * .62;
        ratio = clamp((focusLine - sequenceBounds.top - 37) / Math.max(1, sequenceBounds.height - 74));
      }
      sequence.style.setProperty("--method-progress", String(ratio));
      sequence.style.setProperty("--method-marker-y", `${25 + ratio * Math.max(0, sequenceHeight - 74)}px`);
      methodSteps.forEach((step, index) => step.classList.toggle("is-active", ratio >= index / methodSteps.length));
    }
  };

  const scheduleScrollState = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateScrollState);
  };

  window.addEventListener("scroll", scheduleScrollState, { passive: true });
  window.addEventListener("resize", scheduleScrollState);
  window.addEventListener("pageshow", scheduleScrollState);
  document.fonts?.ready.then(scheduleScrollState);
  scheduleScrollState();
} else {
  window.addEventListener("scroll", updateCurrentNav, { passive: true });
  window.addEventListener("resize", updateCurrentNav);
  updateCurrentNav();
}
