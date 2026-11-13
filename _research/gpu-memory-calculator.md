---
title: GPU Memory Calculator
kind: software
order: 1
label: "Open-source web tool"
summary: "Estimates how much GPU memory it takes to train or serve a large language model, across the common distributed training and inference engines."
links:
  - { label: "Code", href: "https://github.com/George614/gpu-mem-calculator" }
  - { label: "Demo", href: "https://huggingface.co/spaces/george614/gpu-memory-calculator" }
figures:
  - src: /assets/img/research/gpu-memory-calculator.png
    alt: "The results panel of the calculator for a 7B-parameter model trained on 8 GPUs. It lists memory per GPU and in total, then a breakdown into model parameters, gradients, optimizer states, activations and overhead, drawn as a stacked bar where activations take most of the space, and ends with a feasibility check that reads Fits on GPU."
    width: 1370
    height: 623
figure_caption: "The results panel: memory per GPU, a breakdown by component, and whether the configuration fits on the chosen GPU."
results:
  - "Breaks training memory down into parameters, gradients, optimizer states and activations, with CPU and NVMe offloading, activation checkpointing and multi-node setups."
  - "Covers inference with the KV cache, its quantization options (INT8, FP8 and INT4), tensor parallelism and a throughput estimate."
  - "Ships preset configurations for models such as LLaMA 2, GPT-3 and Mixtral, and exports configs for Accelerate, Lightning and Axolotl."
  - "Runs as a web interface with formula explanations, as a command-line tool and as a Python API."
facts:
  - { label: Training engines, value: "PyTorch DDP, DeepSpeed ZeRO stages 1 to 3, Megatron-LM, Megatron with DeepSpeed, and PyTorch FSDP" }
  - { label: Inference engines, value: "Hugging Face Transformers, vLLM, TGI, TensorRT-LLM and SGLang" }
  - { label: Built with, value: "Python and FastAPI" }
---
Before launching a training run on a large language model, it helps to know whether the model, its optimizer and its activations will fit on the GPUs at hand, and which parallelism settings make them fit.
This calculator answers that question for training and for inference, and shows the formula behind each number.
