# FreshBound — AIアウトバウンド自動化 SaaS

BtoB新規開拓を、リスト作成から商談化までAIで全自動化する営業SaaSです。

> **現在フェーズ：Phase 1 MVP 開発中**（5〜7週間 / 8月末リリース予定）

---

## 技術スタック

- **フロントエンド：** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **バックエンド：** Next.js API Routes + Supabase Edge Functions
- **DB：** Supabase (PostgreSQL + RLS)
- **認証：** Supabase Auth
- **ホスティング：** Vercel + Supabase
- **メール配信：** SendGrid
- **AI生成：** OpenAI GPT-4o-mini
- **通知：** LINE Messaging API

---

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.local.example .env.local
# .env.local を開いて各 API キーを設定する
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開く。

---

## 主なコマンド

| コマンド | 内容 |
|---------|------|
| `npm run dev` | 開発サーバー起動（Turbopack） |
| `npm run build` | 本番ビルド |
| `npm run lint` | ESLint チェック |
| `npm run test` | テスト実行（Vitest） |
| `npm run test:coverage` | テストカバレッジ計測 |
| `npm run format` | Prettier フォーマット |
| `npx tsc --noEmit` | TypeScript 型チェック |
| `npx supabase db push` | DB マイグレーション適用 |

---

## Claude Code ハーネス構成

このプロジェクトは Claude Code（AIコーディングアシスタント）を使って開発します。
構成の詳細は [`.claude/HARNESS.md`](.claude/HARNESS.md) を参照してください。

### カスタムスラッシュコマンド

| コマンド | 用途 |
|---------|------|
| `/check-mvp-scope` | 実装が MVP スコープ内か確認 |
| `/handoff-check` | 引き継ぎ納品物の充足状況確認 |
| `/security-check` | セキュリティ要件の確認 |

---

## MVP 機能一覧（Phase 1）

| 機能ID | 機能名 |
|-------|--------|
| F-01 | ICP設計（簡易版） |
| F-02 | 企業発掘（musubu API） |
| F-02A | 新規HP判定（WHOIS） |
| F-02B | CSV取込 |
| F-03 | 担当者発掘（hunter.io） |
| F-03A | 電話番号取得 |
| F-04 | AIスコアリング（簡易版） |
| F-05 | AIメール生成（GPT-4o-mini） |
| F-06 | SendGrid配信 |
| F-06A | 配信停止管理（特定電子メール法対応） |
| F-07 | 反応検知（開封/返信） |
| F-08 | ホットリード通知（LINE） |
| F-09 | ダッシュボード |
| F-10 | マルチテナント（RLS） |

---

## ドキュメント

| ドキュメント | 内容 |
|------------|------|
| [`CLAUDE.md`](CLAUDE.md) | AI への開発指示書（機能仕様・ルール） |
| [`.claude/HARNESS.md`](.claude/HARNESS.md) | Claude Code ハーネス構成の説明 |
| [`.env.local.example`](.env.local.example) | 環境変数テンプレート |
| `docs/` | アーキテクチャ図・DB設計・API仕様（Week 7 に整備） |
