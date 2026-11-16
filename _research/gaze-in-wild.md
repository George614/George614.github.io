---
title: Gaze-in-Wild
topic: eye-tracking-vr
sort_date: "2020-02-13"
label: "Scientific Reports, 2020"
summary: "A labeled dataset of eye and head movements during everyday tasks, with baseline classifiers for fixations, pursuits and saccades while the head moves freely."
authors: "Rakshit Kothari, Zhizhuo Yang, Christopher Kanan, Reynold Bailey, Jeff B. Pelz and Gabriel J. Diaz."
bib_key: kothari2020gaze
links:
  - { label: "Paper", href: "https://doi.org/10.1038/s41598-020-59251-5" }
  - { label: "arXiv", href: "https://arxiv.org/abs/1905.13146" }
figures:
  - src: /assets/img/research/gaze-in-wild.png
    alt: "Three panels. Left: a participant wearing a yellow hardhat that carries a stereo camera on top, a motion sensor on the side and eye tracking glasses, labeled ZED at 30 Hz, IMU at 100 Hz and Pupil Labs binocular at 120 Hz. Middle: a drawing of the same setup from the front, with arrows for head rotation in azimuth and elevation. Right: a top-down map of the building loop with the areas for visual search, ball catching, tea making and exploration."
    width: 1336
    height: 485
figure_caption: "Figure 3 from Kothari et al., Scientific Reports 2020: the head-mounted eye, head and scene tracking hardware, and a map of where each task took place."
results:
  - "19 participants performed everyday tasks (walking, catching a ball, visual search and making tea), and about 2 hours and 15 minutes of recordings were hand-labeled into gaze events, with agreement between labelers of 0.74 (sample-based Cohen's kappa)."
  - "On held-out participants, a Random Forest reached a kappa of 0.63 and a bidirectional recurrent network 0.61."
  - "The classifiers reached about 87% of human performance on fixations and saccades, but pursuit detection (kappa 0.37) was 49% below human agreement (0.73)."
facts:
  - { label: Data, value: "About 19,000 fixations, 18,000 saccades and 1,300 pursuits, hand-labeled" }
  - { label: Hardware, value: "120 Hz eye tracker, 100 Hz motion sensor and 30 Hz stereo camera on a hardhat" }
  - { label: Full title, value: "Gaze-in-wild: A dataset for studying eye and head coordination in everyday activities" }
---
Most algorithms that label eye movements as fixations, pursuits or saccades were built for lab recordings in which the head is held still.
In everyday activity the head moves too, and its rotation changes the velocity signals those algorithms rely on, yet there was no labeled dataset of natural, head-free gaze to train or test them on.

This paper introduces that dataset, recorded with a hardhat that carries a binocular eye tracker, a motion sensor for head rotation and a stereo depth camera, all calibrated together in space and time.
Trained labelers marked fixations, pursuits, saccades and blinks, and the paper trains a Random Forest and recurrent networks on eye and head velocities as baselines, scored with both sample-level and event-level metrics.
