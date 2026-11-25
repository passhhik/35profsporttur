(() => {
  const root = document.documentElement;
  const intro = document.querySelector('.intro');
  const stage = document.querySelector('.hero-stage');
  const word = document.querySelector('.forum-word');
  const wordWindow = document.querySelector('.word-window');
  const orbs = Array.from(document.querySelectorAll('.orb-slot'));
  const copy = document.querySelector('.hero-copy');
  const memories = document.querySelector('.memories');
  const history = document.getElementById('history');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const decorativeOrbs = matchMedia('(max-width: 740px), (hover: none)');
  const compactNavigation = matchMedia('(max-width: 1120px)');
  const header = document.querySelector('.forum-header');
  const menu = document.getElementById('forum-navigation');
  const navSections = Array.from(menu.querySelectorAll('a'), link => ({
    link,
    section: document.getElementById(link.hash.slice(1))
  })).sort((a, b) => a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  let activeSection;
  const toggle = document.querySelector('.nav-toggle');
  const drawerClose = menu.querySelector('.nav-close');
  const backdrop = header.querySelector('.nav-backdrop');
  const drawerItems = Array.from(menu.querySelectorAll('button, a[href]'));
  const behindMenu = document.querySelectorAll('main, .skip-link, .brand, .nav-toggle');
  const limit = value => Math.min(1, Math.max(0, value));
  const smooth = value => value * value * (3 - 2 * value);
  const flights = orbs.map(slot => ({
    slot,
    button: slot.querySelector('button'),
    start: Number(slot.dataset.start),
    end: Number(slot.dataset.end),
    drift: Number(slot.dataset.drift),
    lift: Number(slot.dataset.lift)
  }));
  let activePhoto = null;
  let pinned = false;
  let frame = 0;
  let previousFrame = 0;
  let wordProgress = 0;
  let previousProgress = -1;
  let navigationScroll;
  let navigationTimer;
  let menuOpen = false;
  let metrics;

  function closePhoto() {
    if (!activePhoto) return;
    activePhoto.parentElement.classList.remove('showing');
    activePhoto.setAttribute('aria-expanded', 'false');
    activePhoto.removeAttribute('aria-describedby');
    activePhoto.querySelector('.orb-caption').setAttribute('aria-hidden', 'true');
    activePhoto = null;
    pinned = false;
  }

  function showPhoto(button) {
    if (decorativeOrbs.matches || button === activePhoto) return;
    closePhoto();
    // Keep both image states and their caption in the same moving circle.
    button.style.setProperty('--active-photo', 'url("' + button.dataset.activeImage + '")');
    button.querySelector('.orb-caption').setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-describedby', button.querySelector('.orb-details').id);
    button.setAttribute('aria-expanded', 'true');
    button.parentElement.classList.add('showing');
    activePhoto = button;
  }

  for (const {button} of flights) {
    button.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') showPhoto(button);
    });
    button.addEventListener('pointerleave', () => {
      if (!pinned && activePhoto === button && !button.matches(':focus-visible')) closePhoto();
    });
    button.addEventListener('focus', () => {
      if (button.matches(':focus-visible')) showPhoto(button);
    });
    button.addEventListener('blur', () => {
      if (activePhoto === button) closePhoto();
    });
    button.addEventListener('click', event => {
      if (decorativeOrbs.matches || event.pointerType === 'touch') return;
      if (pinned && activePhoto === button) {
        closePhoto();
      } else {
        showPhoto(button);
        pinned = true;
      }
    });
  }
  document.addEventListener('pointerdown', event => {
    if (activePhoto && !event.target.closest('.orb-float')) closePhoto();
  });
  function updateOrbInteraction() {
    closePhoto();
    memories.inert = decorativeOrbs.matches;
  }
  decorativeOrbs.addEventListener('change', () => {
    updateOrbInteraction();
    measure();
  });
  updateOrbInteraction();
  new IntersectionObserver(([entry]) => {
    stage.classList.toggle('is-outside', !entry.isIntersecting);
  }).observe(stage);

  function setMenu(open, restoreFocus = true) {
    const wasOpen = menuOpen;
    menuOpen = open && compactNavigation.matches;
    open = menuOpen;
    header.classList.toggle('menu-open', open);
    root.classList.toggle('has-open-menu', open);
    menu.inert = compactNavigation.matches && !open;
    for (const element of behindMenu) element.inert = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    if (open) drawerClose.focus({preventScroll:true});
    else if (wasOpen && restoreFocus && compactNavigation.matches) toggle.focus({preventScroll:true});
  }
  toggle.addEventListener('click', () => setMenu(!menuOpen));
  drawerClose.addEventListener('click', () => setMenu(false));
  backdrop.addEventListener('click', () => setMenu(false));
  menu.addEventListener('click', event => {
    if (menuOpen && event.target.closest('a')) setMenu(false);
  });
  compactNavigation.addEventListener('change', () => setMenu(false));
  setMenu(false);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePhoto();
    if (!menuOpen) return;
    if (event.key === 'Escape') setMenu(false);
    if (event.key !== 'Tab') return;
    const first = drawerItems[0];
    const last = drawerItems.at(-1);
    const atEdge = event.shiftKey ? document.activeElement === first : document.activeElement === last;
    if (!atEdge) return;
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  });

  function updateNavigation() {
    header.classList.toggle('is-scrolled', scrollY > 8);
    const threshold = header.offsetHeight + Math.min(120, innerHeight * .14);
    const atBottom = Math.ceil(scrollY + innerHeight) >= root.scrollHeight - 1;
    const visible = atBottom ? navSections.at(-1) :
      navSections.findLast(({section}) => section.getBoundingClientRect().top <= threshold);
    if (visible === activeSection) return;
    activeSection?.link.removeAttribute('aria-current');
    visible?.link.setAttribute('aria-current', 'location');
    activeSection = visible;
  }
  function measureHeader() {
    root.style.setProperty('--header-height', header.offsetHeight + 'px');
    updateNavigation();
  }
  new ResizeObserver(measureHeader).observe(header);
  measureHeader();

  function measure() {
    closePhoto();
    root.classList.toggle('has-motion', animatesHero());
    const box = intro.getBoundingClientRect();
    const stageHeight = stage.offsetHeight;
    metrics = {
      top: box.top + scrollY,
      distance: Math.max(1, box.height - stageHeight),
      height: stageHeight,
      width: wordWindow.clientWidth,
      wordTravel: Math.max(0, word.offsetWidth - wordWindow.clientWidth)
    };
    cancelAnimationFrame(frame);
    for (const flight of flights) flight.phase = undefined;
    previousProgress = -1;
    update(performance.now(), true);
  }
  function animatesHero() {
    return !motion.matches;
  }
  function update(now, snap = false) {
    frame = 0;
    const pageScroll = scrollY;
    const touchLayout = decorativeOrbs.matches;
    if (snap || (!touchLayout && pageScroll !== navigationScroll)) {
      navigationScroll = pageScroll;
      updateNavigation();
    }
    const progress = animatesHero() ? limit((pageScroll - metrics.top) / metrics.distance) : 0;
    if (progress !== previousProgress) {
      if (!touchLayout) {
        history.style.setProperty('--history-lead', ((progress - 1) * metrics.distance).toFixed(2) + 'px');
      }
      for (const flight of flights) {
        const {slot, start, end, drift, lift} = flight;
        const phase = smooth(limit((progress - start) / (end - start)));
        if (phase === flight.phase) continue;
        flight.phase = phase;
        const opacity = 1 - smooth(limit((phase - .76) / .24));
        const x = (metrics.width * phase * drift).toFixed(2);
        const y = (-metrics.height * phase * lift).toFixed(2);
        slot.style.transform = phase ? `translate3d(${x}px,${y}px,0)` : '';
        slot.style.opacity = String(opacity);
        slot.classList.toggle('is-flown', opacity === 0);
        slot.inert = opacity < .05;
      }
      copy.style.opacity = String(1 - smooth(limit((progress - .55) / .32)));
      copy.inert = progress >= .87;
      previousProgress = progress;
    }
    // The type follows the second stretch of scroll after the last photograph leaves.
    const target = smooth(limit((progress - .50) / .50));
    const elapsed = previousFrame ? Math.min(40, now - previousFrame) : 16;
    const outside = pageScroll >= metrics.top + metrics.distance + metrics.height * .15;
    const oldWordProgress = wordProgress;
    wordProgress = snap || touchLayout || outside ? target :
      wordProgress + (target - wordProgress) * (1 - Math.exp(-elapsed / 70));
    if (Math.abs(wordProgress - target) < .00015) wordProgress = target;
    if (snap || wordProgress !== oldWordProgress) {
      word.style.setProperty('--word-x', (-metrics.wordTravel * wordProgress).toFixed(2) + 'px');
      wordWindow.style.transform = 'translateY(' + (-metrics.height * .23 * wordProgress).toFixed(2) + 'px)';
    }
    previousFrame = wordProgress === target ? 0 : now;
    if (wordProgress !== target) frame = requestAnimationFrame(update);
  }
  function queue() {
    if (decorativeOrbs.matches || !animatesHero()) {
      if (!navigationTimer) {
        navigationTimer = setTimeout(() => {
          navigationTimer = undefined;
          updateNavigation();
        }, 80);
      }
    }
    if (!animatesHero()) return;
    if (decorativeOrbs.matches && previousProgress === 1 && scrollY >= metrics.top + metrics.distance) return;
    closePhoto();
    if (!frame) frame = requestAnimationFrame(update);
  }
  motion.addEventListener('change', measure);
  document.fonts.ready.then(measure);
  window.addEventListener('resize', measure, { passive:true });
  window.addEventListener('scroll', queue, { passive:true });
  window.addEventListener('pageshow', measure);
  measure();
})();
