(() => {
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('menuToggle');

  // Sticky header style on scroll
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Reveal on scroll
  const revealTargets = document.querySelectorAll(
    '.section-head, .about-copy, .card, .values li, .person, .benefit, .job, .flow-list li, .faq-list details, .contact-form, .mission-statement, .num-item'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => io.observe(el));

  // Animated number counters
  const counters = document.querySelectorAll('.num-value');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffixEl = el.querySelector('.plus, .percent');
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.floor(target * eased);
        if (suffixEl) {
          suffixEl.textContent = val;
          // Preserve existing text node structure: set initial text before suffix span
          el.childNodes.forEach(n => { if (n.nodeType === 3) n.textContent = ''; });
        } else {
          el.textContent = val;
        }
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => countIO.observe(c));

  // Close other <details.job> when one opens (accordion behavior)
  const jobs = document.querySelectorAll('.job');
  jobs.forEach(j => {
    j.addEventListener('toggle', () => {
      if (j.open) {
        jobs.forEach(o => { if (o !== j) o.open = false; });
      }
    });
  });

  // Entry form (mock handler)
  const form = document.getElementById('entryForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.className = 'form-note';
      note.textContent = '';
      if (!form.checkValidity()) {
        note.classList.add('error');
        note.textContent = '必須項目をご確認のうえ、再度お試しください。';
        form.reportValidity();
        return;
      }
      const btn = form.querySelector('button[type=submit]');
      const originalLabel = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '送信中…';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalLabel;
        form.reset();
        note.classList.add('success');
        note.textContent = 'エントリーを受け付けました。担当より3営業日以内にご連絡いたします。';
      }, 900);
    });
  }
})();
