# Medical QA System with Mixture of Experts

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-red.svg)](https://pytorch.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen.svg)]()

> **A production-grade medical question-answering system leveraging Mixture of Experts (MoE) routing for intelligent domain selection across 5 medical specialties with 98.10% routing accuracy**.

> **Intelligent medical question answering with learned domain routing across 5 specialties**

<!-- ![System Demo](https://via.placeholder.com/800x400/4A90E2/ffffff?text=Add+Your+Demo+GIF+Here) -->

---


## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Dataset Details](#dataset-details)
- [Model Components](#model-components)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [Performance Metrics](#performance-metrics)
- [Project Structure](#project-structure)
- [Development Journey](#development-journey)
- [Results & Analysis](#results--analysis)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Citation](#citation)
- [License](#license)
- [Contact](#contact)

---

## 🎯 Overview

This project implements an intelligent **Medical Question Answering System** that automatically routes user queries to specialized medical domain experts using a learned **Mixture of Experts (MoE)** architecture. Unlike traditional rule-based classification systems, our approach learns optimal routing patterns from data, achieving **98.10% routing accuracy** across 5 medical specialties.

### **Problem Statement**

Traditional medical QA systems face several challenges:
- **Domain Complexity**: Medical knowledge spans 100+ specialties with distinct terminology
- **Routing Accuracy**: Rule-based systems achieve only ~75% accuracy
- **Scalability**: Monolithic models cannot effectively cover all medical domains
- **Performance**: Need sub-second response time for production deployment


