// slider logic
const slides = [];
document.querySelectorAll('.character-slider > .character').forEach((c, i) => {
  // convert existing .character blocks into slides layout expected
  // We'll wrap content into slide and append a right image using the existing img src
  const slide = document.createElement('div');
  slide.className = 'slide';
  // left info card
  const info = document.createElement('div');
  info.className = 'info-card';
  const name = document.createElement('h3');
  name.textContent = c.querySelector('h3').textContent || `Character ${i + 1}`;
  const cv = document.createElement('div');
  cv.className = 'cv';
  cv.textContent = c.querySelector('p') ? '' : '';
  // table (age/height/measurements) - optional placeholders
  const table = document.createElement('div');
  table.className = 'info-table';
  // sample rows (you can change these values in HTML if you want)
  const rows = [
    ['Age', ':', '18 Years Old'],
    ['Height', ':', '156cm'],
    ['Measurements', ':', 'B85 / W54 / H89']
  ];
  rows.forEach(r => {
    const row = document.createElement('div');
    row.className = 'row';
    const left = document.createElement('div'); left.textContent = r[0];
    const middle = document.createElement('div'); middle.textContent = r[1];
    const right = document.createElement('div'); right.textContent = r[2];
    left.style.opacity = 0.8;
    row.appendChild(left);
    row.appendChild(right);
    table.appendChild(row);
  });
  const desc = document.createElement('div');
  desc.className = 'info-desc';
  desc.textContent = c.querySelector('p') ? c.querySelector('p').textContent : 'A part-time staff always supporting the Boss. An "ordinary" girl you might find anywhere. She actively engages in conversations with other girls, creating a friendly atmosphere. However, beneath her outgoing demeanor lies a shy personality; she struggles with self-confidence and often finds it challenging to take that first step forward.';

  // More button
  const moreBtn = document.createElement('div');
  moreBtn.className = 'more-btn';
  moreBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg> More';

  // append
  info.appendChild(name);
  // optional CV line (uses data-cv attr if set)
  if (c.dataset.cv) {
    const cvLine = document.createElement('div'); cvLine.className = 'cv'; cvLine.textContent = c.dataset.cv;
    info.appendChild(cvLine);
  } else {
    const cvLine = document.createElement('div'); cvLine.className = 'cv'; cvLine.textContent = 'CV: Minami Tsuda'; info.appendChild(cvLine);
  }
  info.appendChild(table);
  info.appendChild(desc);
  info.appendChild(moreBtn);

  // floating icons
  const iconCol = document.createElement('div'); iconCol.className = 'icon-column';
  const icons = [
    { symbol: '🔊', html: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>' },
    { symbol: '🎵', html: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>' },
    { symbol: '📷', html: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>' }
  ];
  icons.forEach(icon => {
    const btn = document.createElement('div');
    btn.className = 'icon';
    btn.innerHTML = icon.html;
    iconCol.appendChild(btn);
  });

  // right image
  const imgSrc = c.querySelector('img') ? c.querySelector('img').getAttribute('src') : '';
  const img = document.createElement('img'); img.className = 'char-image'; img.src = imgSrc; img.alt = name.textContent;

  // assemble slide: info + icons + image
  const leftWrapper = document.createElement('div');
  leftWrapper.style.display = 'flex';
  leftWrapper.style.gap = '12px';
  leftWrapper.style.alignItems = 'flex-start';
  leftWrapper.appendChild(info);
  leftWrapper.appendChild(iconCol);

  slide.appendChild(leftWrapper);
  slide.appendChild(img);

  // append slide to slider container
  document.querySelector('.character-slider').appendChild(slide);
  slides.push(slide);

  // remove original character element
  c.remove();
});

// create dots and controls
const dotsContainer = document.createElement('div'); dotsContainer.className = 'dots';
const controls = document.createElement('div'); controls.className = 'slider-controls';
const prevBtn = document.createElement('button'); prevBtn.innerHTML = '&#10094;';
const nextBtn = document.createElement('button'); nextBtn.innerHTML = '&#10095;';
controls.appendChild(prevBtn); controls.appendChild(nextBtn);
document.querySelector('.gallery').appendChild(controls);
document.querySelector('.gallery').appendChild(dotsContainer);

// create dots
slides.forEach((s, idx) => {
  const dot = document.createElement('div'); dot.className = 'dot';
  dot.addEventListener('click', () => { goTo(idx); });
  dotsContainer.appendChild(dot);
});

let current = 0;
function update() {
  slides.forEach((s, i) => {
    if (i === current) { s.classList.add('active'); } else { s.classList.remove('active'); }
  });
  // update dots
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
}
function goTo(i) { current = (i + slides.length) % slides.length; update(); }
prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

// auto play
let autoplay = setInterval(() => { goTo(current + 1); }, 5000);
function resetAuto() { clearInterval(autoplay); autoplay = setInterval(() => { goTo(current + 1); }, 5000); }

// pause on hover
const galleryEl = document.querySelector('.gallery');
galleryEl.addEventListener('mouseenter', () => clearInterval(autoplay));
galleryEl.addEventListener('mouseleave', () => { resetAuto(); });

// initialize
goTo(0);
// Auto-hide promo after 10 seconds
setTimeout(() => {
  const promo = document.querySelector('.promo');
  if (promo) {
    promo.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    promo.style.opacity = '0';
    promo.style.transform = 'translateY(30px)';
    setTimeout(() => promo.remove(), 600); // optional: remove from DOM
  }
}, 10000); // 10 seconds

// Story section parallax scroll effect
window.addEventListener('scroll', () => {
  const storySection = document.querySelector('.story');
  const diamonds = document.querySelector('.story-diamonds');
  
  if (storySection && diamonds) {
    const rect = storySection.getBoundingClientRect();
    const scrolled = window.pageYOffset;
    
    // Only apply parallax when story section is in view
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      // Calculate scroll progress within the story section
      const sectionHeight = storySection.offsetHeight;
      const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + sectionHeight)));
      
      // Individual diamond movements with limited range
      const diamondElements = document.querySelectorAll('.diamond');
      diamondElements.forEach((diamond, index) => {
        const speed = 0.05 + (index * 0.02); // Much smaller movement
        const yPos = scrollProgress * 50 * speed; // Limited to 50px range
        diamond.style.transform = `rotate(45deg) translateY(${yPos}px)`;
      });
    }
  }
});

// Video handling for movies section
document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.movie-thumbnail');
  
  videos.forEach(video => {
    // Ensure video is ready to play
    video.addEventListener('loadedmetadata', () => {
      console.log('Video loaded:', video.src);
    });

    // Handle video errors
    video.addEventListener('error', (e) => {
      console.error('Video error:', video.src, e);
      const errorMsg = document.createElement('div');
      errorMsg.className = 'video-error';
      errorMsg.textContent = 'Video could not be loaded';
      errorMsg.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        background: rgba(0,0,0,0.7);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
      `;
      video.parentElement.appendChild(errorMsg);
    });

    // Add click handler to play/pause
    video.addEventListener('click', (e) => {
      if (video.paused) {
        video.play().catch(err => {
          console.error('Play error:', err);
        });
      } else {
        video.pause();
      }
    });

    // Prevent default behavior on parent
    video.parentElement.addEventListener('click', (e) => {
      if (e.target !== video) {
        e.preventDefault();
        if (video.paused) {
          video.play().catch(err => {
            console.error('Play error:', err);
          });
        } else {
          video.pause();
        }
      }
    });
  });
});
