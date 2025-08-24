import { Router } from "express";
import { Task } from "../models/task-model.js";
import { taskValidation } from "../validation.js";

const router = Router();

router.use((req, res, next) => {
  console.log("task 正在接受一個request");
  next();
});

//查詢使用者的任務
router.get("/:_user_id", async (req, res) => {
  const { _user_id } = req.params;

  try {
    const taskFound = await Task.find({ user: _user_id }).exec();

    if (taskFound.length === 0) {
      return res.status(404).json({
        message: "找不到該事項",
      });
    }

    return res.json({
      taskFound,
      message: "查詢成功",
    });
  } catch (err) {
    return res.status(500).json({
      message: 伺服器錯誤,
    });
  }
});
//get userTask
router.get("/", async (req, res) => {
  try {
    const taskFound = await Task.find({ user: req.user._id }).exec();

    if (taskFound.length === 0) {
      return res.status(404).json({ message: "找不到該事項" });
    }

    res.json({ taskFound, message: "抓取成功" });
  } catch (error) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

//查詢任務_id
// router.get("/:_id", async (req, res) => {
//   const { _id } = req.params;

//   try {
//     const taskFound = await Task.findOne({ _id }).exec();

//     if (taskFound.length === 0) {
//       return res.status(404).json({
//         message: "找不到該事項",
//       });
//     }

//     return res.json({
//       taskFound,
//       message: "查詢成功",
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: "伺服器錯誤",
//     });
//   }
// });

//create
router.post("/create", async (req, res) => {
  try {
    const { title, description, status, dueDate } = taskValidation.parse(
      req.body
    );

    const newTask = await new Task({
      title,
      description,
      status,
      user: req.user._id,
      dueDate,
    }).save();
    return res.json({
      message: "新的事項已保存",
      newTask,
    });
  } catch (err) {
    if (err?.errors) {
      return res.status(400).json({
        message: err.errors[0]?.message,
      });
    }

    console.error(" 建立任務時發生錯誤：", err);
    return res.json({
      message: "伺服器錯誤",
    });
  }
});

//update
// router.patch("/:_id", async (req, res) => {
//   try {
//     const { title, description, status, dueDate } = taskValidation.parse(
//       req.body
//     );

//     const { _id } = req.params;

//     const taskFound = await Task.findOne({ _id });
//     if (!taskFound) {
//       return res.status(400).send("找不到課程。無法更新課程內容。");
//     }

//     const updatedTask = await Task.findOneAndUpdate({ _id }, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     return res.send({
//       message: "課程已經被更新成功",
//       updatedTask,
//     });
//   } catch (err) {
//     if (err instanceof ZodError) {
//       return res.status(400).json({
//         success: false,
//         message: err.errors[0]?.message,
//       });
//     }

//     console.error("❌ 更新任務時發生錯誤：", err);
//     return res.status(500).json({
//       success: false,
//       message: "伺服器錯誤",
//     });
//   }
// });

//delete
router.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const taskFound = await Task.findOne({ _id });
    if (!taskFound) {
      return res.status(400).send("找不到任務，無法刪除。");
    }

    await Task.deleteOne({ _id }).exec();
    return res.send({
      message: "任務已被刪除",
    });
  } catch (err) {
    console.error("刪除任務時發生錯誤：", err);
    return res.status(500).json({
      message: "伺服器錯誤",
    });
  }
});

export const taskRoute = router;
