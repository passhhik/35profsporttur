(() => {
  const section = document.getElementById('programme');
  if (!section) return;
  const tabs = Array.from(section.querySelectorAll('[role="tab"]'));
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const stepButtons = Array.from(section.querySelectorAll('[data-step]'));
  let current = Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'));

  function showDay(index) {
    if (index < 0 || index >= tabs.length || index === current) return;
    current = index;
    tabs.forEach((tab, i) => {
      const active = i === current;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
      panels[i].classList.toggle('is-entering', active);
    });
    stepButtons.forEach(button => {
      const next = current + Number(button.dataset.step);
      button.disabled = next < 0 || next >= tabs.length;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showDay(index));
    tab.addEventListener('keydown', event => {
      let next;
      switch (event.key) {
        case 'ArrowRight': next = (index + 1) % tabs.length; break;
        case 'ArrowLeft': next = (index - 1 + tabs.length) % tabs.length; break;
        case 'Home': next = 0; break;
        case 'End': next = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      showDay(next);
      tabs[next].focus({preventScroll: true});
    });
  });
  stepButtons.forEach(button => button.addEventListener('click', () => {
    showDay(current + Number(button.dataset.step));
    tabs[current].focus({preventScroll: true});
    section.querySelector('.programme-tabs').scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  }));
})();
