/**
 * Mobile Performance Utilities
 * Provides centralized mobile detection and performance optimization helpers
 */
(function(window) {
  'use strict';

  const MobileUtils = {
    /**
     * Check if device is mobile (viewport width < 768px)
     */
    isMobile: function() {
      return window.innerWidth < 768;
    },

    /**
     * Check if device is touch-capable
     */
    isTouch: function() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Throttle function - limits execution rate
     * @param {Function} callback - Function to throttle
     * @param {number} delay - Minimum time between executions (ms)
     */
    throttle: function(callback, delay) {
      let lastCall = 0;
      return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          callback.apply(this, args);
        }
      };
    },

    /**
     * RequestAnimationFrame throttle - syncs with browser paint cycle
     * @param {Function} callback - Function to throttle
     */
    rafThrottle: function(callback) {
      let ticking = false;
      return function(...args) {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            callback.apply(this, args);
            ticking = false;
          });
          ticking = true;
        }
      };
    },

    /**
     * Debounce function - delays execution until after delay period
     * @param {Function} callback - Function to debounce
     * @param {number} delay - Wait time before execution (ms)
     */
    debounce: function(callback, delay) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(this, args), delay);
      };
    },

    /**
     * Check if user prefers reduced motion
     */
    prefersReducedMotion: function() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Check if animations should be reduced
     */
    shouldReduceAnimations: function() {
      return this.isMobile() || this.prefersReducedMotion();
    }
  };

  // Expose to global scope
  window.MobileUtils = MobileUtils;

  // Add CSS classes for styling hooks
  document.addEventListener('DOMContentLoaded', function() {
    if (MobileUtils.isMobile()) {
      document.documentElement.classList.add('is-mobile');
      document.documentElement.classList.add('reduce-animations');
    }

    if (MobileUtils.prefersReducedMotion()) {
      document.documentElement.classList.add('prefers-reduced-motion');
    }
  });

})(window);
