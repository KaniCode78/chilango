// ===== Helpers =====
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

document.addEventListener("DOMContentLoaded", () => {
  // ===== Mobile nav =====
  const nav = $("#nav");
  const burger = $("#burger");
  burger?.addEventListener("click", () => nav.classList.toggle("open"));
  $$(".nav-links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  // ===== Year =====
  $("#year").textContent = new Date().getFullYear();

  // ===== Config (CAMBIA ESTO) =====
  // WhatsApp: 52 + lada + número, SIN +, SIN espacios
  const WHATS_NUMBER = "525500000000"; // <-- CAMBIA AQUÍ
  const WA_MSG = "¡Qué onda! Quiero hacer un pedido 🍽️🔥";
  const waUrl = `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(WA_MSG)}`;

  // Dirección para link de Maps (búsqueda) — puedes poner tu dirección real
  const ADDRESS_QUERY = ($("#addrText")?.textContent || "Zócalo CDMX").trim();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_QUERY)}`;

  // Set links
  $("#waFloat").href = waUrl;
  $("#ctaWhats").href = waUrl;
  $("#btnOrderMenu").href = waUrl;
  $("#btnOrderTortas").href = waUrl;
  $("#btnOrderQues").href = waUrl;
  $("#btnOrderDrinks").href = waUrl;
  $("#btnPromo1").href = waUrl;
  $("#btnPromo2").href = waUrl;
  $("#btnPromo3").href = waUrl;

  $("#ctaDirections").href = mapsUrl;
  $("#btnDirectionsTop").href = mapsUrl;

  // ===== Parallax (varias secciones) =====
  const layers = $$(".parallax-layer");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    if (prefersReduced) return;
    const sc = window.scrollY || 0;

    layers.forEach(layer => {
      const speed = parseFloat(layer.dataset.speed || "0.2");
      // Movimiento suave hacia arriba
      layer.style.transform = `translate3d(0, ${sc * speed * -0.22}px, 0)`;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ===== Carousel Promos =====
  const track = $('[data-carousel="track"]');
  const dotsWrap = $('[data-carousel="dots"]');
  const btnPrev = $('[data-carousel="prev"]');
  const btnNext = $('[data-carousel="next"]');

  if (track && dotsWrap) {
    const slides = $$(".promo", track);
    let index = 0;
    let timer = null;

    // Dots
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.className = "dot-btn" + (i === 0 ? " is-active" : "");
      b.type = "button";
      b.setAttribute("aria-label", `Ir a promo ${i + 1}`);
      b.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(b);
    });

    const dots = $$(".dot-btn", dotsWrap);

    function setActiveDot(i) {
      dots.forEach(d => d.classList.remove("is-active"));
      dots[i]?.classList.add("is-active");
    }

    function slideWidth() {
      // cada slide ocupa el ancho del track (por CSS)
      const first = slides[0];
      return first ? first.getBoundingClientRect().width + 16 : 0; // + gap
    }

    function goTo(i, userAction = false) {
      index = (i + slides.length) % slides.length;
      track.scrollTo({ left: index * slideWidth(), behavior: "smooth" });
      setActiveDot(index);
      if (userAction) restartAuto();
    }

    function next(userAction = false) { goTo(index + 1, userAction); }
    function prev(userAction = false) { goTo(index - 1, userAction); }

    btnNext?.addEventListener("click", () => next(true));
    btnPrev?.addEventListener("click", () => prev(true));

    // Touch / drag feel (scroll snap-like)
    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    track.addEventListener("pointerdown", (e) => {
      isDown = true;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
      restartAuto();
    });

    track.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      track.scrollLeft = startScroll - dx;
    });

    track.addEventListener("pointerup", () => {
      isDown = false;
      // snap aproximado al slide más cercano
      const w = slideWidth() || 1;
      const newIndex = Math.round(track.scrollLeft / w);
      goTo(newIndex, true);
    });

    // Auto-play
    function startAuto() {
      stopAuto();
      timer = setInterval(() => next(false), 4500);
    }
    function stopAuto() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function restartAuto() {
      stopAuto();
      startAuto();
    }

    // Pause when tab not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAuto();
      else startAuto();
    });

    // Init
    startAuto();
    window.addEventListener("resize", () => goTo(index, false));
  }

  // ===== Tabs menú =====
  const tabs = $$(".tab");
  const panels = $$(".panel");

  function activateTab(key) {
    tabs.forEach(t => {
      const on = t.dataset.tab === key;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach(p => p.classList.toggle("is-active", p.dataset.panel === key));
  }

  tabs.forEach(t => t.addEventListener("click", () => activateTab(t.dataset.tab)));
});