---
title: RIT-Eyes
kind: research
topic: eye-tracking-vr
sort_date: "2020-09-12"
label: "ACM SAP 2020"
summary: "A Blender platform that renders labeled near-eye images from a detailed eye model, for training eye segmentation networks and testing how they generalize."
authors: "Nitinraj Nair, Rakshit Kothari, Aayush K. Chaudhary, Zhizhuo Yang, Gabriel J. Diaz, Jeff B. Pelz and Reynold J. Bailey."
bib_key: nair2020rit
links:
  - { label: "Paper", href: "https://doi.org/10.1145/3385955.3407935" }
  - { label: "arXiv", href: "https://arxiv.org/abs/2006.03642" }
figures:
  - src: /assets/img/research/rit-eyes.png
    alt: "Twelve rendered close-ups of an eye in two rows. The top row shows six synthetic faces with different skin tones and eye shapes in color; the bottom row shows the same eyes as simulated infrared images. The last two infrared images overlay the pupil in red, the iris in green and the sclera in blue, and the final one hides the skin to show the whole eyeball."
    width: 1414
    height: 363
figure_caption: "Figure 1 from the arXiv version of Nair et al., ACM SAP 2020: rendered eyes in color and in simulated infrared, with pupil, iris and sclera labels on the right."
results:
  - "Segmentation networks trained on the renderings and tested on held-out head models reached a mean IoU above 95 (RITnet 96.31 and SegNet 95.96 on the NVGaze-style renderings)."
  - "Trained on a narrow range of camera positions, the networks still reached 88.71 (RITnet) and 86.11 (SegNet) on renderings that cover a much wider range."
  - "Tested on real OpenEDS images, the mean IoU fell to 73.94 for RITnet and 80.31 for SegNet, mainly because the sclera was segmented poorly."
facts:
  - { label: Method, value: "Path-traced rendering in Blender of 24 head models fitted with a custom eye model" }
  - { label: Data, value: "Three rendered datasets of 51,600 images each, with pupil, iris and sclera masks" }
  - { label: Full title, value: "RIT-Eyes: Rendering of near-eye images for eye-tracking applications" }
---
Video-based eye trackers find the pupil, iris and sclera in infrared images of the eye, and neural networks do this well, but they need many hand-labeled images to train.
Rendered images come with labels for free, yet networks trained on earlier renderings lose accuracy on real eyes, which suggests the renderings miss some of the variation in real ones.

RIT-Eyes models the eye in more detail than earlier generators: an aspherical cornea, a pupil whose size reshapes the iris texture, the inner corner of the eye, the bright-pupil effect, eyelids that follow gaze, blinks, and reflections from the environment and from eyeglasses.
The paper renders datasets that copy the camera setups of the public NVGaze and OpenEDS datasets, plus one that spans the positions possible on a head-mounted eye tracker, and tests which differences between datasets limit how well segmentation networks generalize.
