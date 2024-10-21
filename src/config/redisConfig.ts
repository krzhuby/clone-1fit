import dotenv from "dotenv";
dotenv.config();
import { createClient } from "redis";
let redisClient = createClient();

redisClient.on("error", () => {
  console.log("err");
});

redisClient
  .connect()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

export { redisClient };
