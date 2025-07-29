import Joi from "joi";

const commonMessages = {
  "string.base": "{#label}必須是文字",
  "string.empty": "{#label}不能為空",
  "string.min": "{#label}太短了",
  "string.max": "{#label}太長了",
  "string.email": "{#label}格式不正確",
  "any.required": "{#label}是必填欄位",
};

// 註冊驗證
export const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required().label("使用者名稱"),
    email: Joi.string().min(6).max(50).required().email().label("信箱"),
    password: Joi.string().min(6).max(255).required().label("密碼"),
  });

  return schema.validate(data, {
    messages: commonMessages,
    errors: { wrap: { label: "" } }, // ← 取消自動加引號
  });
};

// 登入驗證
export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email().label("信箱"),
    password: Joi.string().min(6).max(255).required().label("密碼"),
  });

  return schema.validate(data, {
    messages: commonMessages,
    errors: { wrap: { label: "" } },
  });
};

// 任務驗證
export const taskValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().max(100).trim().required().messages({
      "string.empty": "任務標題不能為空",
      "string.max": "任務標題不能超過 100 字",
      "any.required": "任務標題是必填欄位",
    }),
    description: Joi.string().trim().required().messages({
      "string.empty": "任務描述不能為空",
      "any.required": "任務描述是必填欄位",
    }),
    status: Joi.string()
      .valid("todo", "inProgress", "completed")
      .required()
      .messages({
        "any.only": "任務狀態必須是 todo、inProgress 或 completed",
        "any.required": "任務狀態是必填欄位",
      }),
    priority: Joi.string().valid("low", "normal", "high").required().messages({
      "any.only": "優先順序必須是 low、normal 或 high",
      "any.required": "優先順序是必填欄位",
    }),
    dueDate: Joi.date().iso().required().messages({
      "date.base": "截止日期格式錯誤",
      "date.format": "截止日期必須是 ISO 格式",
      "any.required": "截止日期是必填欄位",
    }),
  });

  return schema.validate(data);
};
