// CUSTOM CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx+'px'; cursor.style.top = my+'px'; });
  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = (rx - 18)+'px';
    ring.style.top  = (ry - 18)+'px';
    requestAnimationFrame(animRing);
  }
  animRing();
  document.querySelectorAll('a, button, .portfolio-card, .vfx-card, .upload-zone').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(2)'; ring.style.width = '60px'; ring.style.height = '60px'; });
    el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; ring.style.width = '36px'; ring.style.height = '36px'; });
  });

  // FILE UPLOAD — show previews in portfolio grid
  document.getElementById('fileInput').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    const grid = document.getElementById('portfolioGrid');
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      const card = document.createElement('div');
      card.className = 'portfolio-card';
      const isVideo = file.type.startsWith('video/');
      card.innerHTML = `
        ${isVideo
          ? `<video class="card-thumb" src="${url}" muted loop preload="metadata"></video>`
          : `<img class="card-thumb" src="${url}" alt="${file.name}"/>`
        }
        <div class="card-body">
          <div class="card-tag">${isVideo ? 'Video' : 'Design'}</div>
          <div class="card-title">${file.name.replace(/\.[^.]+$/, '')}</div>
          <div class="card-desc">Uploaded work — ${(file.size/1024/1024).toFixed(1)} MB</div>
        </div>`;
      if (isVideo) {
        card.querySelector('video').addEventListener('mouseenter', v => v.target.play());
        card.querySelector('video').addEventListener('mouseleave', v => v.target.pause());
      }
      grid.prepend(card);
    });
  });

  // DRAG & DROP
  const zone = document.getElementById('uploadZone');
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--purple-bright)'; });
  zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.style.borderColor = '';
    const dt = new DataTransfer();
    Array.from(e.dataTransfer.files).forEach(f => dt.items.add(f));
    document.getElementById('fileInput').files = dt.files;
    document.getElementById('fileInput').dispatchEvent(new Event('change'));
  });

 

  // SCROLL REVEAL
  const observer = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.style.opacity = '1'; en.target.style.transform = 'none'; }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.portfolio-card, .vfx-card, .yt-banner, .about-photo').forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });