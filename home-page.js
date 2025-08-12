//Dot around mouse cursor
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".custom-cursor");
  let mouseX = 0, mouseY = 0; // Mouse position
  let currentX = 0, currentY = 0;  //Dot position
  const lag = 0.1;

  // Cursor follows with lag
  function animateCursor() {
    currentX += (mouseX - currentX-5) * lag;
    currentY += (mouseY - currentY-5) * lag;
    cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Track mouse
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Detect background color under cursor
    const elementUnderCursor = document.elementFromPoint(mouseX, mouseY);
    if (elementUnderCursor) {
      const bg = window.getComputedStyle(elementUnderCursor).backgroundColor;
      const isBlack = bg === "rgb(0, 0, 0)";
      cursor.style.backgroundColor = isBlack ? "white" : "black";
    }
  });

  // Click ripple + scale
  window.addEventListener("mousedown", () => {
    cursor.classList.add("clicking", "rippling");
  });

  window.addEventListener("mouseup", () => {
    cursor.classList.remove("clicking");
    setTimeout(() => {
      cursor.classList.remove("rippling");
    }, 300);
  });
});


//Bg Vid Loop
(function () {
  const video = document.getElementById('bgvideo');
  if (!video) { console.error('bgVideo not found'); return; }

  const START_AT = 3;
  const END_AT   = 35;          // seconds
  const EPS      = 0.08;        // small buffer to avoid stutter

  // (Optional) background-style: no interaction, no PiP
  video.controls = false;
  video.setAttribute('disablepictureinpicture', '');
  video.setAttribute('controlsList', 'nofullscreen noplaybackrate noremoteplayback nodownload');

  function seekSafely(t) {
    try { video.currentTime = t; }
    catch (e) { /* iOS Safari can throw until metadata is ready */ }
  }

  function startPlayback() {
    // If END_AT is beyond duration (short video), clamp it
    const end = Math.min(END_AT, (isFinite(video.duration) ? video.duration : END_AT));
    // Ensure we actually start at START_AT each time
    seekSafely(Math.min(START_AT, Math.max(0, end - 0.1)));
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(()=>{}); // ignore autoplay promises
  }

  // 1) Wait for metadata before first seek
  if (video.readyState >= 1) {
    startPlayback();
  } else {
    video.addEventListener('loadedmetadata', startPlayback, { once: true });
  }

  // 2) Smooth segment loop: jump just before END_AT
  let jumping = false;
  video.addEventListener('timeupdate', () => {
    if (jumping) return;
    const endEdge = END_AT - EPS;
    if (video.currentTime >= endEdge) {
      jumping = true;
      // Use rAF to jump between frames to avoid visible freeze
      requestAnimationFrame(() => {
        seekSafely(START_AT);
        // On some browsers, calling play() helps keep it seamless
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(()=>{});
        jumping = false;
      });
    }
  });

  // 3) Safety: if video ends anyway, restart at START_AT
  video.addEventListener('ended', () => {
    seekSafely(START_AT);
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(()=>{});
  });

  // 4) iOS/Safari quirk: after we seek, ensure playback resumes
  video.addEventListener('seeked', () => {
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(()=>{});
  });
})();





//Sect3 animation
const bgElements = document.querySelectorAll(
  '.house-1 .bg, .house-2 .bg, .house-3 .bg, .house-4 .bg, .house-5 .bg, .find .bg'
);

function updateBgTransform() {
  const windowHeight = window.innerHeight;
  const startTrigger = windowHeight * 0.85; // element top hits bottom 80% of screen
  const endTrigger = windowHeight * 0.1;   // element top reaches top 20% of screen
  const triggerDistance = startTrigger - endTrigger;

  bgElements.forEach(bg => {
    const rect = bg.getBoundingClientRect();
    const elementTop = rect.top;

    // Scroll progress from 0 to 1
    const rawProgress = (startTrigger - elementTop) / triggerDistance;
    const progress = Math.min(Math.max(rawProgress, 0), 1); // clamp between 0 and 1

    // Interpolate from -3.5% to 0%
    const translateY = -20 + (20 * progress);

    bg.style.setProperty('--scrollY', `${translateY}%`);
  });
}

window.addEventListener('scroll', updateBgTransform);
window.addEventListener('resize', updateBgTransform);
window.addEventListener('load', updateBgTransform);






/////////////Section 3 Animation/////////////

const sect3 = document.querySelector('.sect-3');

window.addEventListener('scroll', () => {
  const rect = sect3.getBoundingClientRect();
  const sectionHeight = rect.height;

  const scrolledPast = 0 - rect.top;

  const startScroll = 0.7 * sectionHeight;  // 20%
  const endScroll = 0.92 * sectionHeight;    // 40%

  if (scrolledPast <= startScroll) {
    // Before animation range
    sect3.style.scale = '1';
    sect3.style.borderRadius = '0px';
  } else if (scrolledPast > startScroll && scrolledPast < endScroll) {
    // During animation range (20%–40%)
    const progress = (scrolledPast - startScroll) / (endScroll - startScroll);
    const scale = 1 - (0.1 * progress);        // From 1 to 0.8
    const radius = 50 * progress;             // From 0px to 100px

    sect3.style.scale = scale;
    sect3.style.borderRadius = `${radius}px`;
  } else if (scrolledPast >= endScroll) {
    // After 40% scroll — lock in final values
    sect3.style.scale = '0.9';
    sect3.style.borderRadius = '50px';
  }
});


/////////////Section 4 Animation/////////////
const sect4 = document.querySelector('.sect-4');

window.addEventListener('scroll', () => {
  const rect = sect4.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate percentage of section scrolled
  const visibleTop = Math.max(0, windowHeight - rect.top);
  const viewPercent = (visibleTop / rect.height) * 100;

  let scale = 0.95;
  let radius = 50;

  if (viewPercent >= 10 && viewPercent <= 40) {
    // ✅ Entry animation: scale 0.97 → 1, radius 50 → 0
    const progress = (viewPercent - 10) / (40 - 10);
    scale = 0.95 + (1 - 0.95) * progress;
    radius = 50 - (50 * progress);
  } else if (viewPercent > 40 && viewPercent <= 120) {
    // ✅ Hold full scale
    scale = 1;
    radius = 0;
  } else if (viewPercent > 120 && viewPercent <= 150) {
    // ✅ Exit animation: scale 1 → 0.97, radius 0 → 50
    const progress = (viewPercent - 120) / (150 - 120);
    scale = 1 - (1 - 0.95) * progress;
    radius = 0 + 50 * progress;
  } else if (viewPercent > 150) {
    // ✅ Exit-hold: stay scaled down
    scale = 0.95;
    radius = 50;
  }

  sect4.style.transform = `scale(${scale})`;
  sect4.style.borderRadius = `${radius}px`;
});


////Numbers Counting
const sect4Count = document.querySelector('.sect-4');
const counters = document.querySelectorAll('.rate h1');

let hasAnimated = false;

function animateCounter(element, target, suffix = '') {
  let count = 0;
  const duration = 8000; // 2 seconds
  const steps = Math.ceil(duration / 30);
  const increment = target / steps;

  const update = () => {
    count += increment;
    if (count < target) {
      element.textContent = Math.floor(count) + suffix;
      requestAnimationFrame(update);
    } else {
      element.textContent = target + suffix;
    }
  };

  requestAnimationFrame(update);
}

function handleScroll() {
  const rect = sect4Count.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const visibleTop = Math.max(0, windowHeight - rect.top);
  const viewPercent = (visibleTop / rect.height) * 100;

  if (viewPercent >= 50 && viewPercent <= 100 && !hasAnimated) {
    counters.forEach(counter => {
      const text = counter.textContent.trim();
      const match = text.match(/(\d+)([+%]*)/);
      const target = parseInt(match[1]);
      const suffix = match[2] || '';
      animateCounter(counter, target, suffix);
    });
    hasAnimated = true;
  }
}

window.addEventListener('scroll', handleScroll);



//section 6 animation
document.addEventListener("DOMContentLoaded", () => {
  const circles = document.querySelectorAll(".circle-anim");
  const smartText = document.querySelector(".smart-text-fade");
  const circleTexts = document.querySelectorAll(".circle-text");
  let hasAnimated = false;

  // Reset smart text
  const resetSmartText = () => {
    if (smartText) {
      smartText.style.opacity = "0";
      smartText.style.animation = "none";
    }
  };

  // Reset original texts inside circles
  const resetCircleTexts = () => {
    circleTexts.forEach((text) => {
      text.style.opacity = "1";
      text.style.animation = "none";
    });
  };

  const animateVennAndMerge = () => {
    // STEP 2: Venn layout animation
    circles[1].style.animation = "moveToVenn 2s cubic-bezier(0.77, 0, 0.175, 1) forwards";
    circles[0].style.animation = "moveToLeftVenn 2s cubic-bezier(0.77, 0, 0.175, 1) forwards";
    circles[2].style.animation = "moveToRightVenn 2s cubic-bezier(0.77, 0, 0.175, 1) forwards";

    // STEP 3: Wait for Venn to finish + 1s pause
    setTimeout(() => {
      // Lock transform to avoid jump
      circles.forEach((circle) => {
        const computedTransform = getComputedStyle(circle).transform;
        circle.style.transform = computedTransform;
        circle.style.animation = "none";
      });

      // Fade out texts inside circles (from 5% to 70%)
      circleTexts.forEach((text) => {
        text.style.animation = "fadeOutText 2s ease forwards";
      });

      // STEP 5: Merge animation
      setTimeout(() => {
        circles[1].style.animation = "moveToVennCentre 2s ease-in-out forwards";
        circles[0].style.animation = "moveToLeftVennCentre 2s ease-in-out forwards";
        circles[2].style.animation = "moveToRightVennCentre 2s ease-in-out forwards";

        // Fade in Smart Text at 75% of merge
        setTimeout(() => {
          if (smartText) {
            smartText.style.animation = "fadeInSmartText 1s ease forwards";
          }
        }, 750);
      }, 100);
    }, 3000); // 2s + 1s wait
  };

  const startLoop = () => {
    setInterval(() => {
      resetSmartText();     // Hide smart text again
      resetCircleTexts();   // Restore original texts
      animateVennAndMerge();
    }, 7500); // Full loop time
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        resetSmartText();
        resetCircleTexts();
        setTimeout(() => {
          animateVennAndMerge();
          setTimeout(() => {
            startLoop();
          }, 5500);
        }, 2000);
      }
    },
    {
      threshold: 0.5,
    }
  );

  const paymentSection = document.querySelector(".payment");
  if (paymentSection) observer.observe(paymentSection);
});


/////////////Section 5 Animation/////////////
const sect10 = document.querySelector('.sect-10');

window.addEventListener('scroll', () => {
  const rect = sect10.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate percentage of section scrolled
  const visibleTop = Math.max(0, windowHeight - rect.top);
  const viewPercent = (visibleTop / rect.height) * 100;

  let scale = 1;
  let radius = 0;

  if (viewPercent >= 10 && viewPercent <= 70) {
    // ✅ Entry animation: scale 0.97 → 1, radius 50 → 0
    const progress = (viewPercent - 10) / (20 - 10);
    // scale = 0.95 + (1 - 0.95) * progress;
    // radius = 50 - (50 * progress);

  } else if (viewPercent > 20 && viewPercent <= 100) {
    // ✅ Hold full scale
    scale = 1;
    radius = 0;

  } else if (viewPercent > 100 && viewPercent <= 150) {
    // ✅ Exit animation: scale 1 → 0.97, radius 0 → 50
    const progress = (viewPercent - 100) / (150 - 100);
    scale = 1 - (1 - 0.90) * progress;
    radius = 0 + 50 * progress;

  } else if (viewPercent > 150) {
    // ✅ Exit-hold: stay scaled down
    scale = 0.90;
    radius = 50;
    
  }

  sect10.style.transform = `scale(${scale})`;
  sect10.style.borderRadius = `${radius}px`;
  sect10.style.backgroundColor = `white`;
  
  // sect10.style.backgroundColor = `white`;
});



/////////////Section 5 Animation/////////////
const sect10bg = document.querySelector('.bg2');

window.addEventListener('scroll', () => {
  const rect = sect10bg.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate percentage of section scrolled
  const visibleTop = Math.max(0, windowHeight - rect.top);
  const viewPercent = (visibleTop / rect.height) * 100;

  let scale = 0.5;
  let radius = 0;

  if (viewPercent >= 2 && viewPercent <= 55) {
    // ✅ Entry animation: scale 0.97 → 1, radius 50 → 0
    const progress = (viewPercent - 2) / (55 - 2);
    scale = 0.50 + (0.95 - 0.50) * progress;
    radius = 0 + 40 * progress;
  
  } else if (viewPercent > 55 && viewPercent <= 140) {
    // ✅ Hold full scale
    scale = 0.95;
    radius = 40;

  } else if (viewPercent > 140 && viewPercent <= 150) {
    // ✅ Exit animation: scale 1 → 0.97, radius 0 → 50
    const progress = (viewPercent - 120) / (150 - 120);
    scale = 0.95 
    radius = 40;
  } else if (viewPercent > 150) {
    // ✅ Exit-hold: stay scaled down
    scale = 0.95;
    radius = 40;
  }

  sect10bg.style.transform = `scale(${scale})`;
  sect10bg.style.borderRadius = `${radius}px)`;
  
  // sect10.style.backgroundColor = `white`;
});