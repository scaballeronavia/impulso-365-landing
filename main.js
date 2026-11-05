document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");

if (menuButton && navigation) {
  const closeMenu = () => {
    navigation.removeAttribute("data-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
  };

  menuButton.addEventListener("click", () => {
    if (navigation.hasAttribute("data-open")) {
      closeMenu();
    } else {
      navigation.setAttribute("data-open", "");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Cerrar menú");
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
    motionButton.setAttribute("aria-label", motionPaused ? "Reanudar animaciones" : "Pausar animaciones");
    motionButton.querySelector(".motion-toggle-text").textContent = motionPaused ? "Reanudar movimiento" : "Pausar movimiento";
  });
}

if (canAnimate) {
  const revealTargets = [
    ...document.querySelectorAll(".services-intro, .service-row, .services-bridge, .sectors-intro, .sector-item, .services-followup, .method-copy, .coverage-intro, .coverage-list li, .contact-copy, .contact-form-wrap, .site-footer")
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
    if (target.matches(".service-row, .sector-item, .coverage-list li")) {
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
