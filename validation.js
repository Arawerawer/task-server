import { z } from "zod";

// 註冊 schema
export const registerSchema = z.object({
  username: z
    .string({ required_error: "使用者名稱是必填的" })
    .min(3, { message: "使用者名稱太短了" })
    .max(50, { message: "使用者名稱太長了" }),
  email: z
    .string({ required_error: "信箱是必填的" })
    .min(6, { message: "信箱太短了" })
    .max(50, { message: "信箱太長了" })
    .email({ message: "信箱格式不正確" }),
  password: z
    .string({ required_error: "密碼是必填的" })
    .min(6, { message: "密碼太短了" })
    .max(255, { message: "密碼太長了" }),
});

//登入 schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(6, { message: "信箱太短了" })
    .max(50, { message: "信箱太長了" })
    .email({ message: "信箱格式不正確" }),
  password: z
    .string()
    .min(6, { message: "密碼太短了" })
    .max(255, { message: "密碼太長了" }),
});

// 任務驗證
