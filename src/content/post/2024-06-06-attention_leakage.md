---
title: "PytorchのMultiHeadAttentionの次元に注意"
description: "PyTorchのMultiHeadAttentionはデフォルトではbatch_firstが無効で，rankingモデルにself-attentionを組み込むと評価時にリークが発生しMRRが異常に高くなる話とその対処方法。"
publishDate: "2024-06-06 11:02:55 +0900"
tags: ['pytorch', 'attention', 'ML', 'leakage']
---

<!--more-->

# TL:DR

デフォルトで用意されているパラメータ`batch_first`を適切に設定しないとleakageしまくるという話

## 背景

- ランキングモデルにselfattentionを組み込もうとした時に，急にMRR=83%とか出てくる
- 評価時の関数に問題があるかどうか確認したが，自分では問題を発見できなかった
- attentionを組み込んだ際のみにこの現象が確認されたので，attention部分の自分の実装に問題がある

## 問題点

### 参考文献

[公式リファレンス](https://pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html)
