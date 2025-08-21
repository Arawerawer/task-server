import { z } from "zod";

// 註冊 schema
export const registerValidation = z.object({
  username: z
    .string({ required_error: "使用者名稱是必填的" })
    .trim()
    .nonempty({ message: "使用者名稱是必填的" })
    .min(3, { message: "使用者名稱太短了" })
    .max(50, { message: "使用者名稱太長了" }),
  email: z
    .string({ required_error: "信箱是必填的" })
    .trim()
    .nonempty({ message: "信箱是必填的" })
    .min(6, { message: "信箱太短了" })
    .max(50, { message: "信箱太長了" })
    .email({ message: "信箱格式不正確" }),
  password: z
    .string({ required_error: "密碼是必填的" })
    .trim()
    .nonempty({ message: "密碼是必填的" })
    .min(6, { message: "密碼太短了" })
    .max(50, { message: "密碼太長了" }),
});

//登入 schema
export const loginValidation = z.object({
  email: z
    .string({ required_error: "信箱是必填的" })
    .trim()
    .nonempty({ message: "信箱是必填的" })
    .min(6, { message: "信箱太短了" })
    .max(50, { message: "信箱太長了" })
    .email({ message: "信箱格式不正確" }),
  password: z
    .string({ required_error: "密碼是必填的" })
    .trim()
    .nonempty({ message: "密碼是必填的" })
    .min(6, { message: "密碼太短了" })
    .max(50, { message: "密碼太長了" }),
});

// 任務驗證
export const taskValidation = z.object({
  title: z
    .string({ required_error: "標題是必填欄位" })
    .trim()
    .nonempty({ message: "標題是必填的" })
    .max(100, { message: "標題不能超過 100 字" }),

  description: z
    .string({ required_error: "描述是必填欄位" })
    .trim()
    .nonempty({ message: "描述是必填的" })
    .max(1000, { message: "描述不能超過 100 字" }),

  status: z
    .string({ required_error: "狀態是必填欄位" })
    .trim()
    .nonempty({ message: "狀態是必填的" })
    .refine((val) => ["todo", "inProgress"].includes(val), {
      message: "狀態必須是 代辦、進行中 ",
    }),

  dueDate: z
    .string({ required_error: "截止日期是必填欄位" })
    .min(1, "截止日期不能是空字串"),
});
