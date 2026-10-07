// GRIP — site da banda — scripts gerais

document.addEventListener('DOMContentLoaded', () => {
  // menu mobile
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const isOpen = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // marca o link ativo pela página atual
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // header some/aparece sutil com scroll (fica sempre visível, só adiciona sombra)
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? '0 6px 18px rgba(0,0,0,.5)' : 'none';
    });
  }

  // footer: ano atual
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // carrossel de integrantes
  document.querySelectorAll('.carousel').forEach((carousel) => {
    const track = carousel.querySelector('.carousel__track');
    const slides = carousel.querySelectorAll('.carousel__slide');
    const prevBtn = carousel.querySelector('.carousel__btn--prev');
    const nextBtn = carousel.querySelector('.carousel__btn--next');
    const currentEl = carousel.querySelector('[data-current]');
    if (!track || !slides.length) return;

    const step = () => {
      const trackStyle = getComputedStyle(track);
      const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '0');
      return slides[0].getBoundingClientRect().width + gap;
    };

    if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

    if (currentEl) {
      const updateCounter = () => {
        const s = step();
        const idx = s ? Math.round(track.scrollLeft / s) : 0;
        currentEl.textContent = String(Math.min(idx + 1, slides.length)).padStart(2, '0');
      };
      let ticking = false;
      track.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { updateCounter(); ticking = false; });
      });
      updateCounter();
    }
  });
});
