<div align="center">

# yutojubako/blog

Yuto Imai の個人ブログ。[Astro](https://astro.build) 製（[astro-theme-resume](https://github.com/srleom/astro-theme-resume) ベースのカスタムテーマ）。

**URL**: <https://yutojubako.github.io/blog/>

</div>

---

## About

技術メモと学会参加報告（YANS など）を中心に書いています。履歴書サイトは [maimai.github.io](https://github.com/yutojubako/maimai.github.io) で別途公開しています。

## 記事の書き方

`src/content/post/` に Markdown（`index.md`）を置くだけ:

```bash
src/content/post/2026-01-01-my-post/index.md
```

フロントマターの例:

```yaml
---
title: "記事タイトル"
description: "記事の説明（50〜160字で必須）"
publishDate: "2026-01-01 10:00:00 +0900"
tags: [NLP, Research]
---
```

- `title` は60字以内、`description` は50〜160字が必須
- `draft: true` でドラフト（非公開）
- `updatedDate`、`coverImage`、`ogImage` は任意

## ローカルでの実行

```bash
git clone https://github.com/yutojubako/blog.git
cd blog
npm install
npm run dev
```

ブラウザで <http://localhost:4321/blog/> にアクセス

## デプロイ

`main` への push で GitHub Actions（[withastro/action](https://docs.astro.build/ja/recipes/deploy-github-pages/)）が自動ビルドし、GitHub Pages にデプロイされます。

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) をご覧ください。
