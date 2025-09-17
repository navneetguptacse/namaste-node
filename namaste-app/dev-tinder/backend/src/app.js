const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
// const { authUser } = require("./middleware/user");

const app = express();

app.use(express.json());

// app.use('/user', (req, res, next) => {
//   // const {name} = req.query;
//   // if(!name) throw new Error('Name is required') // If any error -> global error handler will handle it.
//   // res.send(`Welcome ${name}!`);

//   try {
//     const {name} = req.query;
//     if(!name) throw new Error('Name is required') // If any error
//     res.send(`Welcome ${name}!`);
//   } catch (err) {
//     console.log({error: err.message});
//     // res.status(500).send({error: err.message})
//     // Or, send it to global error handler
//     next(err);
//   }
// })

// Global error handler - Always at the very end of all app.use and route definitions.
// app.use((err, req, res, next) => {
//   console.error({ error: err.message });
//   res.status(500).send({ error: err.message });
// });

app.get("/user", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(400).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find();
    if (user.length === 0) {
      res.status(400).send("Not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.patch("/update", async (req, res) => {
  const id = req.body.id;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: id }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    console.log(user);
    res.status(200).send("User Updated Successfully.");
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

connectDB()
  .then(() => {
    console.log("✓ Database connection success.");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("✗ Database connection failed!!");
  });

// app.listen(3000, () => {
//   console.log("✓ Server is running on port 3000");
// });

/**
 * Key rule to remember:
 * Normal middleware/routes → top.
 * Error handling middleware → bottom.
 */