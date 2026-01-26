// Scroll Reveal Animations
(function() {
  'use strict';

  // Reveal on scroll using Intersection Observer
  const revealOptions = {
    threshold: window.MobileUtils && window.MobileUtils.isMobile() ? 0.05 : 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        // Optional: stop observing after reveal
        // revealObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  // Observe all reveal elements
  document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');
    revealElements.forEach(el => revealObserver.observe(el));
  });

  // Parallax effect for hero section - DISABLED on mobile for performance
  let ticking = false;

  window.addEventListener('scroll', function() {
    // Skip parallax on mobile devices for better performance
    if (window.MobileUtils && window.MobileUtils.shouldReduceAnimations()) {
      return;
    }

    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');

        if (heroSection) {
          const parallaxSpeed = 0.5;
          heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }

        ticking = false;
      });

      ticking = true;
    }
  }, { passive: true });

})();
