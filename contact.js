
    (function(){
      /* Header shrink toggle + reveal */
      const header = document.querySelector('header');
      const revealEls = document.querySelectorAll('.reveal');
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
      window.addEventListener('scroll', onScroll, {passive:true});
      onScroll();

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      }, {threshold: 0.12});
      revealEls.forEach(el => obs.observe(el));
    })();

    /* ===== Formspree AJAX submit (wire-up) ===== */
    (function(){
      const form = document.getElementById('contactForm');
      const feedback = document.getElementById('formFeedback');
      const fileInput = document.getElementById('fileInput');
      const fileName = document.getElementById('fileName');

      // file chooser UI
      document.querySelector('.file-label').addEventListener('click', e => fileInput.click());
      fileInput.addEventListener('change', () => {
        fileName.textContent = fileInput.files.length ? fileInput.files[0].name : 'No file chosen';
      });

      // Formspree endpoint
      const FORMSPREE_URL = 'https://formspree.io/f/xanpbzdr';

      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        feedback.className = 'feedback'; feedback.textContent = '';

        // gather form data
        const fd = new FormData(form);

        // include the file if chosen (Formspree file uploads may require paid plan)
        if (fileInput.files.length) {
          fd.append('attachment', fileInput.files[0]);
        }

        // Basic validation
        const name = (fd.get('name') || '').toString().trim();
        const email = (fd.get('email') || '').toString().trim();
        const subject = (fd.get('subject') || '').toString().trim();
        const message = (fd.get('message') || '').toString().trim();
        if (!name || !email || !subject || !message) {
          feedback.classList.add('error');
          feedback.textContent = 'Please fill name, email, subject and message before sending.';
          return;
        }

        // UI while sending
        feedback.classList.add('success');
        feedback.textContent = 'Sending…';

        try {
          const resp = await fetch(FORMSPREE_URL, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: fd
          });

          if (resp.ok) {
            feedback.className = 'feedback success';
            feedback.textContent = 'Thanks — your message has been received. We will respond within 48 hours.';
            form.reset();
            fileName.textContent = 'No file chosen';
          } else {
            let errText = 'An error occurred while sending the message.';
            try {
              const data = await resp.json();
              if (data && data.errors && data.errors.length) errText = data.errors.map(e => e.message).join(', ');
            } catch (err) { /* ignore parse error */ }
            feedback.className = 'feedback error';
            feedback.textContent = errText;
          }
        } catch (err) {
          feedback.className = 'feedback error';
          feedback.textContent = 'Network error — please try again later.';
          console.error('Formspree submit error:', err);
        }
      });

      form.addEventListener('reset', () => {
        feedback.className = 'feedback';
        feedback.textContent = '';
        fileName.textContent = 'No file chosen';
      });
    })();
