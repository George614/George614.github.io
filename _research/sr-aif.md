---
title: "SR-AIF: sparse-reward robotics from pixels"
kind: research
topic: active-inference
sort_date: "2025-07-01"
label: "ICRA 2025"
summary: "An active inference agent that learns its own goal states, solving sparse-reward robot manipulation from camera images."
authors: "Viet Dung Nguyen, Zhizhuo Yang, Christopher L. Buckley and Alexander Ororbia."
featured: true
bib_key: nguyen2025sr-aif
links:
  - { label: "Paper", href: "https://doi.org/10.1109/ICRA55743.2025.11127713" }
  - { label: "arXiv", href: "https://arxiv.org/abs/2409.14216" }
  - { label: "Code", href: "https://github.com/NACLab/self-revising-active-inference" }
figures:
  - src: /assets/img/research/sr-aif.png
    alt: "Diagram of the learning framework. Camera images of a robot arm feed two models: a recurrent world model (RSSM) on top and the prior preference model (CRSPP) below. A preference rate rho links the two through a contrastive loss at each time step, and a complexity loss trains the CRSPP transition prior."
    width: 1560
    height: 650
figure_caption: "Figure 2 from the arXiv version of Nguyen et al., ICRA 2025: the prior preference model (CRSPP) learns which states are desirable alongside the world model."
results:
  - "On most tasks the agent converges earlier than DreamerV3 and two active inference baselines, and ends with a higher cumulative reward and success rate."
  - "On the two robosuite tasks, door opening and block lifting, it is the only agent of the four that succeeds."
  - "On Meta-World Push, where even the expert struggles, it reaches a 0.6 success rate against 0.1 for DreamerV3."
facts:
  - { label: Method, value: "Active inference with a learned prior preference model" }
  - { label: Benchmarks, value: "Mountain car, 13 Meta-World tasks and 2 robosuite tasks, all from pixels with sparse rewards" }
  - { label: Preprint title, value: "R-AIF (arXiv, 2024)" }
---
Robots that learn from camera images rarely get told how well they are doing; usually the only signal is whether the task succeeded at the end.
Active inference agents act to reach preferred states, but until this work they had mostly been studied where the full state is visible and the reward is dense.

SR-AIF has the agent learn its own preferences online.
A contrastive prior preference model is trained on a signal that is positive along successful episodes and negative along failed ones, so it learns to imagine the next desirable state at every step.
The policy is then trained with an actor-critic form of expected free energy that combines this goal signal with an exploration signal from the world model.
