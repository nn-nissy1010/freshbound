@AGENTS.md

# FreshBound — AIアウトバウンド自動化 SaaS

## プロジェクト概要

BtoB新規開拓を、リスト作成から商談化までAIで全自動化する営業SaaS。
**現在の作業スコープ：Phase 1 MVP のみ（5〜7週間）**
Phase 2/3 の機能は実装しない。営業資料向けロードマップとして存在するが、コードには含めない。

---

## 技術スタック

| 分類 | 技術 |
|------|------|
| フロントエンド | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| バックエンド | Next.js API Routes + Supabase Edge Functions |
| DB | Supabase (PostgreSQL) + Row Level Security (RLS) |
| 認証 | Supabase Auth（2階層：弊社管理者 / 顧客テナント） |
| ホスティング | Vercel + Supabase |
| メール配信 | SendGrid |
| AI生成 | OpenAI GPT-4o-mini |
| 通知 | LINE Messaging API |
| ワーカー基盤 | Inngest（Phase 2 ステップメール時に導入。MVP では不要） |

---

## ディレクトリ構成

```
src/
  app/
    (auth)/                   # 認証グループ（ログイン前）
      login/
    (dashboard)/              # ログイン後グループ
      dashboard/              # F-09 ダッシュボード
      companies/              # F-02 企業リスト・F-03A 電話番号表示
      campaigns/              # F-06 配信管理・F-07 反応検知
      csv-import/             # F-02B CSV取込
      unsubscribe-list/       # F-06A 配信停止管理
      icp/                    # F-01 ICP設定
    api/
      auth/
      companies/
      campaigns/
      csv/
      webhooks/
        sendgrid/             # 開封・クリック Webhook（F-07）
        line/
  components/
    ui/                       # 汎用UIコンポーネント（Button, Card, Table 等）
    forms/
    layouts/
  lib/
    supabase/                 # Supabase クライアント（server/client 分離）
    sendgrid/                 # SendGrid 連携（F-06）
    openai/                   # GPT-4o-mini 連携（F-05）
    line/                     # LINE Messaging API（F-08）
    whois/                    # WhoisXML API（F-02A 新規HP判定）
    hunter/                   # hunter.io（F-03 担当者発掘）
    musubu/                   # musubu API（F-02 企業発掘・F-03A 電話番号）
  types/                      # TypeScript 型定義（全テーブル型はここに集約）
```

---

## MVP Phase 1 機能スコープ（12機能）

| ID | 機能名 | 概要 |
|----|--------|------|
| F-01 | ICP設計（簡易版） | 固定5〜7問のフォーム、ICPプロファイルをDBに保存・手動修正可 |
| F-02 | 企業発掘 | musubu API（代替: Baseconnect）連携、ICP条件で抽出（上限1,000件/日）、重複排除 |
| F-02A | 新規HP判定 | WHOISでドメイン登録日6ヶ月以内を判定、`is_new_hp` フラグをDBに保存 |
| F-02B | CSV取込 | 既存リストCSV取込、カラムマッピングUI、重複検知・クレンジング |
| F-03 | 担当者発掘 | hunter.io APIでメールアドレス特定、取得不可時は代表メール（info@・contact@）を fallback、最大3候補をDBに保存 |
| F-03A | 電話番号取得 | musubu等DBから電話番号取得、企業リスト画面に表示、テレアポ用CSVエクスポート |
| F-04 | AIスコアリング（簡易版） | 業種・規模・地域でICPマッチ度を0〜100点でスコアリング |
| F-05 | AIメール生成 | GPT-4o-miniでパーソナライズメール生成（件名・本文）、ハルシネーション防止プロンプト必須 |
| F-06 | SendGrid配信 | SPF/DKIM/DMARC対応、1日3,000通上限、配信ログをDBに記録 |
| F-06A | 配信停止管理 | 配信停止リンク自動付与、停止リクエスト自動処理、特定電子メール法遵守（MVP必須） |
| F-07 | 反応検知 | 開封検知（SendGrid Webhook）、返信検知（IMAP）、反応データをDBに保存 |
| F-08 | ホットリード通知 | 返信時にLINE通知（企業名・連絡先・返信本文） |
| F-09 | ダッシュボード | 今日の数値・リスト管理・配信履歴・基本フィルタ |
| F-10 | マルチテナント | 2階層権限（弊社管理者/顧客）、PostgreSQL RLS、Supabase Auth |

---

## MVP 画面構成（7画面）

1. ログイン画面
2. ICP設定画面
3. 企業リスト画面（電話番号も表示、新規HPフラグも表示）
4. 配信履歴画面
5. ダッシュボード
6. CSV取込画面
7. 配信停止リスト管理画面

---

## データモデル（MVP テーブル）

| テーブル名 | 内容 |
|-----------|------|
| `tenants` | 企業名・契約プラン・代理店ID |
| `users` | メール・パスワード・テナントID（Supabase Auth と連携） |
| `icp_profiles` | 業種・規模・地域・予算 |
| `companies` | 企業名・URL・所在地・規模・業種・スコア・`is_new_hp` フラグ・テナントID |
| `phone_numbers` | 企業ID・電話番号・取得元・有効性フラグ |
| `contacts` | 氏名・メール・役職・企業ID |
| `emails` | 件名・本文・配信先・状態・テナントID |
| `unsubscribe_list` | メールアドレス・停止日時・理由・テナントID |
| `reactions` | 開封・返信・タイムスタンプ・メールID |
| `csv_import_history` | ファイル名・取込日時・件数・カラムマッピング情報 |

**全テーブルに RLS ポリシーを設定すること。`tenant_id` によるフィルタリングを必ず実装する。**

---

## 開発ルール

### Next.js
- App Router を使用する（Pages Router は使わない）
- コードを書く前に `node_modules/next/dist/docs/` のドキュメントを参照すること
- Server Components をデフォルトとし、インタラクティブな処理にのみ `'use client'` を使う
- API Routes は `src/app/api/` 以下に配置する
- `next.config.ts` の変更前にドキュメントで該当APIを確認すること

### TypeScript
- `strict: true` を維持する
- `any` 型は使用禁止（`unknown` を使うこと）
- 全テーブルの型定義は `src/types/` に集約する
- Supabase の型は `supabase gen types` で生成し、手書きしない

### セキュリティ・コンプライアンス（MVP必須）
- 環境変数はサーバーサイドのみで参照する（`NEXT_PUBLIC_` はSupabase接続情報のみ）
- **全テーブルに RLS を設定する**
- API Routes では必ずテナントIDを検証してからクエリを実行する
- CSV取込のファイルは必ずサイズ・MIMEタイプをバリデーションする
- F-06A（配信停止管理）は特定電子メール法の要件を完全実装すること
- **企業データの暗号化保存**：Supabase は保存時暗号化済みだが、APIキー等の機密情報は環境変数のみで管理し、DBには保存しない
- **個人情報保護法対応**：氏名・メールアドレス・電話番号等の個人情報はログに出力しない、第三者提供禁止、取得目的を利用規約に明示すること

### テスト
- テストフレームワーク：**Vitest** + `@testing-library/react`（Jest は Next.js 16 の ESM と相性が悪いため不使用）
- テストコマンド：`npm run test`（`vitest run`）、カバレッジ：`npm run test:coverage`（`vitest run --coverage`）
- テストカバレッジ 50% 以上を維持する
- テストファイルの配置：`src/**/__tests__/` または `src/**/*.test.ts(x)`

### コード品質
- 複雑なロジック（スコアリング計算・WHOISパース・メール生成プロンプト等）には日本語コメントを付ける
- 命名は英語で意味が分かる名前にする
- コミット前に `npm run lint`・`npx tsc --noEmit`・`npm run test` が通ることを確認する
- Prettier + ESLint で統一すること（`npm run format` = `prettier --write .`）

---

## 環境変数（必須）

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI（F-05）
OPENAI_API_KEY=

# SendGrid（F-06）
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
SENDGRID_WEBHOOK_SIGNING_SECRET=

# IMAP（F-07 返信検知）
IMAP_HOST=
IMAP_PORT=993
IMAP_USER=
IMAP_PASSWORD=

# LINE（F-08）
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=

# 外部API
MUSUBU_API_KEY=
HUNTER_API_KEY=
WHOISXML_API_KEY=
```

---

## 外部サービス連携（MVP のみ）

| サービス | 用途 | 機能ID |
|---------|------|--------|
| musubu API | 企業発掘・電話番号取得 | F-02, F-03A |
| hunter.io | 担当者メールアドレス特定 | F-03 |
| WhoisXML API | 新規HP判定（ドメイン登録日取得） | F-02A |
| OpenAI GPT-4o-mini | パーソナライズメール生成 | F-05 |
| SendGrid | メール一斉配信・開封Webhook | F-06, F-07 |
| LINE Messaging API | ホットリード返信通知 | F-08 |
| Supabase | DB・Auth・RLS | 全機能 |

---

## スコープ外（MVP では実装しない）

以下は Phase 2/3 の機能であり、コードに含めないこと：

- ステップメールフロー（F-10 Phase 2版）
- AI次アクション提案（F-11）
- A/Bテスト機能（F-12）
- Web閲覧トラッキング・匿名企業特定（F-13）
- シナリオエディタ（F-14）
- チームコラボレーション（F-15）
- 承認フロー（F-16）
- テンプレート共有＋AIアドバイス（F-17）
- ユーソナー・帝国データバンク連携（F-18）
- 求人ベース企業抽出（F-19）
- 通話記録・架電管理（F-20）
- 顧客感情分析（F-21）
- Inngest（Phase 2 で導入）

---

## 開発スケジュール（Week 1〜7）

実装順序は以下に従う。後の Week に依存する機能を先行して実装しないこと。

| Week | 作業内容 |
|------|---------|
| Week 1 | 要件確定・技術選定・外部API契約（musubu/hunter/WhoisXML/SendGrid/LINE） |
| Week 2-3 | F-10 マルチテナント基盤・Supabase Auth・DB構築・RLS設定 |
| Week 3-4 | F-02 企業発掘・F-03 担当者発掘・F-03A 電話番号取得 |
| Week 4 | F-02A 新規HP判定（簡易版）・F-02B CSV取込・F-04 AIスコアリング |
| Week 5 | F-05 メール生成・F-06 SendGrid配信・F-06A 配信停止管理 |
| Week 6 | F-07 反応検知・F-08 LINE通知・F-09 ダッシュボード・F-01 ICP設定 |
| Week 7 | テスト（カバレッジ50%確保）・引き継ぎドキュメント作成 |

---

## 納期リスク時のフォールバック優先順位

スケジュールが逼迫した場合、以下の順で Phase 2 に移行する（削除ではなく延期）：

1. F-02B CSV取込（1〜2日の実装）→ Phase 2 に延期可
2. F-03A 電話番号取得（1〜2日の実装）→ Phase 2 に延期可
3. F-06A 配信停止管理（1〜3日の実装）→ **法令必須のため最後の手段**

F-06A は特定電子メール法の対応上、省略する場合は必ず事前に発注者へ確認すること。

---

## 引き継ぎ納品物（社内エンジニア向け・Week 7 必須）

MVP 完了時に以下を必ず納品する。コードのみの納品は不可。

| ドキュメント | 内容 |
|------------|------|
| README.md | プロジェクト概要・ローカル起動手順 |
| アーキテクチャ図 | システム構成・コンポーネント関係図 |
| DB設計書 | テーブル定義・ER図・インデックス設計・RLS設計 |
| API仕様書 | 全エンドポイントのリクエスト/レスポンス例 |
| 環境構築手順書 | ローカル・ステージング・本番の起動手順 |
| デプロイ手順書 | Vercel デプロイ手順・ロールバック手順 |
| 運用マニュアル | 障害対応・ログ確認・モニタリング |
| 既知の不具合一覧 | MVP時点で未対応の事項 |
| Phase 2 拡張ポイント | ステップメール・匿名トラッキング等の組み込み位置 |

---

## MVP 品質 KPI（成功指標）

実装時にこの数値を達成できる設計にすること。

| 指標 | MVP 目標値 |
|------|-----------|
| メール開封率 | 15% 以上 |
| 返信率 | 1.5% 以上 |
| 新規HP判定精度（F-02A） | 60% 以上（Phase 2 で 80% に拡張） |
| ホットリード商談化率 | 10% 以上 |
| システム稼働率 | 99% |

---

## 非機能要件（MVP）

| 項目 | 目標値 |
|------|--------|
| メール生成 | 1通10秒以内 |
| 配信処理 | 1日3,000通 |
| CSV取込 | 10,000件まで、5分以内 |
| 反応検知遅延 | 5分以内 |
| ダッシュボード表示 | 2秒以内 |
| 同時運用顧客数 | 10社 |
| システム稼働率 | 99% |
