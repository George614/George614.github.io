---
title: Differential Transformer with low-rank adapters
kind: research
topic: agents
sort_date: "2025-08-31"
label: "WRITER, 2025"
summary: "Making the differential Transformer cheaper to train and better at long context, with low-rank adapters and hyper-attention."
authors: "Zhizhuo Yang, with Melisa Russak, Kiran Kamble, Krzysztof Święcicki and Maciej Pióro."
cv_sourced: true
results:
  - "Proposed a cumulative relevance score and used it, with sparsity scores, to compare vanilla, differential and improved differential Transformers across datasets."
  - "Examined how low-rank adapters improve the training and parameter efficiency of the differential Transformer, aiming at long-context performance, lower memory use and lower training cost."
  - "Integrated hyper-attention into the improved differential Transformer and benchmarked it against FlashAttention-2."
facts:
  - { label: Architecture, value: "Differential Transformer" }
  - { label: Methods, value: "Low-rank adapters and hyper-attention" }
  - { label: Baseline, value: "FlashAttention-2" }
  - { label: Period, value: "February to August 2025" }
---
The differential Transformer computes attention as the difference of two attention maps, which cancels much of the noise that ordinary attention spreads over irrelevant tokens.
This project asked how to keep that benefit while making the model cheaper to train and better on long inputs.

We measured where each variant puts its attention with a new cumulative relevance score, adapted the architecture with low-rank adapters for training and parameter efficiency, and tested hyper-attention as a faster attention kernel for long context.
