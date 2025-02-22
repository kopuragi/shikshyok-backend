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
const { connect } = require("http2");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(serverPerfix, indexRouter);

const connectedClients = {};

console.log("Connected clients:", JSON.stringify(connectedClients, null, 2));
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
  const addClient = (data) => {
    console.log("data=", data);

    if (!connectedClients[data.loginId]) {
      connectedClients[data.loginId] = [];
    }

    connectedClients[data.loginId].push(socket.id);
    console.log("클라이언트 해시 맵 == ", connectedClients);
  };

  socket.on("connectCustomer", (data) => {
    console.log("Customer connected");
    console.log("고객 커넥트 아이디", data);
    addClient(data);
  });

  socket.on("connectOwner", (data) => {
    console.log("Owner connected");
    console.log("점주 커넥트 아이디=", data);
    addClient(data);
  });

  socket.on("order", (data) => {
    console.log("주문이 들어왔습니다.");
    console.log("요기서 확인=", data);
    const ownerId = data[0].shopLoginId;
    console.log("onwerId = ", ownerId);
    if (connectedClients[ownerId]) {
      connectedClients[ownerId].forEach((clientId) => {
        io.to(clientId).emit("order", data);
      });
    } else {
      console.log(`No connected clients for ownerId: ${ownerId}`);
    }
  });
  socket.on("disconnect", () => {
    console.log("클라이언트 접속 해제", socket.id);

    // 해시 맵에서 해당 클라이언트를 제거
    for (const loginId in connectedClients) {
      const socketIndex = connectedClients[loginId].indexOf(socket.id);
      if (socketIndex !== -1) {
        connectedClients[loginId].splice(socketIndex, 1);

        if (connectedClients[loginId].length === 0) {
          delete connectedClients[loginId];
        }

        console.log(`클라이언트 제거: socket.id = ${socket.id}`);
        console.log("제거결과확인 = ", connectedClients);
        break;
      }
    }
  });
});
