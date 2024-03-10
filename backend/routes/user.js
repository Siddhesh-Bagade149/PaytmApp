const express = require("express");
const zod = require("zod");
const { userModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("working for /api/v1/user");
});

const signupSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  try {
    
    const { success } = signupSchema.safeParse(body);
    if (!success) {
      return res.json({
        message: "Incorrect inputs",
      });
    }

    const existingUser = await userModel.findOne({
      username: body.username,
    });

    if (existingUser) {
      return res.json({
        msg: "user already exists",
      });
    }

    let newUser = await userModel.create(body);
    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      JWT_SECRET
    );
    res.json({
      msg: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const signinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const body = req.body;
  const { success } = signinSchema.safeParse(body);
  if (!success) {
    return res.status(401).json({
      message: "Error while logging in invalid credentials",
    });
  }
  const existingUser = await userModel.findOne({
    username: body.username,
    password: body.password,
  });

  if (existingUser) {
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
    return;
  }

  res.status(411).json({
    msg: "error while logging in",
  });
});

module.exports = router;
