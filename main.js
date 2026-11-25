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
  const phoneViewport = window.visualViewport;
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
  let previousWordEntry;
  let previousWordExit;
  let previousProgress = -1;
  let historyLead;
  let navigationScroll;
  let navigationTimer;
  let menuOpen = false;
  let phoneCoverWidth;
  let phoneCoverHeight;
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

  function fitPhoneCover() {
    if (!decorativeOrbs.matches) {
      if (phoneCoverHeight === undefined) return;
      intro.style.removeProperty('--phone-cover-height');
      phoneCoverWidth = phoneCoverHeight = undefined;
      return;
    }
    if (phoneViewport && Math.abs(phoneViewport.scale - 1) > .01) return;
    const width = root.clientWidth;
    // Mobile browser bars can change height mid-swipe. Keep the scroll geometry stable then.
    if (width === phoneCoverWidth && scrollY > 1) return;
    const height = Math.round(phoneViewport?.height ?? innerHeight);
    if (height <= 0) return;
    phoneCoverWidth = width;
    if (height === phoneCoverHeight) return;
    phoneCoverHeight = height;
    intro.style.setProperty('--phone-cover-height', height + 'px');
  }
  function measure() {
    closePhoto();
    fitPhoneCover();
    root.classList.toggle('has-motion', animatesHero());
    const box = intro.getBoundingClientRect();
    const stageHeight = stage.offsetHeight;
    const wordHeight = word.offsetHeight;
    const wordWidth = word.offsetWidth;
    const width = wordWindow.clientWidth;
    const distance = Math.max(1, box.height - stageHeight);
    const touchLayout = decorativeOrbs.matches;
    const wordCenter = Math.round(stageHeight * .49);
    const photoHandoff = stageHeight - wordCenter;
    const fadeDistance = Math.min(72, stageHeight * .10);
    const wordTail = touchLayout ? photoHandoff + fadeDistance : 0;
    const gutter = touchLayout ? parseFloat(getComputedStyle(wordWindow).paddingLeft) || 0 : 0;
    const fitWidth = Math.max(1, Math.min(wordWidth, width - gutter * 2, 780));
    metrics = {
      top: box.top + scrollY,
      pinEnd: box.top + scrollY + distance,
      distance: distance + wordTail,
      pinShare: distance / (distance + wordTail),
      height: stageHeight,
      width,
      wordTravel: Math.max(0, wordWidth - width),
      wordLift: touchLayout ? wordWindow.offsetTop + wordWindow.offsetHeight / 2 - wordCenter : stageHeight * .23,
      wordScale: fitWidth / Math.max(1, wordWidth),
      wordInset: (width - fitWidth) / 2,
      photoHandoff,
      fadeDistance,
      wordTail,
      wordRevealLimit: wordHeight + 28
    };
    cancelAnimationFrame(frame);
    for (const flight of flights) {
      flight.phase = undefined;
      if (touchLayout) {
        const {slot} = flight;
        flight.exitDistance = Math.max(0, slot.offsetTop + slot.offsetHeight + 18);
        const side = slot.offsetLeft + slot.offsetWidth / 2 < metrics.width / 2 ? -1 : 1;
        flight.exitDrift = Math.abs(flight.drift) * side;
      }
    }
    previousProgress = -1;
    update(performance.now(), true);
  }
  function animatesHero() {
    return !motion.matches;
  }
  function followScroll(current, target, elapsed, timeConstant, threshold) {
    const next = current + (target - current) * (1 - Math.exp(-elapsed / timeConstant));
    return Math.abs(next - target) < threshold ? target : next;
  }

  const wheelMotion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let wheelFrame = 0;
  let wheelPosition;
  let wheelTarget;
  let wheelLastScroll;
  let wheelTime;

  function stopWheelScroll() {
    cancelAnimationFrame(wheelFrame);
    wheelFrame = 0;
  }

  function stepWheelScroll(now) {
    wheelFrame = 0;
    // Yield when another control moves the page while wheel momentum is settling.
    if (scrollY !== wheelLastScroll) return;
    const elapsed = Math.max(0, Math.min(32, now - wheelTime));
    wheelPosition = followScroll(wheelPosition, wheelTarget, elapsed, 72, .75);
    wheelTime = now;
    window.scrollTo({top: wheelPosition, behavior: 'instant'});
    wheelLastScroll = scrollY;
    if (wheelPosition !== wheelTarget) wheelFrame = requestAnimationFrame(stepWheelScroll);
  }

  function smoothWheel(event) {
    if (event.defaultPrevented || !event.cancelable || menuOpen ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
        Math.abs(event.deltaX) >= Math.abs(event.deltaY) || event.target.closest?.('.orb-caption')) {
      stopWheelScroll();
      return;
    }
    const mode = event.deltaMode;
    const unit = mode === WheelEvent.DOM_DELTA_LINE ? 16 : mode === WheelEvent.DOM_DELTA_PAGE ? root.clientHeight : 1;
    const delta = event.deltaY * unit;
    const current = scrollY;
    const continuing = wheelFrame && current === wheelLastScroll;
    const sameDirection = continuing && Math.sign(wheelTarget - current) === Math.sign(delta);
    const target = Math.max(0, Math.min(root.scrollHeight - root.clientHeight, (sameDirection ? wheelTarget : current) + delta));
    if (!continuing && target === current) return;
    event.preventDefault();
    if (!continuing) {
      wheelPosition = wheelLastScroll = current;
      wheelTime = performance.now();
    }
    wheelTarget = target;
    if (!wheelFrame) wheelFrame = requestAnimationFrame(stepWheelScroll);
  }

  function bindWheelMotion() {
    if (wheelMotion.matches) window.addEventListener('wheel', smoothWheel, {passive:false});
    else {
      window.removeEventListener('wheel', smoothWheel);
      stopWheelScroll();
    }
  }
  wheelMotion.addEventListener('change', bindWheelMotion);
  window.addEventListener('pointerdown', stopWheelScroll, {passive:true});
  window.addEventListener('keydown', stopWheelScroll);
  bindWheelMotion();

  function renderPhoneWord(coverProgress, pageScroll, snap) {
    const entry = smooth(limit((coverProgress - .50) / .25));
    const exit = Math.min(metrics.wordTail, Math.max(0, pageScroll - metrics.pinEnd));
    if (!snap && entry === previousWordEntry && exit === previousWordExit) return;
    previousWordEntry = entry;
    previousWordExit = exit;
    // After the cover releases, keep the fitted name still while the photo rises to meet it.
    const y = (Math.min(exit, metrics.photoHandoff) - metrics.wordLift) * entry;
    const opacity = 1 - smooth(limit((exit - metrics.photoHandoff) / metrics.fadeDistance));
    word.style.setProperty('--word-x', (metrics.wordInset * entry).toFixed(2) + 'px');
    word.style.setProperty('--word-scale', (1 - (1 - metrics.wordScale) * entry).toFixed(4));
    wordWindow.style.setProperty('--word-reveal-depth', (metrics.wordRevealLimit * entry).toFixed(1) + 'px');
    wordWindow.style.transform = 'translateY(' + y.toFixed(2) + 'px)';
    wordWindow.style.opacity = String(opacity);
  }
  function update(now, snap = false) {
    frame = 0;
    const pageScroll = scrollY;
    const touchLayout = decorativeOrbs.matches;
    if (snap || (!touchLayout && pageScroll !== navigationScroll)) {
      navigationScroll = pageScroll;
      updateNavigation();
    }
    const scrollProgress = animatesHero() ? limit((pageScroll - metrics.top) / metrics.distance) : 0;
    const elapsed = previousFrame ? Math.min(40, now - previousFrame) : 16;
    const outside = pageScroll >= metrics.top + metrics.distance + metrics.height * .15;
    const progress = touchLayout && !snap && !outside
      ? followScroll(previousProgress, scrollProgress, elapsed, 86, .0006)
      : scrollProgress;
    const lead = (scrollProgress - 1) * metrics.distance;
    if (!touchLayout && (snap || lead !== historyLead)) {
      history.style.setProperty('--history-lead', lead.toFixed(2) + 'px');
      historyLead = lead;
    }
    const coverProgress = limit(progress / metrics.pinShare);
    if (snap || coverProgress !== limit(previousProgress / metrics.pinShare)) {
      for (const flight of flights) {
        const {slot, drift, lift} = flight;
        // Give each phone orb more room to accelerate while finishing before the title starts.
        const start = touchLayout ? .012 + .44 * flight.start : flight.start;
        const end = touchLayout ? .19 + .61 * flight.end : flight.end;
        const phase = smooth(limit((coverProgress - start) / (end - start)));
        if (phase === flight.phase) continue;
        flight.phase = phase;
        const fadeProgress = touchLayout ? phase / .8 : (phase - .76) / .24;
        const opacity = 1 - smooth(limit(fadeProgress));
        const driftPhase = touchLayout ? phase * (2 - phase) * 1.5 : phase;
        const driftDirection = touchLayout ? flight.exitDrift : drift;
        const liftDistance = touchLayout ? flight.exitDistance : metrics.height * lift;
        const x = (metrics.width * driftPhase * driftDirection).toFixed(2);
        const y = (-liftDistance * phase).toFixed(2);
        slot.style.transform = phase ? `translate3d(${x}px,${y}px,0)` : '';
        slot.style.opacity = String(opacity);
        slot.classList.toggle('is-flown', opacity === 0);
        slot.inert = opacity < .05;
      }
      const copyFade = touchLayout ? limit((coverProgress - .50) / .22) : limit((coverProgress - .55) / .32);
      copy.style.opacity = String(1 - smooth(copyFade));
      copy.inert = copyFade === 1;
    }
    previousProgress = progress;
    let wordInFlight = false;
    if (touchLayout && animatesHero()) {
      renderPhoneWord(coverProgress, pageScroll, snap);
    } else {
      if (snap) wordWindow.style.opacity = '';
      const target = smooth(limit((progress - .50) / .50));
      const oldWordProgress = wordProgress;
      wordProgress = snap || outside ? target : followScroll(wordProgress, target, elapsed, 70, .00015);
      if (snap || wordProgress !== oldWordProgress) {
        word.style.setProperty('--word-x', (-metrics.wordTravel * wordProgress).toFixed(2) + 'px');
        wordWindow.style.transform = 'translateY(' + (-metrics.wordLift * wordProgress).toFixed(2) + 'px)';
      }
      wordInFlight = wordProgress !== target;
    }
    if (progress !== scrollProgress || wordInFlight) {
      previousFrame = now;
      frame = requestAnimationFrame(update);
    } else {
      previousFrame = 0;
    }
  }
  function queue() {
    if (decorativeOrbs.matches && scrollY <= 1) fitPhoneCover();
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
  (phoneViewport ?? window).addEventListener('resize', fitPhoneCover, { passive:true });
  document.fonts.ready.then(measure);
  // Stable cover dimensions shouldn't be remeasured when Safari hides its toolbar.
  const heroResize = new ResizeObserver(measure);
  heroResize.observe(intro);
  heroResize.observe(word);
  window.addEventListener('scroll', queue, { passive:true });
  window.addEventListener('pageshow', measure);
  measure();
})();
