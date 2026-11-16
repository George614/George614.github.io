---
title: Self-evolving agentic AI systems
topic: agents
sort_date: "2025-09-30"
label: "WRITER, 2025"
summary: "Agents that learn from their own mistakes, through planning with tree search, self-correction and continual fine-tuning."
authors: "Zhizhuo Yang, with Melisa Russak and Arjun Krishna."
cv_sourced: true
results:
  - "Explored Monte Carlo tree search for planning, together with learning from the trajectories most likely to succeed."
  - "Implemented self-correction mechanisms to improve agent task performance."
  - "Used LoRA fine-tuning and model merging for continual learning, raising accuracy in agentic workflows."
facts:
  - { label: Methods, value: "Monte Carlo tree search, self-correction, LoRA and model merging" }
  - { label: Period, value: "April to September 2025" }
---
An agent that repeats the same mistake on every run is only as good as the day it shipped.
This project explored ways for LLM agents to improve from their own experience instead.

The work combined three ideas: planning with tree search and learning from the attempts most likely to succeed, letting the agent notice and correct its own errors, and folding what it learned back into the model through LoRA fine-tuning and model merging, for continual learning.
