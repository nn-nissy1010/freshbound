import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('正しいメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

export const signupSchema = z.object({
  companyName: z
    .string()
    .min(1, '会社名を入力してください')
    .max(255, '会社名は255文字以内で入力してください'),
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('正しいメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で設定してください')
    .max(72, 'パスワードは72文字以内で設定してください'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
