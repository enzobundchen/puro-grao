(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav: fundo ao rolar
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  const toggle = document.getElementById('toggle');
  const menu = document.getElementById('menu');
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Slideshow do hero
  const slides = document.querySelectorAll('.hero__slide');
  let current = 0;
  // Carrega os slides 2 e 3 só depois da página pronta (não disputam com o 1º)
  const loadSlides = () => slides.forEach(img => {
    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    if (img.dataset.src) img.src = img.dataset.src;
  });
  if (document.readyState === 'complete') loadSlides(); else window.addEventListener('load', loadSlides, { once: true });
  if (!reduce && slides.length > 1) {
    setInterval(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 6000);
  }

  // Revelar elementos ao rolar
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Vídeo do ambiente: só baixa e toca quando aparece na tela
  const video = document.querySelector('.ambiente__video video');
  if (video) {
    if (reduce) video.controls = true;
    else new IntersectionObserver(([e]) => {
      if (e.isIntersecting) video.play().catch(() => { video.controls = true; });
      else video.pause();
    }, { threshold: 0.25 }).observe(video);
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
