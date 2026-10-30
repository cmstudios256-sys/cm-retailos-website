export function initializePageInteractions(page) {
  const header = document.querySelector('header');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenu = () => mobileMenu?.classList.remove('open');
  const toggleMobileMenu = () => mobileMenu?.classList.toggle('open');
  hamburger?.addEventListener('click', toggleMobileMenu);
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  const observers = [];
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: page === 'about' ? 0.08 : 0.12, rootMargin: '0px 0px -40px 0px' });
    observers.push(revealObserver);
    document.querySelectorAll('.reveal').forEach((element, index) => {
      element.style.transitionDelay = `${(index % 4) * 70}ms`;
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('in'));
  }

  const listeners = [];
  function listen(element, event, handler) {
    if (!element) return;
    element.addEventListener(event, handler);
    listeners.push(() => element.removeEventListener(event, handler));
  }

  if (page === 'home') {
    const marqueeTrack = document.getElementById('marqueeTrack');
    if (marqueeTrack) {
      marqueeTrack.append(...[...marqueeTrack.children].map(child => child.cloneNode(true)));
    }

    const gallery = document.querySelector('.gallery-section');
    const galleryRows = gallery?.querySelectorAll('.gallery-row');
    const galleryToggle = gallery?.querySelector('.gallery-motion-toggle');
    if (galleryRows && galleryToggle) {
      galleryRows.forEach(row => {
        [...row.children].forEach(card => {
          const clone = card.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          clone.querySelectorAll('img').forEach(image => image.setAttribute('alt', ''));
          row.appendChild(clone);
        });
      });
      gallery.classList.add('gallery-ready');

      const toggleGallery = () => {
        const paused = gallery.classList.toggle('gallery-paused');
        galleryToggle.setAttribute('aria-pressed', String(paused));
        galleryToggle.textContent = paused ? 'Play animation' : 'Pause animation';
      };
      listen(galleryToggle, 'click', toggleGallery);
    }

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.querySelectorAll('.insights-pillar-card, .insight-card').forEach(card => {
        const updateSpotlight = event => {
          const bounds = card.getBoundingClientRect();
          card.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
          card.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
        };
        const clearSpotlight = () => {
          card.style.removeProperty('--spotlight-x');
          card.style.removeProperty('--spotlight-y');
        };
        listen(card, 'pointermove', updateSpotlight);
        listen(card, 'pointerleave', clearSpotlight);
      });
    }
  }

  return () => {
    window.removeEventListener('scroll', updateHeader);
    hamburger?.removeEventListener('click', toggleMobileMenu);
    mobileMenu?.querySelectorAll('a').forEach(link => {
      link.removeEventListener('click', closeMobileMenu);
    });
    listeners.forEach(removeListener => removeListener());
    observers.forEach(observer => observer.disconnect());
  };
}
