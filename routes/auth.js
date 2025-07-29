import { Router } from "express";
import {
  registerValidation,
  loginValidation,
  taskValidation,
} from "../validation.js";
import { User } from "../models/user-model.js";
import jwt from "jsonwebtoken";

const router = Router();

router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連接auth route");
});

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  const { email, username, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "該信箱已被註冊" });
    }

    const newUser = await new User({ email, username, password }).save();
    res.status(200).json({ success: true, message: "註冊成功", username });
  } catch (error) {
    console.error("❌ 註冊失敗原因：", error);
    res.status(500).json({ success: false, message: "無法儲存使用者" });
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: "無法找到使用者。請確認信箱是否正確",
      });
    }

    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const { _id, email } = foundUser;
      const tokenObject = { _id, email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);

      return res.status(200).json({
        success: true,
        message: "登入成功",
        token, // 傳回給前端的 JWT
        user: foundUser,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "密碼錯誤",
      });
    }
  } catch (error) {
    console.error("❌ 登入失敗原因：", error);
    res.status(500).json({ success: false, message: "無法登入使用者" });
  }
});

export const authRoute = router;
