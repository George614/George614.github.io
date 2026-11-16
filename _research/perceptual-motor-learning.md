---
title: A neural active inference model of perceptual-motor learning
topic: active-inference
sort_date: "2023-02-20"
label: "Frontiers in Computational Neuroscience, 2023"
summary: "A neural active inference agent learns to intercept a target that changes speed and, like people do, speeds up early in anticipation of the change."
authors: "Zhizhuo Yang, Gabriel J. Diaz, Brett R. Fajen, Reynold Bailey and Alexander G. Ororbia."
bib_key: yang2023neural
links:
  - { label: "Paper", href: "https://doi.org/10.3389/fncom.2023.1099593" }
  - { label: "arXiv", href: "https://arxiv.org/abs/2211.10419" }
figures:
  - src: /assets/img/research/perceptual-motor-learning.png
    alt: "Architecture diagram. The current observation enters a joint model with two heads. The expected free energy head scores each possible action and the best one is taken. The transition head predicts the next observation; its prediction error is the epistemic value. A prior function scores the actual next observation against preferred outcomes to give the instrumental value. The two values sum to the negative expected free energy, which becomes the training target for the first head."
    width: 1540
    height: 1070
figure_caption: "Figure 2 from Yang et al., Frontiers in Computational Neuroscience 2023: one network both scores actions by expected free energy and predicts the next observation, and the two resulting signals form its training target."
results:
  - "With both the goal-seeking and the exploration terms, the agent reached about a 90% interception success rate, while a DQN baseline trained on the sparse end-of-episode reward averaged 22% at test time."
  - "With a discount factor of 0.99 the agent sped up before the target changed speed, as human participants did; with a discount factor of 0 it only reacted."
  - "Making the simulated vehicle less responsive lowered success but moved the agent's timing closer to the target's actual time to contact."
  - "Sharing one network between the two heads used 66.8% of the parameters of two separate networks."
facts:
  - { label: Method, value: "Neural network that estimates expected free energy per action and predicts the next observation" }
  - { label: Task, value: "Simulated locomotor interception from a human study by Diaz et al. (2009)" }
  - { label: Baseline, value: "DQN with sparse reward" }
---
People intercepting a moving target usually steer by what they see right now, but some situations require planning ahead.
In an earlier human study, participants controlled their speed along a straight path to catch a target that usually sped up partway through each trial, and they learned to speed up before the change happened.
This paper asks whether active inference, in which an agent picks actions that minimize expected free energy (a mix of progress toward preferred outcomes and information gained), produces the same anticipation.

The agent is one neural network with two output heads.
One head estimates the expected free energy of each pedal position and the agent picks the best one; the other predicts the next observation, and its prediction error drives exploration.
A prior function turns each observation into a score of how close the agent is to the speed it needs to intercept, which supplies the goal-seeking signal without a hand-crafted reward.
