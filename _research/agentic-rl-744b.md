---
title: Reinforcement learning for a 744B-parameter agent
kind: research
topic: agents
sort_date: "2026-09-30"
label: "WRITER, 2025 to 2026"
summary: "End-to-end GRPO training across 8-node GPU clusters, with the production agent as the environment."
authors: "Zhizhuo Yang, with Peng Du, Zhenyu Zhao, Kiran Kamble and Arjun Krishna."
featured: true
cv_sourced: true
diagram: rl-loop.svg
figure_caption: "The training loop. The policy acts inside the production agent harness on synthetic tasks, verifiers turn each trajectory into a reward, and a GRPO update improves the policy."
highlight: 3
results:
  - "An initial small-scale run raised held-out task reward by 0.077 over the base policy."
  - "Generation took 61% of wall-clock time; with FP8 weights one rollout engine fits on each node, which gave 2.6 to 4.1 times the output of the previous two-node layout."
  - "Asynchronous one-step off-policy training cut per-step non-generation time from 170 seconds to 24 seconds."
facts:
  - { label: Method, value: "GRPO with LoRA and truncated importance sampling" }
  - { label: Scale, value: "8-node H100 and H200 clusters" }
  - { label: Framework, value: "Slime" }
  - { label: Related, value: "Palmyra x6 technical report", href: "/research/palmyra-x6/" }
---
We trained a 744-billion-parameter mixture-of-experts agent end to end with reinforcement learning, using the production agent harness itself as the environment, so the model learns in the same setting where it is later used.
