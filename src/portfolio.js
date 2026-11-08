document.querySelector('.menu-toggle')?.addEventListener('click', function () {
  const open = this.getAttribute('aria-expanded') !== 'true';
  this.setAttribute('aria-expanded', String(open));
  document.querySelector('.nav').classList.toggle('is-open', open);
  this.textContent = open ? 'Close' : 'Menu';
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
  document.querySelector('.nav').classList.remove('is-open');
  const button = document.querySelector('.menu-toggle');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'Menu';
}));
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let count = 0;
  document.querySelectorAll('[data-category]').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && !card.dataset.category.split(' ').includes(button.dataset.filter);
    if (!card.hidden) count++;
  });
  document.querySelector('.results-count').textContent = `${count} projects`;
}));

const sectionNav = document.querySelector('.case-toc');
if (sectionNav) {
  const links = [...sectionNav.querySelectorAll('a[href^="#"]')];
  const headings = links.map(link => document.getElementById(link.hash.slice(1)));
  const picker = sectionNav.querySelector('.case-section-picker');
  picker.hidden = false;
  sectionNav.classList.add('has-picker');

  picker.addEventListener('change', () => {
    const heading = document.getElementById(picker.value);
    if (!heading) return;
    // Use the same native fragment navigation as the desktop links.
    window.location.hash = heading.id;
    heading.focus({ preventScroll: true });
  });

  const updateSection = () => {
    // Match the page's scroll padding so a jump selects its destination.
    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 100;
    let current = -1;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= offset + 8) current = index;
    });
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = headings.length - 1;
    }
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    // Keep the native menu stable while it is being used with the keyboard.
    if (document.activeElement !== picker) picker.value = current < 0 ? '' : headings[current].id;
  };
  let scheduled = false;
  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      updateSection();
    });
  };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  document.querySelector('.case-content').addEventListener('load', scheduleUpdate, true);
  picker.addEventListener('blur', scheduleUpdate);
  updateSection();
}
