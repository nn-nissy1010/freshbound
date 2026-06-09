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
    (dashboard)/              # 顧客向けグループ
      dashboard/              # F-09 ダッシュボード
      companies/              # F-02 企業リスト・F-03A 電話番号表示
      campaigns/              # F-06 配信管理・F-07 反応検知
      csv-import/             # F-02B CSV取込
      unsubscribe-list/       # F-06A 配信停止管理
      icp/                    # F-01 ICP設定
    admin/                    # 管理者パネル（Control Tower）— Super Adminのみ
      dashboard/              # FA-01 管理者ダッシュボード
      tenants/                # FA-02 テナント管理（顧客一覧）
        agencies/             # FA-03 代理店一覧
      users/                  # FA-04 ユーザー管理
      delivery/               # FA-05 配信監視
        campaigns/            # キャンペーン監視
        email-logs/           # メールログ
        unsubscribes/         # 配信停止管理
      csv/                    # FA-06 CSV管理
      api-monitor/            # FA-07 API・外部サービス監視
      analytics/              # FA-08 分析
      settings/               # FA-09 システム設定（7タブ）
      audit-logs/             # FA-10 監査ログ
    api/
      auth/
      companies/
      campaigns/
      csv/
      admin/                  # 管理者API（サービスロールキー必須）
      webhooks/
        sendgrid/             # 開封・クリック Webhook（F-07）
        stripe/               # Stripe Webhook（FB-01）
        line/
  components/
    ui/                       # 汎用UIコンポーネント（Button, Card, Table 等）
    forms/
    layouts/
    admin/                    # 管理者パネル専用コンポーネント
  lib/
    supabase/                 # Supabase クライアント（server/client 分離）
    sendgrid/                 # SendGrid 連携（F-06）
    openai/                   # GPT-4o-mini 連携（F-05）
    line/                     # LINE Messaging API（F-08）
    stripe/                   # Stripe 連携（FB-01）
    whois/                    # WhoisXML API（F-02A 新規HP判定）
    hunter/                   # hunter.io（F-03 担当者発掘）
    musubu/                   # musubu API（F-02 企業発掘・F-03A 電話番号）
  types/                      # TypeScript 型定義（全テーブル型はここに集約）
```

---

## MVP Phase 1 機能スコープ

### 顧客向け機能（F-01〜F-10）

| ID | 機能名 | 概要 |
|----|--------|------|
| F-01 | ICP設計（簡易版） | 固定5〜7問のフォーム、ICPプロファイルをDBに保存・手動修正可 |
| F-02 | 企業発掘 | musubu API（代替: Baseconnect）連携、ICP条件で抽出（上限1,000件/日）、重複排除 |
| F-02A | 新規HP判定 | WHOISでドメイン登録日6ヶ月以内を判定、`is_new_hp` フラグをDBに保存 |
| F-02B | CSV取込 | 既存リストCSV取込、カラムマッピングUI、重複検知・クレンジング |
| F-03 | 担当者発掘 | hunter.io APIでメールアドレス特定、取得不可時は代表メール（info@・contact@）を fallback、最大3候補をDBに保存 |
| F-03A | 電話番号取得 | musubu等DBから電話番号取得、企業リスト画面に表示、テレアポ用CSVエクスポート |
| F-04 | AIスコアリング（簡易版） | 業種・規模・地域でICPマッチ度を0〜100点でスコアリング（`scores`テーブルに分離） |
| F-05 | AIメール生成 | GPT-4o-miniでパーソナライズメール生成（件名・本文）、ハルシネーション防止プロンプト必須 |
| F-06 | SendGrid配信 | SPF/DKIM/DMARC対応、1日3,000通上限、`queue_emails`→`delivery_logs`で追跡 |
| F-06A | 配信停止管理 | 配信停止リンク自動付与、停止リクエスト自動処理、特定電子メール法遵守（MVP必須） |
| F-07 | 反応検知 | 開封検知（SendGrid Webhook）、返信検知（IMAP）、反応データをDBに保存 |
| F-08 | ホットリード通知 | 返信時にLINE通知（企業名・連絡先・返信本文） |
| F-09 | ダッシュボード | 今日の数値・リスト管理・配信履歴・基本フィルタ |
| F-10 | マルチテナント | 2階層権限（弊社管理者/顧客）＋代理店（agencies）、PostgreSQL RLS、Supabase Auth |

### 管理者パネル機能 — Control Tower（FA-01〜FA-10）

弊社管理者（Super Admin）専用の管理画面。`src/app/admin/` 以下に配置する。

| ID | 機能名 | 概要 |
|----|--------|------|
| FA-01 | 管理者ダッシュボード | テナント数・配信数・MRR・開封率・バウンス率・エラー数の集計表示、各種チャート |
| FA-02 | テナント管理（顧客一覧） | 全テナントの一覧・ステータス管理（active/suspended/inactive）・プラン表示・テナント追加/編集 |
| FA-03 | 代理店管理 | 代理店一覧・管理テナント数・月間収益・コミッション率・ポータルアクセス管理 |
| FA-04 | ユーザー管理 | 全テナント横断ユーザー一覧・ロール管理（テナント管理者/サポート/代理店スタッフ） |
| FA-05 | 配信監視 | キャンペーン監視（全テナント横断・ステータス・バウンス率・スパムリスク）・メールログ・配信停止管理 |
| FA-06 | CSV管理 | 全テナントのCSV取込状況監視・エラーCSVダウンロード・再試行 |
| FA-07 | API・外部サービス監視 | SendGrid/OpenAI/musubu/Hunter.io/WhoisXML/Supabase/LINE のレイテンシ・エラー率・使用量監視 |
| FA-08 | 分析 | SaaS全体KPI（テナント数推移・MRR・平均開封率）・プラン別テナント分布・トップテナントランキング |
| FA-09 | システム設定 | SMTP設定・SendGrid設定・OpenAI設定・キュー設定・セキュリティ設定・通知設定・フィーチャーフラグ |
| FA-10 | 監査ログ | 管理者操作の全履歴記録・重要度別フィルタ（critical/high/medium/low）・ログエクスポート |

### 請求・決済機能 — Stripe連携（FB-01〜FB-02）

| ID | 機能名 | 概要 |
|----|--------|------|
| FB-01 | Stripe課金連携 | `tenants.stripe_customer_id`・`stripe_subscription_id`・`subscription_status` を管理、Webhook受信 |
| FB-02 | 請求書管理 | `invoices`テーブルで請求履歴を保存、管理者パネルから参照可能 |

---

## MVP 画面構成

### 顧客向け画面（7画面）
1. ログイン画面
2. ICP設定画面
3. 企業リスト画面（電話番号も表示、新規HPフラグも表示）
4. 配信履歴画面
5. ダッシュボード
6. CSV取込画面
7. 配信停止リスト管理画面

### 管理者パネル画面（12画面 — Control Tower）
1. 管理者ダッシュボード
2. テナント管理（顧客一覧）
3. 代理店管理
4. ユーザー管理
5. キャンペーン監視
6. メールログ
7. 配信停止管理（グローバル）
8. CSV取込管理
9. API・外部サービス監視
10. 分析
11. システム設定（SMTP/SendGrid/OpenAI/キュー/セキュリティ/通知/フィーチャーフラグ）
12. 監査ログ

---

## データモデル（MVP テーブル）

SQLスキーマは `docs/schema.sql` を正本とする。以下は概要。

| テーブル名 | 内容 |
|-----------|------|
| `tenants` | 企業名・プラン・`stripe_customer_id`・`stripe_subscription_id`・`subscription_status` |
| `users` | メール・`auth_user_id`（`auth.users.id` 外部キー）・ロール・テナントID |
| `agencies` | 代理店名・作成日 |
| `agency_tenants` | 代理店とテナントの紐付け（role: owner等） |
| `icp_profiles` | 業種コード・規模レンジ・地域コード・予算・ターゲット役職・検索パラメータ |
| `companies` | 企業名・ドメイン・業種・従業員数・所在地・法人番号・`ai_delivery_flag`・テナントID |
| `phone_numbers` | 企業ID・電話番号・正規化番号・取得元・有効性フラグ |
| `contacts` | 氏名・メール・役職・`confidence`・`is_verified`・`is_deliverable`・配信停止情報（`unsubscribed_at`・`unsubscribe_token`） |
| `new_hp_flags` | 企業ID・ドメイン・WHOIS登録日・`is_new_hp`・`confidence`・判定手法 |
| `scores` | 企業ID・`icp_match_score`・`new_hp_bonus`・`total_score`・計算日時 |
| `generated_emails` | 件名・本文・`generation_prompt`・使用モデル・トークン数・メタデータ |
| `generated_email_recipients` | 生成メールID・企業ID・連絡先ID・宛先メール・ステータス |
| `queue_emails` | 配信キュー・`scheduled_at`・`retry_count`・`last_error`・ステータス |
| `delivery_logs` | 配信記録・`provider_message_id`・`delivered_at`・レスポンス |
| `failed_logs` | 失敗記録・エラーコード・エラーメッセージ・`retryable`フラグ |
| `reactions` | 開封・返信・タイムスタンプ・`in_reply_to`・メールID |
| `csv_imports` | ファイル名・`total_rows`・`success_rows`・`failed_rows`・`duplicate_rows`・ステータス |
| `invoices` | `stripe_invoice_id`・金額・通貨・ステータス・`billing_reason`・支払日時 |

**全テーブルに RLS ポリシーを設定すること。`tenant_id` によるフィルタリングを必ず実装する。**
**管理者専用テーブル（`agencies`・`invoices`等）はサービスロールキーでのみアクセスする。**

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

# Stripe（FB-01 請求・決済）
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

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
| Stripe | 課金・サブスクリプション管理・Webhook | FB-01, FB-02 |
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
