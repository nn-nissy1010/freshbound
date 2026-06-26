# Claude Code ハーネス構成概要

本ドキュメントは、FreshBound プロジェクトにおける **Claude Code（AI コーディングアシスタント）の活用構成** を、先方・発注者が理解できる形でまとめたものです。

---

## 1. 全体像

```
.
├── CLAUDE.md                        ← AIへの「仕様書」（最重要）
├── AGENTS.md                        ← Next.js バージョン固有の注意事項
├── .env.local.example               ← 環境変数テンプレート
└── .claude/
    ├── HARNESS.md                   ← このドキュメント（先方向け説明書）
    ├── settings.json                ← Claude Code の権限・フック設定
    ├── commands/                    ← プロジェクト専用スラッシュコマンド
    │   ├── check-mvp-scope.md       ← /check-mvp-scope
    │   ├── handoff-check.md         ← /handoff-check
    │   └── security-check.md        ← /security-check
    ├── plugins/superpowers/         ← Superpowers プラグイン本体
    │   ├── hooks/session-start      ← セッション開始時に自動実行
    │   └── skills/using-superpowers ← Superpowers の使い方スキル
    └── skills/                      ← Superpowers 14スキル（全開発者共有）
        ├── brainstorming/
        ├── test-driven-development/
        ├── systematic-debugging/
        └── ... （計14スキル）
```

---

## 2. CLAUDE.md — AI への指示書

**役割：** Claude Code がコードを書くときに常に参照する「仕様書＋ルール集」です。

### 記載内容

| セクション                                    | 目的                                          |
| --------------------------------------------- | --------------------------------------------- |
| プロジェクト概要・技術スタック                | AI が正しい技術選択をできるようにする         |
| ディレクトリ構成                              | ファイルを正しい場所に作成させる              |
| MVP 機能スコープ（12機能）                    | Phase 2/3 の機能を勝手に実装しないようにする  |
| 開発ルール（Next.js/TypeScript/セキュリティ） | コードの品質・安全性を担保する                |
| 環境変数リスト                                | 必要な API キーを漏れなく把握させる           |
| 開発スケジュール（Week 1〜7）                 | 実装順序を守らせる                            |
| 引き継ぎ納品物リスト                          | Week 7 時点で必要なドキュメントを揃えさせる   |
| **スコープ外リスト**                          | Phase 2/3 の機能を MVP に混入させない（重要） |

---

## 3. settings.json — 権限・フック設定

**役割：** Claude Code が自動実行できるコマンドの範囲と、ファイル変更時・セッション開始時の自動チェックを定義します。

### 権限設定（permissions）

Claude Code が確認プロンプトなしに実行できるコマンド一覧です。
開発に必要な読み取り・ビルド・テスト系コマンドのみを許可しています。

| 許可コマンド                                                     | 用途                                           |
| ---------------------------------------------------------------- | ---------------------------------------------- |
| `npm run *`                                                      | 開発サーバー起動・ビルド・テスト・フォーマット |
| `npx tsc`, `npx vitest`, `npx prettier`, `npx supabase`          | 型チェック・テスト・フォーマット・DB操作       |
| `git status`, `diff`, `log`, `show`, `add`                       | 変更確認（push・reset は含まない）             |
| `find`, `grep`, `ls`, `cat`, `mkdir`, `cp`, `mv`, `curl`, `node` | ファイル操作・API疎通確認                      |

**git push・git reset --hard・rm -rf・DROP TABLE などは権限リストに含めていません。**
これらは実行前に必ず人間の確認を求めます。

### フック設定（hooks）

| タイミング                           | 対象                    | 動作                                                                    |
| ------------------------------------ | ----------------------- | ----------------------------------------------------------------------- |
| **セッション開始時**（SessionStart） | 毎回                    | Superpowers スキルの使い方をAIに注入する                                |
| **ファイル編集後**（PostToolUse）    | `.ts` / `.tsx` ファイル | TypeScript の型エラーを自動検出し、エラーがあれば即座に表示             |
| **コマンド実行前**（PreToolUse）     | Bash コマンド           | `git push --force`・`rm -rf`・`DROP TABLE` 等の破壊的操作を検知して警告 |

---

## 4. Superpowers — AI 開発方法論プラグイン

**役割：** AI がコードを書く前に「ちゃんと考える」ための作業手順を強制するプラグインです。
リポジトリに含まれているため、**クローンするだけで全開発者（MVP・Phase 2・Phase 3）が使えます。**

### Superpowers が提供する14スキル

| スキル                           | 使いどき                                               |
| -------------------------------- | ------------------------------------------------------ |
| `brainstorming`                  | 実装前の設計・要件整理                                 |
| `writing-plans`                  | タスクを具体的な実装ステップに分解する                 |
| `executing-plans`                | 計画に沿ってタスクを実行する                           |
| `test-driven-development`        | テストファースト開発（テストを先に書く）               |
| `systematic-debugging`           | バグの原因を体系的に特定する                           |
| `verification-before-completion` | 「完了」と言う前に動作を確認する                       |
| `requesting-code-review`         | コードレビューを依頼する前の準備                       |
| `receiving-code-review`          | コードレビューのフィードバックを処理する               |
| `finishing-a-development-branch` | ブランチ完了前のチェックリスト                         |
| `subagent-driven-development`    | 複数のAIエージェントを使った並行開発                   |
| `dispatching-parallel-agents`    | 独立したタスクを並列で処理する                         |
| `using-git-worktrees`            | Git worktree を使った並行作業                          |
| `writing-skills`                 | 新しいスキルを書く方法                                 |
| `using-superpowers`              | Superpowers 全体の使い方（セッション開始時に自動注入） |

### Superpowers の使い方（開発者向け）

Superpowers スキルは **セッション開始時に自動で有効になります**。
追加の設定は不要です。Claude Code を開いて作業を依頼するだけで動作します。

---

## 5. プロジェクト専用スラッシュコマンド（commands/）

Claude Code のチャット欄で `/コマンド名` と入力するだけで実行できる、このプロジェクト固有の定型チェックです。

### `/check-mvp-scope` — MVP スコープ確認

**使いどき：** 実装した機能が MVP の範囲内か不安なとき
**動作：** 実装内容を確認し、Phase 2/3 の機能が混入していないかをチェックして日本語で報告します。

### `/handoff-check` — 引き継ぎ準備確認

**使いどき：** Week 7（テスト・ドキュメント週）の進捗確認、リリース前の最終チェック
**動作：** 引き継ぎ必須ドキュメント・テストカバレッジ・セキュリティ要件の充足状況をチェックリスト形式で報告します。

### `/security-check` — セキュリティクイック監査

**使いどき：** 実装後のセキュリティ確認、コードレビュー前
**動作：** RLS 設定の漏れ・環境変数の露出・個人情報の取り扱い・特定電子メール法対応を確認して報告します。

---

## 6. 開発ワークフロー（AI との協働フロー）

```
1. 開発者が Claude Code を起動
       ↓
2. Superpowers がセッション開始時に自動で有効化（スキルが使えるようになる）
       ↓
3. 開発者がタスクを依頼
       ↓
4. Claude Code が CLAUDE.md を参照しながら Superpowers スキルを使ってコードを生成
       ↓
5. .ts/.tsx ファイルを保存 → フックが自動で型チェックを実行
       ↓
6. 実装が完了したら /check-mvp-scope で MVP スコープ内か確認
       ↓
7. コミット前に /security-check でセキュリティ確認
       ↓
8. Week 7 に /handoff-check で引き継ぎ準備の確認
```

---

## 7. MVP 期間中に AI が「やらないこと」

CLAUDE.md の「スコープ外リスト」により、AI は以下を自動的に回避します：

- ステップメール・シナリオ配信の実装
- 匿名トラッキング（IP→企業特定）の実装
- チームコラボレーション機能の実装
- Inngest（非同期ワーカー）の導入
- その他 Phase 2/3 の全機能（F-11〜F-21）

---

## 8. ファイル変更禁止事項

以下のファイルは勝手に変更しないこと（変更する場合は発注者と合意の上で行う）：

| ファイル                | 理由                               |
| ----------------------- | ---------------------------------- |
| `CLAUDE.md`             | AI の動作仕様に直接影響する        |
| `.claude/settings.json` | 権限範囲が変わり、安全性に影響する |
| `.claude/skills/`       | Superpowers スキルの内容が変わる   |
| `.env.local`            | 本番・ステージングの API キー      |
