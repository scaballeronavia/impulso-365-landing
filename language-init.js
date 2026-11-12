(() => {
  const root = new URL(".", document.currentScript.src);
  if (location.pathname !== root.pathname && location.pathname !== root.pathname + "index.html") return;
  let saved;
  try { saved = localStorage.getItem("impulso365-language"); } catch {}
  const preferred = saved || (navigator.languages || [navigator.language]).find((item) => /^(es|en|pt)(-|$)/i.test(item)) || "es";
  const locale = /^en/i.test(preferred) ? "en" : /^pt/i.test(preferred) ? "pt-BR" : "es";
  if (locale === "es") return;
  const path = locale === "en" ? "en/" : "pt-br/";
  location.replace(new URL(path + location.hash, root));
})();
