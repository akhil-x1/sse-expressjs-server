import express from "express";
import cors from "cors";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

const userConnections = new Map();

app.get("/api/events", (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(401).send("Unauthorized!");
  }
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  userConnections.set(userId, res);
  console.log(`User id ${userId} connected to SSE`);
  res.write(
    `data: ${JSON.stringify({ message: "Connected succesfully!\n\n" })} `,
  );

  req.on("close", () => {
    userConnections.delete(userId);
    console.log(`User ${userId} disconnected!`);
  });
});

app.post("/api/notify-user", (req, res) => {
  const { targetUserId, message } = req.body();

  const userStream = userConnections.get(targetUserId);
  if (!userStream) {
    return res
      .status(404)
      .json({ error: "User is offline or not connected to SSE" });
  }

  const payload = {
    event: "Notification",
    data: message,
    timestamp: new Date().toISOString(),
  };

  userStream.write("Event: notification\n");
  userStream.write(`Data : ${JSON.stringify(payload)}\n`);

  res.json({ status: "success", sentTo: targetUserId });
});

app.get("/hello", (req, res) => {
  return res.status(200).send({ status: "success", message: "Hello world!" });
});

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
