/**
 *
 *
 *
 *
 *
 *
 * 고민봉 소켓 테스트용 복사본
 */
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 8082;
const { sequelize } = require("./models");
const indexRouter = require("./routes");
const serverPerfix = "/api-server";
const cors = require("cors");
const { or } = require("sequelize");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(serverPerfix, indexRouter);

const connectedClients = [
  {
    orderNumber: "",
    userId: "",
    socketId: "",
    data: {},
  },
];
sequelize
  .sync({ force: false, alter: false })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("database sync 오류!");
  });

io.on("connection", (socket) => {
  console.log("클라이언트 접속", socket.id);

  socket.on("order", (loginId, socketId, data, orderNumber) => {
    console.log(
      `order 이벤트 수신 = loginId=${loginId}, socketId=${socketId} `
    );
    console.log("orderNumber=", orderNumber);
    const newClient = {
      orderNumber: orderNumber,
      userId: loginId,
      socketId: socketId,
      data: data,
    };
    connectedClients.push(newClient);

    console.log(
      "Connected clients:",
      JSON.stringify(connectedClients, null, 2)
    );
    console.log("실시간 주문목록 배열 길이 =", connectedClients.length);
  });

  socket.on("disconnect", () => {
    console.log("클라이언트 접속 해제", socket.id);
  });
});
