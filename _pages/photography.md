---
layout: page
title: Photography
permalink: /photography/
nav_order: 7
nav: true
---

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');

  :root {
    --gallery-bg: #fafafa;
    --gallery-text: #1a1a1a;
    --gallery-accent: #c9a87c;
    --gallery-border: #e0e0e0;
    --gallery-shadow: rgba(0, 0, 0, 0.08);
    --gallery-hover: #fff;
  }

  [data-theme="dark"] {
    --gallery-bg: #0d0d0d;
    --gallery-text: #f5f5f5;
    --gallery-accent: #d4b896;
    --gallery-border: #2a2a2a;
    --gallery-shadow: rgba(0, 0, 0, 0.4);
    --gallery-hover: #1a1a1a;
  }

  .photography-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 60px 20px 100px;
    font-family: 'Montserrat', sans-serif;
  }

  .gallery-header {
    text-align: center;
    margin-bottom: 80px;
    animation: fadeInDown 1.2s ease-out;
  }

  .gallery-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 300;
    letter-spacing: 0.15em;
    color: var(--gallery-text);
    margin-bottom: 20px;
    font-style: italic;
  }

  .gallery-subtitle {
    font-size: 0.85rem;
    font-weight: 300;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gallery-accent);
    margin-bottom: 30px;
  }

  .gallery-divider {
    width: 80px;
    height: 1px;
    background: var(--gallery-accent);
    margin: 0 auto;
  }

  .gallery-intro {
    max-width: 600px;
    margin: 0 auto 60px;
    text-align: center;
    font-size: 1rem;
    line-height: 1.8;
    color: var(--gallery-text);
    opacity: 0.7;
    font-weight: 300;
    animation: fadeIn 1.4s ease-out 0.3s both;
  }

  .gallery-grid {
    column-count: 3;
    column-gap: 24px;
    animation: fadeInUp 1s ease-out 0.5s both;
  }

  @media (max-width: 1024px) {
    .gallery-grid {
      column-count: 2;
      column-gap: 20px;
    }
  }

  @media (max-width: 640px) {
    .gallery-grid {
      column-count: 1;
    }
  }

  .gallery-item {
    break-inside: avoid;
    margin-bottom: 24px;
    position: relative;
    cursor: pointer;
    animation: slideIn 0.8s ease-out both;
  }

  .gallery-item:nth-child(1) { animation-delay: 0.1s; }
  .gallery-item:nth-child(2) { animation-delay: 0.2s; }
  .gallery-item:nth-child(3) { animation-delay: 0.3s; }
  .gallery-item:nth-child(4) { animation-delay: 0.4s; }
  .gallery-item:nth-child(5) { animation-delay: 0.5s; }
  .gallery-item:nth-child(6) { animation-delay: 0.6s; }

  .photo-frame {
    position: relative;
    background: var(--gallery-bg);
    border: 1px solid var(--gallery-border);
    padding: 12px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px var(--gallery-shadow);
  }

  .gallery-item:hover .photo-frame {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px var(--gallery-shadow);
    border-color: var(--gallery-accent);
  }

  .photo-placeholder {
    width: 100%;
    aspect-ratio: 4 / 5;
    background: linear-gradient(135deg,
      var(--gallery-bg) 0%,
      var(--gallery-border) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .photo-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .gallery-item:hover .photo-placeholder img {
    transform: scale(1.05);
  }

  .photo-placeholder::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg,
      transparent 40%,
      rgba(201, 168, 124, 0.1) 50%,
      transparent 60%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
    pointer-events: none;
    z-index: 1;
  }

  .gallery-item:hover .photo-placeholder::before {
    transform: translateX(100%);
  }

  .photo-placeholder svg {
    width: 48px;
    height: 48px;
    fill: var(--gallery-accent);
    opacity: 0.3;
    transition: all 0.4s ease;
  }

  .gallery-item:hover .photo-placeholder svg {
    opacity: 0.6;
    transform: scale(1.1);
  }

  .photo-caption {
    margin-top: 16px;
    text-align: center;
  }

  .photo-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-weight: 400;
    font-style: italic;
    color: var(--gallery-text);
    margin-bottom: 4px;
    letter-spacing: 0.05em;
  }

  .photo-meta {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gallery-accent);
    font-weight: 400;
  }

  .empty-state {
    text-align: center;
    padding: 100px 40px;
    animation: fadeIn 1s ease-out;
  }

  .empty-state-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 30px;
    fill: var(--gallery-accent);
    opacity: 0.2;
  }

  .empty-state-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    font-style: italic;
    color: var(--gallery-text);
    opacity: 0.5;
    margin-bottom: 10px;
  }

  .empty-state-sub {
    font-size: 0.8rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gallery-accent);
    opacity: 0.6;
  }

  .gallery-section {
    margin-bottom: 100px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 60px;
    animation: fadeIn 1s ease-out;
  }

  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem;
    font-weight: 300;
    font-style: italic;
    color: var(--gallery-text);
    letter-spacing: 0.1em;
    margin-bottom: 10px;
  }

  .section-location {
    font-size: 0.75rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gallery-accent);
    font-weight: 400;
  }

  .copyright-notice {
    margin-top: 80px;
    padding: 40px 20px;
    text-align: center;
    border-top: 1px solid var(--gallery-border);
    animation: fadeIn 1s ease-out;
  }

  .copyright-text {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    color: var(--gallery-text);
    opacity: 0.5;
    margin: 0;
    transition: opacity 0.3s ease;
  }

  .copyright-text:hover {
    opacity: 0.8;
  }

  .copyright-text svg {
    flex-shrink: 0;
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Lightbox Styles - Gallery Aesthetic */
  .lightbox {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: radial-gradient(ellipse at center, #1a1a1a 0%, #000000 100%);
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  [data-theme="dark"] .lightbox {
    background: radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%);
  }

  .lightbox.active {
    display: block;
    opacity: 1;
  }

  .lightbox-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    max-width: 85vw;
    max-height: 85vh;
    display: block;
    cursor: default;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.8),
                0 0 0 1px rgba(255, 255, 255, 0.03);
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.3s ease;
    user-select: none;
    -webkit-user-select: none;
  }

  .lightbox.active .lightbox-content {
    transform: translate(-50%, -50%) scale(1);
  }

  .lightbox-content:hover {
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9),
                0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  .lightbox-close {
    position: fixed;
    top: 28px;
    right: 28px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000000;
    opacity: 0.4;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 50%;
  }

  .lightbox-close::before,
  .lightbox-close::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 1px;
    background: #f5f5f5;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .lightbox-close::before {
    transform: rotate(45deg);
  }

  .lightbox-close::after {
    transform: rotate(-45deg);
  }

  .lightbox-close:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.05);
    transform: rotate(90deg);
  }

  .lightbox-close:hover::before,
  .lightbox-close:hover::after {
    background: var(--gallery-accent);
    width: 24px;
  }

  .lightbox-caption {
    position: fixed;
    bottom: 32px;
    left: 32px;
    color: rgba(245, 245, 245, 0.7);
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem;
    font-weight: 300;
    font-style: italic;
    letter-spacing: 0.08em;
    pointer-events: none;
    z-index: 999999;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  }

  .lightbox.active .lightbox-caption {
    opacity: 1;
    transform: translateY(0);
  }

  .lightbox-nav {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000000;
    opacity: 0.3;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    -webkit-user-select: none;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border-radius: 50%;
  }

  .lightbox-nav:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.6);
    transform: translateY(-50%) scale(1.1);
  }

  .lightbox-prev {
    left: 24px;
  }

  .lightbox-next {
    right: 24px;
  }

  .lightbox-nav::before,
  .lightbox-nav::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 1px;
    background: #f5f5f5;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .lightbox-prev::before {
    transform: rotate(-45deg);
    transform-origin: left center;
    left: 24px;
  }

  .lightbox-prev::after {
    transform: rotate(45deg);
    transform-origin: left center;
    left: 24px;
  }

  .lightbox-next::before {
    transform: rotate(-45deg);
    transform-origin: right center;
    right: 24px;
  }

  .lightbox-next::after {
    transform: rotate(45deg);
    transform-origin: right center;
    right: 24px;
  }

  .lightbox-nav:hover::before,
  .lightbox-nav:hover::after {
    background: var(--gallery-accent);
    width: 16px;
  }

  .lightbox-prev:hover::before {
    left: 22px;
  }

  .lightbox-prev:hover::after {
    left: 22px;
  }

  .lightbox-next:hover::before {
    right: 22px;
  }

  .lightbox-next:hover::after {
    right: 22px;
  }

  @media (max-width: 768px) {
    .lightbox-content {
      max-width: 95vw;
      max-height: 80vh;
    }

    .lightbox-close {
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
    }

    .lightbox-caption {
      bottom: 24px;
      left: 24px;
      right: 24px;
      font-size: 0.85rem;
      text-align: center;
    }

    .lightbox-nav {
      width: 50px;
      height: 50px;
      opacity: 0.5;
    }

    .lightbox-prev {
      left: 16px;
    }

    .lightbox-next {
      right: 16px;
    }
  }
</style>

<div class="photography-container">
  <header class="gallery-header">
    <p class="gallery-subtitle">Visual Stories</p>
    <h1 class="gallery-title">Photography</h1>
    <div class="gallery-divider"></div>
  </header>

  <p class="gallery-intro">
    Capturing moments in time. A curated collection of photographs exploring light, shadow, and the art of seeing.
  </p>

  <!-- Mt. Mammoth Section -->
  <div class="gallery-section">
    <div class="section-header">
      <h2 class="section-title">Mt. Mammoth</h2>
      <p class="section-location">California · Winter</p>
    </div>

    <div class="gallery-grid">
      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/mammoth/DSC_0457.JPG" alt="Mt. Mammoth I">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Morning Light</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/mammoth/DSC_0541.JPG" alt="Mt. Mammoth II">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Snow Peaks</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/mammoth/DSC_0542.JPG" alt="Mt. Mammoth III">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Winter Silence</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/mammoth/DSC_0590.JPG" alt="Mt. Mammoth IV">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Alpine Glow</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/mammoth/DSC_0617.JPG" alt="Mt. Mammoth V">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Frozen Trees</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/mammoth/DSC_0696.JPG" alt="Mt. Mammoth VI">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Summit View</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Olympic Park Section -->
  <div class="gallery-section">
    <div class="section-header">
      <h2 class="section-title">Olympic Park</h2>
      <p class="section-location">Washington · Autumn</p>
    </div>

    <div class="gallery-grid">
      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Olympic/DSC_0236.JPG" alt="Olympic Park I">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Forest Path</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Olympic/DSC_0237.JPG" alt="Olympic Park II">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Misty Morning</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Olympic/DSC_0299.JPG" alt="Olympic Park III">
          </div>
          <div class="photo-caption">
            <p class="photo-title">River Crossing</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Olympic/DSC_0382.JPG" alt="Olympic Park IV">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Golden Hour</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Olympic/DSC_0408.JPG" alt="Olympic Park V">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Fall Colors</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Olympic/DSC_0410.JPG" alt="Olympic Park VI">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Still Waters</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Olympic/DSC_0427.JPG" alt="Olympic Park VII">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Mountain Vista</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Olympic/DSC_0432.JPG" alt="Olympic Park VIII">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Twilight</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Sequoia Section -->
  <div class="gallery-section">
    <div class="section-header">
      <h2 class="section-title">Sequoia</h2>
      <p class="section-location">California · Ancient Forests</p>
    </div>

    <div class="gallery-grid">
      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Sequoia/IMG_1358.jpg" alt="Sequoia I">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Gentle Giants</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Sequoia/IMG_1359.jpg" alt="Sequoia II">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Forest Cathedral</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Sequoia/IMG_1381.jpg" alt="Sequoia III">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Morning Mist</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Sequoia/IMG_1395.jpg" alt="Sequoia IV">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Ancient Bark</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Sequoia/IMG_1397.jpg" alt="Sequoia V">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Trail of Giants</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Sequoia/IMG_1419.jpg" alt="Sequoia VI">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Sun Through Branches</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Sequoia/IMG_1450.jpg" alt="Sequoia VII">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Forest Floor</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Sequoia/IMG_1456.jpg" alt="Sequoia VIII">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Standing Tall</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Sequoia/IMG_1475.jpg" alt="Sequoia IX">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Whispers of Time</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Lassen & Mt. Shasta Section -->
  <div class="gallery-section">
    <div class="section-header">
      <h2 class="section-title">Lassen & Mt. Shasta</h2>
      <p class="section-location">Northern California · Volcanic Landscapes</p>
    </div>

    <div class="gallery-grid">
      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Lassen & Mt. Shasta/IMG_0347.jpg" alt="Lassen & Mt. Shasta I">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Volcanic Vista</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Lassen & Mt. Shasta/IMG_0389.jpg" alt="Lassen & Mt. Shasta II">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Peak Reflection</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Lassen & Mt. Shasta/IMG_0403.jpg" alt="Lassen & Mt. Shasta III">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Mountain Mist</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Lassen & Mt. Shasta/IMG_0439.jpg" alt="Lassen & Mt. Shasta IV">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Alpine Lake</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Lassen & Mt. Shasta/IMG_0480.jpg" alt="Lassen & Mt. Shasta V">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Snowy Slopes</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Lassen & Mt. Shasta/IMG_1681.jpg" alt="Lassen & Mt. Shasta VI">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Sunset Summit</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Lassen & Mt. Shasta/IMG_1737.jpg" alt="Lassen & Mt. Shasta VII">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Trail to Heaven</p>
          </div>
        </div>
      </div>

      <div class="gallery-item">
        <div class="photo-frame">
          <div class="photo-placeholder">
            <img src="/assets/photography/Lassen & Mt. Shasta/IMG_1790.jpg" alt="Lassen & Mt. Shasta VIII">
          </div>
          <div class="photo-caption">
            <p class="photo-title">Guardian Peak</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Copyright Notice -->
  <div class="copyright-notice">
    <p class="copyright-text">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
      </svg>
      All photographs are © protected. Permission required for any use or reproduction.
    </p>
  </div>
</div>

<!-- Lightbox Modal -->
<div id="lightbox" class="lightbox">
  <span class="lightbox-close"></span>
  <span class="lightbox-nav lightbox-prev"></span>
  <span class="lightbox-nav lightbox-next"></span>
  <img class="lightbox-content" id="lightbox-img" alt="">
  <div class="lightbox-caption" id="lightbox-caption"></div>
</div>

<script>
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  let currentPhotos = [];
  let currentIndex = 0;

  // Get all photos
  function initPhotos() {
    currentPhotos = Array.from(document.querySelectorAll('.gallery-item'));
  }

  // Open lightbox
  function openLightbox(index) {
    initPhotos();
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
  }

  // Update lightbox content
  function updateLightbox() {
    const photo = currentPhotos[currentIndex];
    const img = photo.querySelector('img');
    const title = photo.querySelector('.photo-title').textContent;
    lightboxImg.src = img.src;
    lightboxCaption.textContent = title;
  }

  // Navigate to previous photo
  function showPrev() {
    currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
    updateLightbox();
  }

  // Navigate to next photo
  function showNext() {
    currentIndex = (currentIndex + 1) % currentPhotos.length;
    updateLightbox();
  }

  // Close lightbox function
  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  // Initialize click handlers for gallery items
  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      openLightbox(index);
    });
  });

  // Close button
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeLightbox();
  });

  // Navigation buttons
  prevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    showPrev();
  });

  nextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    showNext();
  });

  // Click on background to close
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'ArrowRight') {
      showNext();
    }
  });

  // Initialize on load
  initPhotos();
</script>
