(() => {
  const track = document.getElementById('history');
  const section = track?.querySelector('.hs');
  if (!section) return;
  const cards = Array.from(section.querySelectorAll('.hs-card'));
  const photos = Array.from(section.querySelectorAll('.hs-image'));
  const credits = Array.from(section.querySelectorAll('.hs-credit'));
  const previous = section.querySelector('.hs-prev');
  const next = section.querySelector('.hs-next');
  const toggle = section.querySelector('.hs-play');
  const ruler = section.querySelector('.hs-ruler-track');
  const announce = section.querySelector('.hs-announce');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const count = cards.length;
  const last = count - 1;
  const dwell = 8000;
  const wrap = value => (value % count + count) % count;
  const clamp = value => Math.min(1, Math.max(0, value));
  const smooth = value => value * value * (3 - 2 * value);

  let index = -1;
  let position = 0;
  let intendedYear = null;
  let paused = reducedMotion.matches;
  let keyboardFocus = false;
  let visible = false;
  let pinned = false;
  let lastPhysical = null;
  let animation = 0;
  let scrollFrame = 0;
  let timer;
  let touchOrigin;
  let lastSwipe = -Infinity;

  function describeYear(active, manual) {
    if (active === index) return;
    index = active;
    cards.forEach((card, i) => card.setAttribute('aria-hidden', String(i !== index)));
    credits.forEach((credit, i) => { credit.hidden = i !== index; });
    section.dataset.year = cards[index].dataset.year;
    previous.setAttribute('aria-label', 'Предыдущий год — ' + cards[wrap(index - 1)].dataset.year);
    next.setAttribute('aria-label', 'Следующий год — ' + cards[wrap(index + 1)].dataset.year);
    if (manual) announce.textContent = cards[index].dataset.year + '. ' + cards[index].querySelector('p').textContent;
  }

  // Use one fractional year for all three layers, including interrupted clicks or a trackpad gesture.
  function render(value, manual = false) {
    position = value;
    const p = wrap(value);
    const lower = Math.floor(p);
    const upper = wrap(lower + 1);
    const fraction = p - lower;
    cards.forEach((card, i) => {
      let distance = i - p;
      // Only wrap neighbours while an arrow actually crosses the chronological boundary.
      if (p > last) {
        if (distance < -count / 2) distance += count;
        if (distance > count / 2) distance -= count;
      }
      card.style.setProperty('--hs-start', distance.toFixed(4));
    });
    photos.forEach((photo, i) => {
      photo.style.opacity = i === lower ? '1' : i === upper ? String(fraction) : '0';
      photo.style.zIndex = i === upper ? '1' : '0';
    });
    ruler.style.setProperty('--hs-ruler-position', String(-p));
    describeYear(wrap(Math.round(p)), manual);
  }

  function updateToggle() {
    const label = paused ? 'Включить автопереключение' : 'Приостановить автопереключение';
    toggle.textContent = label;
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
  }

  function schedule() {
    clearTimeout(timer);
    if (visible && !paused && !keyboardFocus && !document.hidden && (pinned || !track.classList.contains('is-scrollable'))) {
      timer = setTimeout(() => step(1, false), dwell);
    }
  }

  function measure() {
    const headerHeight = parseFloat(getComputedStyle(section).top) || 0;
    const start = track.getBoundingClientRect().top + scrollY - headerHeight;
    const distance = track.offsetHeight - section.offsetHeight;
    const offset = scrollY - start;
    return {
      start,
      distance,
      pinned: distance > 0 && offset >= -1 && offset <= distance + 1,
      year: distance > 0 ? clamp(offset / distance) * last : 0
    };
  }

  function cancelTransition() {
    cancelAnimationFrame(animation);
    animation = 0;
    intendedYear = null;
  }

  function readScroll() {
    scrollFrame = 0;
    if (!track.classList.contains('is-scrollable')) return;
    const state = measure();
    const pinChanged = state.pinned !== pinned;
    pinned = state.pinned;
    // Programmatic alignment to a clicked year can round to the nearest physical pixel.
    const tolerance = last / Math.max(1, state.distance);
    if (lastPhysical === null || Math.abs(state.year - lastPhysical) > tolerance) {
      lastPhysical = state.year;
      cancelTransition();
      const lower = Math.floor(state.year);
      const fraction = state.year - lower;
      // A short plateau around each year leaves its paragraph still enough to read.
      render(lower + smooth(clamp((fraction - .21) / .58)));
      schedule();
    } else if (pinChanged) {
      schedule();
    }
  }

  function queueScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(readScroll);
  }

  function step(direction, manual = true) {
    const target = wrap((intendedYear ?? index) + direction);
    cancelTransition();
    intendedYear = target;
    if (track.classList.contains('is-scrollable')) {
      const state = measure();
      if (state.pinned) {
        // Keep the same on-screen frame and synchronise its year with the native scroll track.
        lastPhysical = target;
        window.scrollTo({ top: state.start + target / last * state.distance, behavior: 'instant' });
      }
    }
    if (reducedMotion.matches) {
      render(target, manual);
      intendedYear = null;
    } else {
      const start = wrap(position);
      const distance = direction === 1 ? wrap(target - start) : -wrap(start - target);
      const began = performance.now();
      function tick(now) {
        const progress = clamp((now - began) / 650);
        render(start + distance * smooth(progress), manual);
        if (progress < 1) animation = requestAnimationFrame(tick);
        else {
          render(target, manual);
          animation = 0;
          intendedYear = null;
        }
      }
      animation = requestAnimationFrame(tick);
    }
    schedule();
  }

  previous.addEventListener('click', () => {
    if (performance.now() - lastSwipe > 450) step(-1);
  });
  next.addEventListener('click', () => {
    if (performance.now() - lastSwipe > 450) step(1);
  });
  toggle.addEventListener('click', () => {
    paused = !paused;
    keyboardFocus = false;
    updateToggle();
    schedule();
  });
  section.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  section.addEventListener('focusin', event => {
    keyboardFocus = event.target.matches(':focus-visible');
    schedule();
  });
  section.addEventListener('focusout', event => {
    if (!section.contains(event.relatedTarget)) {
      keyboardFocus = false;
      schedule();
    }
  });
  section.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target.closest('.hs-play, .hs-credit')) {
      touchOrigin = null;
      return;
    }
    const touch = event.changedTouches[0];
    touchOrigin = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  section.addEventListener('touchend', event => {
    if (!touchOrigin) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchOrigin.x;
    const dy = touch.clientY - touchOrigin.y;
    touchOrigin = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > 1.35 * Math.abs(dy)) {
      lastSwipe = performance.now();
      step(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
  section.addEventListener('touchcancel', () => { touchOrigin = null; });

  function configureTrack() {
    track.style.setProperty('--hs-intervals', last);
    track.classList.toggle('is-scrollable', !reducedMotion.matches && last > 0);
    if (reducedMotion.matches) {
      paused = true;
      cancelTransition();
      render(index);
    }
    pinned = false;
    lastPhysical = null;
    queueScroll();
    updateToggle();
    schedule();
  }

  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', queueScroll);
  window.addEventListener('pageshow', queueScroll);
  reducedMotion.addEventListener('change', configureTrack);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= .5;
      schedule();
    }, {threshold: [0, .5, 1]}).observe(section);
  } else {
    visible = true;
  }
  render(0);
  configureTrack();
})();
