---
title: Passive haptics based mixed reality system
topic: eye-tracking-vr
sort_date: "2016-12-31"
label: "ISMAR 2016 and VRCAI 2016"
summary: "A mixed reality system in which people handle real, tracked objects with bare hands while seeing virtual counterparts, calibrated for accuracy and tested for teaching geography."
authors: "Zhizhuo Yang, Dongdong Weng, Zhengliang Zhang, Yufeng Li and Yue Liu."
links:
  - { label: "ISMAR paper", href: "https://doi.org/10.1109/ISMAR-Adjunct.2016.0103" }
  - { label: "VRCAI paper", href: "https://doi.org/10.1145/3013971.3013995" }
figures:
  - src: /assets/img/research/passive-haptics-mr.png
    alt: "Two headset views of a map puzzle of German states, each piece labeled in Chinese. In panel a, with passive haptics, the pieces lie on a wooden board and a robotic virtual hand reaches for one. In panel b, with free-hand gestures, the pieces float in an empty virtual room and a cartoon virtual hand grabs one."
    width: 932
    height: 437
figure_caption: "Figure 4 from Yang and Weng, VRCAI 2016: the learner's view of the map puzzle with passive haptics (a) and with free-hand gestures (b)."
results:
  - "In a study with 18 participants learning the German states through a map puzzle, quiz accuracy was highest with passive haptics (mean 95%), against 84% both for a real puzzle and for free-hand gestures in VR."
  - "Completing the puzzle took longest with passive haptics (mean 769.4 s, against 465.3 s for the real puzzle and 350.3 s for free-hand gestures), mainly because of the camera's narrow field of view and hands hiding the markers."
  - "Asked which virtual setup they would choose for learning if tracking were reliable, 15 of the 18 participants chose passive haptics."
facts:
  - { label: ISMAR 2016, value: "Perceptual issues of a passive haptics feedback based MR system", href: "https://doi.org/10.1109/ISMAR-Adjunct.2016.0103" }
  - { label: VRCAI 2016, value: "Passive haptics based MR system for geography teaching", href: "https://doi.org/10.1145/3013971.3013995" }
  - { label: Hardware, value: "Oculus Rift DK2 with a Leap Motion and a Logitech C920 camera mounted on the front, in Unity3D" }
---
Most virtual reality systems convey touch poorly: controllers vibrate, and force-feedback devices tie the user to a stylus inside a small workspace.
Passive haptics takes a cheaper route, using ordinary physical objects as stand-ins that the user touches while the headset shows a virtual counterpart, so the virtual hands and objects must line up closely with the real ones.

The ISMAR paper builds such a system, in which users handle real objects with bare hands at close range, proposes a calibration method for head and hand tracking, and measures the accuracy of each.
The VRCAI paper applies it to geography teaching, with laser-cut acrylic puzzle pieces tracked by markers, and compares learning with passive haptics, with free-hand gestures in VR and with a real puzzle.
A later room-scale version tracked the objects and the user's head with PhaseSpace optical tracking and the arms and hands with Perception Neuron sensors.
