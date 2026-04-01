---
layout: page
title: Projects
permalink: /portfolio/
nav_order: 8
nav: true
---

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

  :root {
    --portfolio-bg: #fafafa;
    --portfolio-text: #1a1a1a;
    --portfolio-accent: #c9a87c;
    --portfolio-card-bg: #ffffff;
    --portfolio-card-border: #e8e8e8;
    --portfolio-shadow: rgba(0, 0, 0, 0.08);
    --portfolio-badge-bg: #f5f5f5;
    --portfolio-badge-text: #666;
  }

  [data-theme="dark"] {
    --portfolio-bg: #0d0d0d;
    --portfolio-text: #f5f5f5;
    --portfolio-accent: #d4b896;
    --portfolio-card-bg: #141414;
    --portfolio-card-border: #2a2a2a;
    --portfolio-shadow: rgba(0, 0, 0, 0.4);
    --portfolio-badge-bg: #1f1f1f;
    --portfolio-badge-text: #999;
  }

  .portfolio-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 80px 20px 120px;
    font-family: 'Montserrat', sans-serif;
  }

  .portfolio-header {
    text-align: center;
    margin-bottom: 80px;
    animation: fadeInDown 1.2s ease-out;
  }

  .portfolio-subtitle {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--portfolio-accent);
    margin-bottom: 20px;
  }

  .portfolio-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 300;
    letter-spacing: 0.08em;
    color: var(--portfolio-text);
    margin-bottom: 20px;
  }

  .portfolio-description {
    max-width: 600px;
    margin: 0 auto;
    font-size: 1rem;
    line-height: 1.8;
    color: var(--portfolio-text);
    opacity: 0.7;
    font-weight: 300;
  }

  .portfolio-divider {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--portfolio-accent), transparent);
    margin: 40px auto 0;
  }

  .portfolio-filters {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 60px;
    flex-wrap: wrap;
    animation: fadeIn 1s ease-out 0.2s both;
  }

  .filter-btn {
    padding: 10px 24px;
    border: 1px solid var(--portfolio-card-border);
    background: var(--portfolio-card-bg);
    color: var(--portfolio-text);
    font-family: 'Montserrat', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 24px;
  }

  .filter-btn:hover {
    border-color: var(--portfolio-accent);
    color: var(--portfolio-accent);
    transform: translateY(-2px);
  }

  .filter-btn.active {
    background: var(--portfolio-accent);
    border-color: var(--portfolio-accent);
    color: #fff;
  }

  .portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 32px;
    animation: fadeInUp 1s ease-out 0.4s both;
  }

  @media (max-width: 768px) {
    .portfolio-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  .project-card {
    background: var(--portfolio-card-bg);
    border: 1px solid var(--portfolio-card-border);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    animation: slideIn 0.8s ease-out both;
  }

  .project-card:nth-child(1) { animation-delay: 0.1s; }
  .project-card:nth-child(2) { animation-delay: 0.2s; }
  .project-card:nth-child(3) { animation-delay: 0.3s; }
  .project-card:nth-child(4) { animation-delay: 0.4s; }
  .project-card:nth-child(5) { animation-delay: 0.5s; }
  .project-card:nth-child(6) { animation-delay: 0.6s; }

  .project-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px var(--portfolio-shadow),
                0 0 0 1px var(--portfolio-accent);
  }

  .project-banner {
    width: 100%;
    aspect-ratio: 16 / 9;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg,
      var(--portfolio-badge-bg) 0%,
      var(--portfolio-card-border) 100%);
  }

  .project-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  .project-card:hover .project-banner img {
    transform: scale(1.05);
  }

  .project-banner::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.4) 100%);
  }

  .project-info {
    padding: 24px;
    position: relative;
  }

  .project-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 12px;
  }

  .project-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: linear-gradient(135deg,
      var(--portfolio-accent) 0%,
      rgba(201, 168, 124, 0.6) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(201, 168, 124, 0.25);
  }

  .project-icon svg {
    width: 32px;
    height: 32px;
    fill: #fff;
  }

  .project-title-group {
    flex: 1;
  }

  .project-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 600;
    font-style: italic;
    color: var(--portfolio-text);
    margin-bottom: 4px;
    letter-spacing: 0.05em;
  }

  .project-category {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--portfolio-accent);
    font-weight: 500;
  }

  .project-brief {
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--portfolio-text);
    opacity: 0.9;
    font-weight: 400;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .view-project-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 8px 16px;
    color: var(--portfolio-accent);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    transition: all 0.3s ease;
  }

  .project-card:hover .view-project-btn {
    gap: 12px;
  }

  .view-project-btn svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
    transition: transform 0.3s ease;
  }

  .project-card:hover .view-project-btn svg {
    transform: translateX(4px);
  }

  /* Project Modal */
  .project-modal {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(255, 255, 255, 0.98);
    padding: 90px 0 0 0;
  }

  .modal-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px;
    position: relative;
  }

  .project-modal.active {
    display: block;
    overflow-y: auto;
    opacity: 1;
    transition: opacity 0.4s ease;
  }

  .modal-close {
    position: fixed !important;
    top: 88px !important;
    right: 28px !important;
    width: 56px !important;
    height: 56px !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 99999999 !important;
    opacity: 0.9 !important;
    background: rgba(0, 0, 0, 0.1) !important;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 50%;
    border: 2px solid rgba(0, 0, 0, 0.2) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  }

  .modal-close::before,
  .modal-close::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 3px;
    background: #000000;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 2px;
  }

  .modal-close::before {
    transform: rotate(45deg);
  }

  .modal-close::after {
    transform: rotate(-45deg);
  }

  .modal-close:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.2);
    transform: rotate(90deg);
    border-color: var(--portfolio-accent);
    box-shadow: 0 0 20px rgba(201, 168, 124, 0.4);
  }

  .modal-close:hover::before,
  .modal-close:hover::after {
    background: var(--portfolio-accent);
    width: 32px;
    height: 4px;
  }

  .modal-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .modal-icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: linear-gradient(135deg,
      var(--portfolio-accent) 0%,
      rgba(201, 168, 124, 0.6) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    box-shadow: 0 8px 24px rgba(201, 168, 124, 0.3);
  }

  .modal-icon svg {
    width: 40px;
    height: 40px;
    fill: #fff;
  }

  .modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem;
    font-weight: 600;
    font-style: italic;
    color: #000000;
    margin-bottom: 8px;
    letter-spacing: 0.08em;
  }

  .modal-category {
    font-size: 0.8rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--portfolio-accent);
    margin-bottom: 24px;
  }

  .modal-description {
    max-width: 700px;
    margin: 0 auto 40px;
    font-size: 1.1rem;
    line-height: 1.8;
    color: #000000;
    font-weight: 400;
  }

  .modal-screenshots {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 32px;
    margin-bottom: 40px;
    justify-items: center;
  }

  /* Double column layout for iOS mock-up screenshots */
  .modal-screenshots.ios-screenshots {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .screenshot-item {
    border-radius: 16px;
    overflow: hidden;
    background: var(--portfolio-card-border);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    max-width: 700px;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  /* Smaller screenshots for iOS mock-ups */
  .ios-screenshots .screenshot-item {
    max-width: 320px;
  }

  .screenshot-item img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s ease;
  }

  .screenshot-item:hover img {
    transform: scale(1.02);
  }

  .modal-tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-bottom: 40px;
  }

  .modal-tech-badge {
    padding: 10px 20px;
    background: rgba(0, 0, 0, 0.05);
    color: #000000;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .modal-links {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .modal-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.02);
    color: #000000;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .modal-link:hover {
    background: var(--portfolio-accent);
    border-color: var(--portfolio-accent);
    color: #ffffff;
    transform: translateY(-2px);
  }

  .modal-link svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
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

  @media (max-width: 768px) {
    .modal-content {
      padding: 40px 20px;
    }

    .modal-title {
      font-size: 2rem;
    }

    .modal-screenshots {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .screenshot-item {
      max-width: 100%;
    }

    .ios-screenshots {
      grid-template-columns: 1fr !important;
    }
  }
</style>

<div class="portfolio-container">
  <header class="portfolio-header">
    <p class="portfolio-subtitle">Creative Works</p>
    <h1 class="portfolio-title">Projects</h1>
    <p class="portfolio-description">
      A collection of applications and projects I've built, exploring the intersection of design, technology, and user experience.
    </p>
    <div class="portfolio-divider"></div>
  </header>

  <div class="portfolio-filters">
    <button class="filter-btn active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="ios">iOS</button>
    <button class="filter-btn" data-filter="web">Web</button>
    <button class="filter-btn" data-filter="ai">AI/ML</button>
  </div>

  <div class="portfolio-grid">
    <!-- GPU Memory Calculator Project Card -->
    <div class="project-card" data-category="ai web" data-project="gpu-calculator">
      <div class="project-banner">
        <img src="/assets/img/gpu-calculator.png" alt="GPU Memory Calculator">
      </div>
      <div class="project-info">
        <div class="project-header">
          <div class="project-icon" style="background: linear-gradient(135deg, #3a7ca5 0%, #2d5a87 100%);">
            <svg viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
          </div>
          <div class="project-title-group">
            <h3 class="project-name">GPU Memory Calculator</h3>
            <p class="project-category">AI/ML · Web Tool</p>
          </div>
        </div>
        <p class="project-brief">
          Calculate GPU memory requirements for training Large Language Models with support for PyTorch DDP, DeepSpeed ZeRO, Megatron-LM, and FSDP.
        </p>
        <div class="view-project-btn">
          <span>View Project</span>
          <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
        </div>
      </div>
    </div>

    <!-- Interview Prep App Project Card -->
    <div class="project-card" data-category="ai web" data-project="interview-prep">
      <div class="project-banner">
        <img src="/assets/img/interview-prep-app.png" alt="AI Interview Prep App">
      </div>
      <div class="project-info">
        <div class="project-header">
          <div class="project-icon" style="background: linear-gradient(135deg, #533483 0%, #0f3460 100%);">
            <svg viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>
          </div>
          <div class="project-title-group">
            <h3 class="project-name">AI Interview Prep</h3>
            <p class="project-category">AI/ML · Study Tool</p>
          </div>
        </div>
        <p class="project-brief">
          A local AI interview preparation tool for AI research scientist and engineer roles. Practice, learn, and track your progress across key ML/AI domains.
        </p>
        <div class="view-project-btn">
          <span>View Project</span>
          <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
        </div>
      </div>
    </div>

    <!-- iOS App Project Card -->
    <div class="project-card" data-category="ios" data-project="ios-app">
      <div class="project-banner">
        <img src="/assets/portfolio/Simulator Screenshot - iPhone 17 Pro - 2026-01-04 at 18.38.52.png" alt="iOS App">
      </div>
      <div class="project-info">
        <div class="project-header">
          <div class="project-icon">
            <svg viewBox="0 0 24 24"><path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12zM9 10h2v4H9zm4 0h2v4h-2z"/></svg>
          </div>
          <div class="project-title-group">
            <h3 class="project-name">My iOS App</h3>
            <p class="project-category">iOS · Featured</p>
          </div>
        </div>
        <p class="project-brief">
          A beautifully crafted iOS application built with SwiftUI, featuring intuitive design and smooth user experience.
        </p>
        <div class="view-project-btn">
          <span>View Project</span>
          <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Project Detail Modal -->
<div id="project-modal" class="project-modal">
  <span class="modal-close" id="modal-close-btn"></span>
  <div class="modal-content">
    <!-- GPU Calculator Modal Content -->
    <div id="gpu-calculator-modal" style="display: none;">
      <div class="modal-header">
        <div class="modal-icon">
          <svg viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
        </div>
        <h2 class="modal-title">GPU Memory Calculator</h2>
        <p class="modal-category">AI/ML · Web Tool</p>
      </div>

      <p class="modal-description">
        A comprehensive Python application for calculating GPU memory requirements for Large Language Model (LLM) training and inference. The calculator supports multiple distributed training engines including PyTorch DDP, DeepSpeed ZeRO (stages 1-3), Megatron-LM, Megatron+DeepSpeed, and PyTorch FSDP. It also supports inference engines like vLLM, TGI, TensorRT-LLM, and SGLang with KV cache optimization.
      </p>

      <h3 style="color: #000000; font-size: 1.4rem; margin-bottom: 24px; font-weight: 600; letter-spacing: 0.05em;">Key Features</h3>

      <div style="margin-bottom: 35px; padding: 24px; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.08);">
        <h4 style="color: var(--portfolio-accent); font-size: 1.1rem; margin-bottom: 16px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Training Memory Calculation</h4>
        <ul style="color: #000000; line-height: 2; list-style: none; padding: 0; font-size: 1rem;">
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Multiple Training Engines:</strong> <span style="color: #1a1a1a; font-weight: 500;">PyTorch DDP, DeepSpeed ZeRO, Megatron-LM, and FSDP</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Detailed Breakdown:</strong> <span style="color: #1a1a1a; font-weight: 500;">Memory by component (parameters, gradients, optimizer states, activations)</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Preset Models:</strong> <span style="color: #1a1a1a; font-weight: 500;">Quick-load configurations for LLaMA 2, GPT-3, Mixtral, and more</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Advanced Features:</strong> <span style="color: #1a1a1a; font-weight: 500;">CPU/NVMe offloading, activation checkpointing, multi-node training</span></li>
        </ul>
      </div>

      <div style="margin-bottom: 35px; padding: 24px; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.08);">
        <h4 style="color: var(--portfolio-accent); font-size: 1.1rem; margin-bottom: 16px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Inference Support</h4>
        <ul style="color: #000000; line-height: 2; list-style: none; padding: 0; font-size: 1rem;">
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Multiple Engines:</strong> <span style="color: #1a1a1a; font-weight: 500;">HuggingFace Transformers, vLLM, TGI, TensorRT-LLM, SGLang</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">KV Cache Optimization:</strong> <span style="color: #1a1a1a; font-weight: 500;">Quantization options (INT8, FP8, INT4)</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Tensor Parallelism:</strong> <span style="color: #1a1a1a; font-weight: 500;">Automatic memory distribution across GPUs</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Performance Metrics:</strong> <span style="color: #1a1a1a; font-weight: 500;">Throughput estimation (tokens/second)</span></li>
        </ul>
      </div>

      <div style="margin-bottom: 35px; padding: 24px; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.08);">
        <h4 style="color: var(--portfolio-accent); font-size: 1.1rem; margin-bottom: 16px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Interfaces & Tools</h4>
        <ul style="color: #000000; line-height: 2; list-style: none; padding: 0; font-size: 1rem;">
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Web Interface:</strong> <span style="color: #1a1a1a; font-weight: 500;">Interactive UI with real-time validation and formula explanations</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Command Line:</strong> <span style="color: #1a1a1a; font-weight: 500;">CLI tool for quick calculations and batch processing</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Python API:</strong> <span style="color: #1a1a1a; font-weight: 500;">Programmatic access for integration into workflows</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Framework Export:</strong> <span style="color: #1a1a1a; font-weight: 500;">Generate configs for Accelerate, Lightning, and Axolotl</span></li>
        </ul>
      </div>

      <div class="modal-screenshots">
        <div class="screenshot-item">
          <img src="/assets/img/gpu-calculator.png" alt="GPU Memory Calculator Screenshot">
        </div>
      </div>

      <div class="modal-tech-stack">
        <span class="modal-tech-badge">Python</span>
        <span class="modal-tech-badge">PyTorch</span>
        <span class="modal-tech-badge">DeepSpeed</span>
        <span class="modal-tech-badge">FastAPI</span>
        <span class="modal-tech-badge">HuggingFace</span>
        <span class="modal-tech-badge">Megatron-LM</span>
        <span class="modal-tech-badge">FSDP</span>
      </div>

      <div class="modal-links">
        <a href="https://github.com/George614/gpu-mem-calculator" class="modal-link">
          <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          GitHub Repository
        </a>
        <a href="https://huggingface.co/spaces/george614/gpu-memory-calculator" class="modal-link">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>
          HuggingFace Demo
        </a>
      </div>
    </div>

    <!-- Interview Prep App Modal Content -->
    <div id="interview-prep-modal" style="display: none;">
      <div class="modal-header">
        <div class="modal-icon" style="background: linear-gradient(135deg, #533483 0%, #0f3460 100%);">
          <svg viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" fill="#fff"/></svg>
        </div>
        <h2 class="modal-title">AI Interview Prep</h2>
        <p class="modal-category">AI/ML · Study Tool</p>
      </div>

      <p class="modal-description">
        Preparing for AI research scientist and machine learning engineer interviews is uniquely challenging — the field evolves rapidly, questions span deep theory and practical systems, and there's no single resource that ties it all together. This tool was born from that frustration: a local-first, privacy-respecting study companion that lets you systematically build and verify your knowledge across every domain that top AI labs actually test on.
      </p>

      <h3 style="color: #000000; font-size: 1.4rem; margin-bottom: 24px; font-weight: 600; letter-spacing: 0.05em;">Why This Tool?</h3>

      <div style="margin-bottom: 35px; padding: 24px; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.08);">
        <h4 style="color: var(--portfolio-accent); font-size: 1.1rem; margin-bottom: 16px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Motivation</h4>
        <ul style="color: #000000; line-height: 2; list-style: none; padding: 0; font-size: 1rem;">
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Targeted Coverage:</strong> <span style="color: #1a1a1a; font-weight: 500;">Curated questions from real AI/ML interview loops at top labs — not generic software engineering trivia</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Privacy First:</strong> <span style="color: #1a1a1a; font-weight: 500;">Runs 100% locally with no mandatory cloud dependencies — your study progress stays on your machine</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Science-Backed Learning:</strong> <span style="color: #1a1a1a; font-weight: 500;">Built around active recall and spaced repetition, proven to dramatically improve long-term retention</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">End-to-End Prep:</strong> <span style="color: #1a1a1a; font-weight: 500;">Covers technical, behavioral, and negotiation stages — not just coding questions</span></li>
        </ul>
      </div>

      <div style="margin-bottom: 35px; padding: 24px; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.08);">
        <h4 style="color: var(--portfolio-accent); font-size: 1.1rem; margin-bottom: 16px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Study Modes</h4>
        <ul style="color: #000000; line-height: 2; list-style: none; padding: 0; font-size: 1rem;">
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Question Bank:</strong> <span style="color: #1a1a1a; font-weight: 500;">Flashcard-style review with LaTeX math rendering and diagram support for deep theoretical questions</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Quiz Mode:</strong> <span style="color: #1a1a1a; font-weight: 500;">Self-assessment with optional AI-powered feedback via OpenAI or Anthropic APIs</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Mock Interview:</strong> <span style="color: #1a1a1a; font-weight: 500;">Timed practice sessions that simulate real interview pressure and pacing</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Debug Scenarios:</strong> <span style="color: #1a1a1a; font-weight: 500;">Hands-on ML training debugging exercises — a staple of research engineer interviews</span></li>
        </ul>
      </div>

      <div style="margin-bottom: 35px; padding: 24px; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.08);">
        <h4 style="color: var(--portfolio-accent); font-size: 1.1rem; margin-bottom: 16px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Domain Coverage</h4>
        <ul style="color: #000000; line-height: 2; list-style: none; padding: 0; font-size: 1rem;">
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">LLM Post-Training:</strong> <span style="color: #1a1a1a; font-weight: 500;">RLHF, DPO, reward modeling, and alignment fine-tuning</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Agentic AI & Memory:</strong> <span style="color: #1a1a1a; font-weight: 500;">Tool use, planning, retrieval-augmented generation, and continual learning</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Reinforcement Learning:</strong> <span style="color: #1a1a1a; font-weight: 500;">Policy gradients, value methods, multi-agent systems, and environment design</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Safety & Evaluation:</strong> <span style="color: #1a1a1a; font-weight: 500;">Model alignment, red-teaming, benchmark design, and robustness testing</span></li>
        </ul>
      </div>

      <div style="margin-bottom: 35px; padding: 24px; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.08);">
        <h4 style="color: var(--portfolio-accent); font-size: 1.1rem; margin-bottom: 16px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Progress & Retention</h4>
        <ul style="color: #000000; line-height: 2; list-style: none; padding: 0; font-size: 1rem;">
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Spaced Repetition:</strong> <span style="color: #1a1a1a; font-weight: 500;">Automatically surfaces questions you're weakest on at optimal review intervals</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Domain Mastery Tracking:</strong> <span style="color: #1a1a1a; font-weight: 500;">Visual progress across all covered domains so you know exactly where to focus</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Curated Resources:</strong> <span style="color: #1a1a1a; font-weight: 500;">Linked reference materials for deeper study on any topic</span></li>
        </ul>
      </div>

      <div class="modal-screenshots">
        <div class="screenshot-item">
          <img src="/assets/img/interview-prep-app.png" alt="AI Interview Prep App - Question Bank">
        </div>
      </div>

      <div class="modal-tech-stack">
        <span class="modal-tech-badge">Python</span>
        <span class="modal-tech-badge">Gradio</span>
        <span class="modal-tech-badge">OpenAI API</span>
        <span class="modal-tech-badge">Anthropic API</span>
        <span class="modal-tech-badge">LaTeX</span>
        <span class="modal-tech-badge">Spaced Repetition</span>
        <span class="modal-tech-badge">Local-First</span>
      </div>

      <div class="modal-links">
        <a href="https://github.com/George614/interview-prep-app-public" class="modal-link">
          <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          GitHub Repository
        </a>
      </div>
    </div>

    <!-- iOS App Modal Content -->
    <div id="ios-app-modal" style="display: none;">
      <div class="modal-header">
        <div class="modal-icon">
          <svg viewBox="0 0 24 24"><path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12zM9 10h2v4H9zm4 0h2v4h-2z"/></svg>
        </div>
        <h2 class="modal-title">My iOS App</h2>
        <p class="modal-category">iOS · Featured Project</p>
      </div>

      <p class="modal-description">
        A beautifully crafted iOS application built with SwiftUI, featuring intuitive design and smooth user experience. The app showcases modern iOS development practices with clean architecture and responsive animations.
      </p>

      <h3 style="color: #000000; font-size: 1.4rem; margin-bottom: 24px; font-weight: 600; letter-spacing: 0.05em;">Key Features</h3>

      <div style="margin-bottom: 35px; padding: 24px; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.08);">
        <h4 style="color: var(--portfolio-accent); font-size: 1.1rem; margin-bottom: 16px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">User Interface</h4>
        <ul style="color: #000000; line-height: 2; list-style: none; padding: 0; font-size: 1rem;">
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">SwiftUI Framework:</strong> <span style="color: #1a1a1a; font-weight: 500;">Modern declarative UI framework for building native iOS interfaces</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Custom Animations:</strong> <span style="color: #1a1a1a; font-weight: 500;">Smooth transitions and micro-interactions for enhanced user experience</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Responsive Design:</strong> <span style="color: #1a1a1a; font-weight: 500;">Adaptive layouts that work seamlessly across different iPhone screen sizes</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Dark Mode Support:</strong> <span style="color: #1a1a1a; font-weight: 500;">Fully integrated with iOS system appearance settings</span></li>
        </ul>
      </div>

      <div style="margin-bottom: 35px; padding: 24px; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.08);">
        <h4 style="color: var(--portfolio-accent); font-size: 1.1rem; margin-bottom: 16px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Technical Highlights</h4>
        <ul style="color: #000000; line-height: 2; list-style: none; padding: 0; font-size: 1rem;">
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Clean Architecture:</strong> <span style="color: #1a1a1a; font-weight: 500;">MVVM pattern with separation of concerns</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Data Persistence:</strong> <span style="color: #1a1a1a; font-weight: 500;">Core Data integration for local data storage</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Networking:</strong> <span style="color: #1a1a1a; font-weight: 500;">Async/await based API calls with error handling</span></li>
          <li style="margin-bottom: 12px;">• <strong style="color: #000000; font-weight: 600;">Performance:</strong> <span style="color: #1a1a1a; font-weight: 500;">Optimized rendering and memory management</span></li>
        </ul>
      </div>

      <div class="modal-screenshots ios-screenshots">
        <div class="screenshot-item">
          <img src="/assets/portfolio/Simulator Screenshot - iPhone 17 Pro - 2026-01-04 at 18.38.52.png" alt="Screenshot 1">
        </div>
        <div class="screenshot-item">
          <img src="/assets/portfolio/Simulator Screenshot - iPhone 17 Pro - 2026-01-04 at 18.39.01.png" alt="Screenshot 2">
        </div>
        <div class="screenshot-item">
          <img src="/assets/portfolio/Simulator Screenshot - iPhone 17 Pro - 2026-01-04 at 18.40.29.png" alt="Screenshot 3">
        </div>
        <div class="screenshot-item">
          <img src="/assets/portfolio/Simulator Screenshot - iPhone 17 Pro - 2026-01-04 at 18.41.41.png" alt="Screenshot 4">
        </div>
      </div>

      <div class="modal-tech-stack">
        <span class="modal-tech-badge">Swift</span>
        <span class="modal-tech-badge">SwiftUI</span>
        <span class="modal-tech-badge">iOS 26</span>
        <span class="modal-tech-badge">Core Data</span>
        <span class="modal-tech-badge">MVVM</span>
      </div>

      <div class="modal-links">
        <a href="#" class="modal-link">
          <svg viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31 1.59-2.45 1.49-4.18-.03-1.77-1.25-3.09-2.56-4.6-1.28-1.48-2.55-1.48-3.81-1.5-1.27-.02-2.49.7-3.37.7-.89 0-2.53-.7-3.38-.7-1.54 0-3.18 1.32-4.27 3.29-1.57 2.87-1.31 8.19 1.06 12.5 1.07 1.89 2.52 4.02 4.37 4.02 1.81 0 2.5-1.01 4.17-1.01 1.67 0 2.24 1.01 4.17 1.01 1.93 0 3.37-2.05 4.54-4.02 1.35-2.47 1.92-4.86 1.96-4.98-.04-.01-3.72-.08-5.73-2.82z"/></svg>
          App Store
        </a>
        <a href="#" class="modal-link">
          <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          GitHub
        </a>
      </div>
    </div>
  </div>
</div>

<script>
  // Filter functionality
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Project modal functionality
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.project;
      const modalContent = document.getElementById(`${projectId}-modal`);

      // Hide all modal contents
      document.querySelectorAll('.modal-content > div').forEach(div => {
        div.style.display = 'none';
      });

      // Show the selected modal content
      if (modalContent) {
        modalContent.style.display = 'block';
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    // Hide all modal contents after closing
    setTimeout(() => {
      document.querySelectorAll('.modal-content > div').forEach(div => {
        div.style.display = 'none';
      });
    }, 400);
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Move modal outside of article element to avoid positioning issues
  const modalElement = document.getElementById('project-modal');
  if (modalElement && modalElement.parentNode.tagName === 'ARTICLE') {
    document.body.appendChild(modalElement);
  }
</script>
