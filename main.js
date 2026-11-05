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

const inquiryForm = document.querySelector(".inquiry-form");
inquiryForm?.addEventListener("submit", (event) => event.preventDefault());

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canAnimate = !prefersReducedMotion && "IntersectionObserver" in window;

if (canAnimate) {
  const rows = [...document.querySelectorAll(".services-followup, .method-copy")];
  const enterObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add("is-in-view");
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  for (const row of rows) {
    const bounds = row.getBoundingClientRect();
    if (bounds.top < window.innerHeight * .92 && bounds.bottom > 0) row.classList.add("is-in-view");
    enterObserver.observe(row);
  }

  document.documentElement.classList.add("motion-ready");

  const header = document.querySelector(".site-header");
  const manifesto = document.querySelector(".manifesto");
  const method = document.querySelector(".method");
  const sequence = document.querySelector(".method-sequence");
  const methodSteps = sequence ? [...sequence.querySelectorAll(".method-steps li")] : [];
  const desktopScene = window.matchMedia("(min-width: 901px) and (min-height: 680px)");
  const clamp = (value) => Math.min(1, Math.max(0, value));
  let framePending = false;

  const updateScrollState = () => {
    framePending = false;
    const viewportHeight = window.innerHeight;
    const scrollable = document.documentElement.scrollHeight - viewportHeight;
    const pageRatio = scrollable > 0 ? clamp(window.scrollY / scrollable) : 0;
    const manifestoBounds = manifesto?.getBoundingClientRect();
    const methodBounds = method?.getBoundingClientRect();
    const sequenceBounds = sequence && !desktopScene.matches ? sequence.getBoundingClientRect() : null;
    const sequenceHeight = sequence?.clientHeight ?? 0;
    let manifestoRatio;
    let methodRatio;

    if (manifestoBounds) {
      const start = viewportHeight * .72;
      const end = viewportHeight * .18;
      manifestoRatio = clamp((start - manifestoBounds.top) / Math.max(1, manifestoBounds.height + start - end));
    }

    if (methodBounds && sequence) {
      if (desktopScene.matches) {
        const range = Math.max(1, methodBounds.height - viewportHeight);
        methodRatio = clamp(-methodBounds.top / range);
      } else {
        const focusLine = viewportHeight * .62;
        methodRatio = clamp((focusLine - sequenceBounds.top - 37) / Math.max(1, sequenceBounds.height - 74));
      }
    }

    if (header) {
      header.style.setProperty("--scroll-progress", String(pageRatio));
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    }
    if (manifestoRatio !== undefined) manifesto.style.setProperty("--manifesto-progress", `${(manifestoRatio * 100).toFixed(2)}%`);
    if (methodRatio !== undefined) {
      sequence.style.setProperty("--method-progress", String(methodRatio));
      sequence.style.setProperty("--method-marker-y", `${25 + methodRatio * Math.max(0, sequenceHeight - 74)}px`);
      methodSteps.forEach((step, index) => {
        step.classList.toggle("is-active", methodRatio >= index / methodSteps.length);
      });
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
}
