import { Router } from "express";
import { registerValidation, loginValidation } from "../validation.js";
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
  try {
    // 驗證資料
    const { email, username, password } = registerValidation.parse(req.body);

    // 檢查 email 是否重複
    const exists = await User.findOne({ email }).lean();
    if (exists) return res.status(409).json({ message: "該信箱已被註冊" });

    // 儲存新使用者
    const newUser = await new User({ email, username, password }).save();
    res.status(200).json({ message: "註冊成功", username });
  } catch (err) {
    if (err?.errors) {
      return res.status(400).json({
        message: err.errors[0]?.message,
      });
    }

    console.error(" 註冊失敗原因：", err);
    res.status(500).json({ message: "無法儲存使用者" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginValidation.parse(req.body);

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({
        message: "無法找到使用者。請確認信箱是否正確",
      });
    }

    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.status(200).json({
        token, // 傳回給前端的 JWT
        user: {
          _id: foundUser._id,
        },
      });
    } else {
      return res.status(401).json({
        message: "密碼錯誤",
      });
    }
  } catch (err) {
    if (err?.errors) {
      return res.status(400).json({
        message: err.errors[0]?.message,
      });
    }

    console.error(" 登入失敗原因：", err);
    res.status(500).json({
      message: "無法登入使用者",
    });
  }
});

export const authRoute = router;
