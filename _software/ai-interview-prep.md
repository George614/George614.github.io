---
title: AI Interview Prep
order: 2
label: "Open-source study tool"
summary: "A local study tool for AI research scientist and engineer interviews, with a question bank, quizzes, mock interviews and spaced repetition."
links:
  - { label: "Code", href: "https://github.com/George614/interview-prep-app-public" }
figures:
  - src: /assets/img/software/ai-interview-prep.png
    alt: "The question bank view. Tabs across the top lead to quiz mode, mock interview, progress, resources, debug scenarios, behavioral prep and negotiation prep. On the left, filters for domain, difficulty and tag are set to post-training and GRPO; on the right, a revealed answer compares RLOO, PPO and GRPO with the advantage formula for each."
    width: 1882
    height: 1218
figure_caption: "The question bank, filtered to post-training questions, with an answer comparing RLOO, PPO and GRPO."
results:
  - "Flashcard-style question bank with LaTeX math and diagrams, a quiz mode with optional feedback from OpenAI or Anthropic models, timed mock interviews and hands-on debugging exercises for ML training."
  - "Covers LLM post-training, agentic AI and memory, reinforcement learning, and safety and evaluation, plus behavioral and negotiation preparation."
  - "Uses spaced repetition to bring back the questions you are weakest on, and tracks progress in each domain."
facts:
  - { label: Runs, value: "Locally, with no required cloud service" }
  - { label: Built with, value: "Python and Gradio" }
---
Interviews for AI research roles range from deep theory to practical systems, and the field changes quickly.
This tool collects questions in the areas these interviews test and turns them into a study routine built on active recall and spaced repetition.

It runs on your own machine, so study progress stays there.
