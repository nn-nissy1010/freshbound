# FreshBound — Claude Code ハーネス構成 作業報告書

---

## 概要

本プロジェクトにおいて、Claude Code（AIコーディングアシスタント）が**実際の開発に即した形で動作する**よう、以下の構成を整備しました。すべての設定はリポジトリに含まれており、開発者がクローンするだけで同じ環境が再現されます。

---

## 作成・更新したファイル一覧

```
freshbound/
├── CLAUDE.md                              ← 新規作成（大幅拡張）
├── AGENTS.md                              ← 既存（変更なし）
├── README.md                              ← 更新（プロジェクト内容に書き換え）
├── .env.local.example                     ← 新規作成
├── .gitignore                             ← 更新（2箇所修正）
└── .claude/
    ├── HARNESS.md                         ← 新規作成（先方向け説明書）
    ├── settings.json                      ← 新規作成
    ├── settings.local.json                ← クリア済み・gitignore済み
    ├── commands/
    │   ├── check-mvp-scope.md             ← 新規作成
    │   ├── handoff-check.md               ← 新規作成
    │   └── security-check.md              ← 新規作成
    ├── plugins/superpowers/
    │   ├── hooks/session-start            ← Superpowers本体
    │   ├── hooks/run-hook.cmd             ← Superpowers本体
    │   └── skills/using-superpowers/      ← Superpowers本体
    └── skills/                            ← 14スキル（全フェーズ共通）
        ├── brainstorming/
        ├── test-driven-development/
        ├── systematic-debugging/
        └── ... （計14スキル）
```

---

## 1. CLAUDE.md — AIへの指示書

### 何をしたか

Claude Codeが毎回の会話で自動参照する「プロジェクト仕様書」を、Next.jsのボイラープレートの1行（`@AGENTS.md`）から、本格的な開発指示書へ全面的に書き起こしました。

### 記載した内容

| セクション | 内容 |
|-----------|------|
| プロジェクト概要 | MVP Phase 1に限定した作業スコープを明示 |
| 技術スタック | Next.js 16 / Supabase / SendGrid / OpenAI / LINE / Vercel など全技術を列挙 |
| ディレクトリ構成 | `src/app/`・`lib/`・`types/` 等の配置ルールを機能IDと紐付けて定義 |
| MVP 機能スコープ（12機能） | F-01〜F-10（サブ機能含む）を詳細仕様とともに記載 |
| MVP 画面構成（7画面） | 実装対象の画面を明示 |
| データモデル（10テーブル） | テーブル名・内容・RLS必須を明記 |
| 開発ルール | Next.js・TypeScript・セキュリティ・テスト・コード品質の5分野 |
| 環境変数リスト | 全APIキー（Supabase / OpenAI / SendGrid / IMAP / LINE / musubu / hunter.io / WhoisXML） |
| 外部サービス連携 | MVP対象の7サービスを機能IDとともに整理 |
| **スコープ外リスト** | Phase 2/3の13機能を「実装禁止」として明示 |
| 開発スケジュール（Week 1〜7） | 実装順序を週単位で定義 |
| 納期リスク時のフォールバック順位 | F-02B → F-03A → F-06A の順で延期可、F-06Aは法令上最後の手段と明記 |
| 引き継ぎ納品物リスト | Week 7に必要な9種類のドキュメントを定義 |
| MVP 品質KPI | 開封率15%以上・返信率1.5%以上・新規HP判定精度60%以上等 |
| 非機能要件 | 配信3,000通/日・CSV取込5分以内・ダッシュボード2秒以内等 |

### なぜ重要か

AIは指示書がなければプロジェクトの文脈を知らずにコードを書きます。この指示書があることで、**Phase 2/3の機能を勝手に実装する**・**間違ったディレクトリに配置する**・**セキュリティルールを無視する**といったミスを自動的に防止します。

---

## 2. .claude/settings.json — 権限・フック設定

### 何をしたか

Claude Codeのふるまいを制御する設定ファイルを新規作成しました。「権限（何を自動実行してよいか）」と「フック（いつ何を自動チェックするか）」の2つを定義しています。

### 権限設定（permissions.allow）

開発中に毎回確認プロンプトが出ると作業効率が落ちるため、安全なコマンドのみを事前に許可しています。

```
許可: npm run * / npx tsc / npx vitest / npx prettier / npx supabase
許可: git status / diff / log / show / add
許可: find / grep / ls / cat / mkdir / cp / mv / curl / node
```

**git push・git reset --hard・rm -rf・DROP TABLE などの破壊的操作は許可リストに含めていません。** これらは必ず人間の確認を経てから実行されます。

### フック設定（hooks）

| フック | タイミング | 動作 |
|--------|-----------|------|
| SessionStart | セッション開始時 | Superpowersのスキル使用方法をAIに自動注入 |
| PostToolUse | `.ts/.tsx` ファイル編集後 | TypeScript型エラーを自動検出・表示（最大8件） |
| PreToolUse | Bashコマンド実行前 | 破壊的操作（`git push --force`・`rm -rf`・`DROP TABLE`等）を検知して警告 |

---

## 3. Superpowers プラグイン — AI開発方法論

### 何をしたか

[Superpowers](https://github.com/obra/superpowers)（オープンソースのClaude Code用スキルフレームワーク）を、リポジトリ内（`.claude/`）に直接組み込みました。

**グローバルインストール（`~/.claude/`）ではなくプロジェクトローカルに配置**しているため、リポジトリをクローンするだけで全開発者・全フェーズで使えます。追加のインストール作業は不要です。

### 提供される14スキル

| スキル | 効果 |
|--------|------|
| `brainstorming` | コードを書く前に設計・要件を整理させる |
| `writing-plans` | タスクを具体的な実装ステップに分解させる |
| `executing-plans` | 計画に沿って着実に実行させる |
| `test-driven-development` | テストを先に書いてから実装させる（TDD） |
| `systematic-debugging` | バグの原因を体系的に特定させる |
| `verification-before-completion` | 「完了」と言う前に動作確認を必須にする |
| `requesting-code-review` | レビュー依頼前の準備を標準化する |
| `receiving-code-review` | レビューフィードバックの処理を標準化する |
| `finishing-a-development-branch` | ブランチ完了前のチェックリストを実行させる |
| `subagent-driven-development` | 複数のAIエージェントを協調させる |
| `dispatching-parallel-agents` | 独立したタスクを並列処理させる |
| `using-git-worktrees` | Git worktreeを使った並行作業を支援する |
| `writing-skills` | 新しいスキルの書き方を定義する |
| `using-superpowers` | 全スキルの使い方（セッション開始時に自動注入） |

### 技術的な実装詳細

- `hooks/session-start` スクリプトがセッション開始時に自動実行され、`CLAUDE_PLUGIN_ROOT` を正しく設定した上でClaude CodeのJSON形式（`hookSpecificOutput.additionalContext`）でコンテキストを注入します
- 全14スキルは `.claude/skills/` に格納され、Claudeが作業内容に応じて `Skill` ツール経由で参照します

---

## 4. プロジェクト専用スラッシュコマンド

### 何をしたか

このプロジェクト固有の定型チェック作業を、Claude Codeのチャット欄から `/コマンド名` で即座に実行できるコマンドとして3本作成しました。

### コマンド一覧

**`/check-mvp-scope`**
実装した内容がMVP Phase 1のスコープ内に収まっているかを確認します。Phase 2/3の機能が混入していた場合、具体的なコード箇所と対応方針を日本語で報告します。

**`/handoff-check`**
Week 7の社内エンジニアへの引き継ぎ準備が整っているかをチェックリスト形式で確認します。ドキュメント・テストカバレッジ・セキュリティ要件・Phase 2拡張ポイントの4分野を網羅しています。

**`/security-check`**
RLS設定の漏れ・環境変数の露出・個人情報の取り扱い・特定電子メール法への対応状況を確認します。問題があればファイルパスと行番号を明示して報告します。

---

## 5. その他のファイル

### `.env.local.example` — 環境変数テンプレート

必要な全APIキー（13変数）のテンプレートファイルを作成しました。各変数に取得先URL・注意事項（Gmail アプリパスワード等）をコメントで記載しています。新規開発者はこのファイルをコピーするだけでセットアップを開始できます。

### `.gitignore` の修正

- `.env.local.example` が誤って除外されていたバグを修正（`!.env.local.example` を追加）
- `.claude/settings.local.json`（個人設定ファイル）をgit管理外に追加

### `README.md` の更新

Next.jsのデフォルトボイラープレートから、プロジェクト固有の内容（セットアップ手順・コマンド一覧・MVP機能一覧・Claude Codeハーネス構成へのリンク）に全面書き換えました。

### `package.json` へのスクリプト追加

CLAUDE.mdで参照しているが存在していなかった3つのスクリプトを追加しました。

| 追加スクリプト | コマンド |
|--------------|---------|
| `npm run test` | `vitest run` |
| `npm run test:coverage` | `vitest run --coverage` |
| `npm run format` | `prettier --write .` |

### `.claude/HARNESS.md` — 先方向け説明書

技術者でない先方・発注者がハーネス構成を理解できるよう、全設定ファイルの役割・権限の範囲・スキルの使い方・開発ワークフロー・変更禁止事項を日本語でまとめたドキュメントを作成しました。

---

## まとめ

| カテゴリ | 設定内容 |
|---------|---------|
| **指示書** | CLAUDE.md — MVP仕様・ルール・スコープ外リストを完備 |
| **権限制御** | 安全コマンドのみ自動許可、破壊的操作は必ず確認 |
| **自動品質チェック** | TypeScript型エラー即時検出、破壊的操作の事前警告 |
| **開発方法論** | Superpowers 14スキル（TDD・デバッグ・設計・レビュー等） |
| **定型コマンド** | MVPスコープ・引き継ぎ・セキュリティの3チェックコマンド |
| **移植性** | リポジトリクローンのみで全開発者・全フェーズで同一環境が再現される |
