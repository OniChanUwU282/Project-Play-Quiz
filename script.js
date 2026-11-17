const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const marqueeWrapper = document.getElementById('marqueeWrapper');
const widgetsTrack = document.getElementById('widgetsTrack');
const prevBtn = document.getElementById('prevWidget');
const nextBtn = document.getElementById('nextWidget');

const lightbox = document.getElementById('imageLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.getElementById('closeLightbox');

if (marqueeWrapper && widgetsTrack) {
  widgetsTrack.innerHTML += widgetsTrack.innerHTML;

  let isPaused = false;
  let resumeTimer = null;
  const stepWidth = 297; 

  function autoScroll() {
    if (!isPaused && !lightbox.classList.contains('open')) {
      marqueeWrapper.scrollLeft += 0.8;
      if (marqueeWrapper.scrollLeft >= widgetsTrack.scrollWidth / 2) {
        marqueeWrapper.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }
  requestAnimationFrame(autoScroll);

  marqueeWrapper.addEventListener('mouseenter', () => { isPaused = true; });
  marqueeWrapper.addEventListener('mouseleave', () => { isPaused = false; });
  marqueeWrapper.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
  marqueeWrapper.addEventListener('touchend', () => {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { isPaused = false; }, 2500);
  });

  function moveCarousel(direction) {
    isPaused = true;
    clearTimeout(resumeTimer);

    if (direction < 0 && marqueeWrapper.scrollLeft <= 10) {
      marqueeWrapper.scrollLeft = widgetsTrack.scrollWidth / 2;
    }

    marqueeWrapper.scrollBy({
      left: direction * stepWidth,
      behavior: 'smooth'
    });

    resumeTimer = setTimeout(() => {
      isPaused = false;
    }, 3000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => moveCarousel(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => moveCarousel(1));

  widgetsTrack.querySelectorAll('.widget-card').forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.widget-media > img');
      if (!img || img.style.display === 'none') return;

      const title = card.querySelector('h3')?.textContent || '';
      const desc = card.querySelector('p')?.textContent || '';

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = title ? `${title} — ${desc}` : img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });
}

function hideLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

if (closeLightbox) closeLightbox.addEventListener('click', hideLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) hideLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideLightbox();
});