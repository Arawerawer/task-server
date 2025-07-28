import { Router } from "express";
import {
  registerValidation,
  loginValidation,
  taskValidation,
} from "../validation.js";
import { User } from "../models/user-model.js";

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

export const authRoute = router;
