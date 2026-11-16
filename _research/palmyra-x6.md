---
title: "Palmyra x6: an agentic, tool-use model"
topic: agents
sort_date: "2026-08-01"
label: "Technical report, arXiv 2026"
summary: "WRITER's shipped agentic model, post-trained on data from a synthetic tool-use pipeline I built. It has the top BFCL Core score (0.785) among the compared models."
authors: "Peng Du, Kiran Kamble, Rakshith Vasudev, Zhizhuo Yang, Rohith Nadimpally, Arjun Krishna, Waseem Alshikh and Daniel M. Bikel."
featured: true
cv_sourced: true
bib_key: du2026palmyra
links:
  - { label: "arXiv", href: "https://arxiv.org/abs/2608.16620" }
figures:
  - src: /assets/img/research/palmyra-x6.png
    alt: "Grouped bar chart of scores on six agentic benchmarks, FinanceBench, IFBench, Finance Agent, FinanceQA, MCP-Atlas and BFCL Core, with each model's mean in a shaded group at the right. Palmyra x6 is the first, blue bar in each group. It has the tallest bar on BFCL Core, at 0.785, and the tallest bar in the mean group."
    width: 1551
    height: 644
figure_caption: "Figure 2 from Du et al., Palmyra x6 technical report, 2026: Palmyra x6 against other frontier models on six agentic benchmarks, with each model's mean at the right."
results:
  - "Palmyra x6 has the top BFCL Core score among the compared models, at 0.785."
  - "It also has the top mean across the six benchmarks."
  - "It scores higher than the previous default model of Writer Agent on every benchmark in the evaluation suite."
facts:
  - { label: Method, value: "Anchored supervised fine-tuning on verified synthetic tool-use trajectories" }
  - { label: Base model, value: "Open mixture-of-experts model with 744B total parameters" }
  - { label: My role, value: "Built the synthetic tool-use data pipeline; co-authored the report" }
---
Palmyra x6 is WRITER's shipped agentic model, built for multi-step planning, tool calling and long tasks in tool-rich environments such as MCP tool suites, web search and code sandboxes.
Ordinary supervised fine-tuning on a small, specialized dataset tends to pull a model away from what it already does well, so the report uses anchored supervised fine-tuning: each token's loss is weighted by the model's confidence in that token, and a penalty keeps the model close to a frozen copy of the base.

I built the synthetic tool-use data pipeline whose data post-trained the model.
A successful reference trajectory is reduced to a strategy-level demonstration with its answer removed, and the model then solves the task itself against live tools, using the demonstration only as guidance.
A rollout is kept only if a judge model grades the whole trajectory correct, and a leakage filter rejects rollouts that copied the demonstration instead of calling the tools.
