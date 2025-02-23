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

//고객 점주 모든 클라이언트 저장소
const connectedClients = {};

//고객의 주문 정보 저장소
const orderInfo = {};

//주문 승인 정보 저장소
const orderApproval = {};

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
    console.log("고객 커넥트 아이디", data.loginId);
    const customerId = data.loginId;

    const customerOrders = orderApproval[customerId] || [];
    console.log("고객의 모든 주문 정보 = ", customerOrders);
    socket.emit("customerOrderSync", customerOrders);
    addClient(data);
  });

  socket.on("connectOwner", (data) => {
    console.log("Owner connected");
    console.log("점주 커넥트 아이디=", data);
    const ownerId = data.loginId;

    const ownerOrders = orderInfo[ownerId] || [];
    console.log("점주의 모든 주문 정보 = ", ownerOrders);
    socket.emit("ownerOrderSync", ownerOrders);
    addClient(data);
  });

  socket.on("order", (data) => {
    console.log("주문이 들어왔습니다.");
    console.log("요기서 확인=", data);
    if (!orderInfo[data.loginId]) {
      orderInfo[data.loginId] = [];
    }
    orderInfo[data.loginId].push(data);
    console.log(
      "고객 주문 정보 해시 맵 = ",
      JSON.stringify(orderInfo[data.loginId], null, 2)
    );

    const ownerId = data.shopLoginId;
    console.log("onwerId = ", ownerId);
    if (connectedClients[ownerId]) {
      connectedClients[ownerId].forEach((clientId) => {
        io.to(clientId).emit("order", data);
      });
    } else {
      console.log(`No connected clients for ownerId: ${ownerId}`);
    }
  });

  socket.on("orderApproval", (data) => {
    console.log("주문이 승인되었습니다.");
    console.log("주문 승인 확인=", data);
    const customerId = data.loginId;
    console.log("customerId = ", customerId);
    if (!orderApproval[customerId]) {
      orderApproval[customerId] = [];
    }
    orderApproval[customerId].push(data);

    console.log(
      "주문 승인 정보 해시 맵 = ",
      JSON.stringify(orderApproval[customerId], null, 2)
    );

    if (connectedClients[customerId]) {
      connectedClients[customerId].forEach((clientId) => {
        io.to(clientId).emit("orderApproval", orderApproval[customerId]);
      });
    } else {
      console.log(`No connected clients for customerId: ${customerId}`);
    }
  });

  socket.on("orderCustomerSync", (data) => {
    console.log("주문 동기화 요청이 들어왔습니다 = ", data);
    const customerId = data.loginId;

    orderApproval[customerId] = data;

    console.log(
      "주문 승인 정보 해시 맵 = ",
      JSON.stringify(orderApproval[customerId], null, 2)
    );

    const customerOrders = orderApproval[customerId] || [];
    console.log("고객의 모든 주문 정보 = ", customerOrders);

    if (connectedClients[customerId]) {
      connectedClients[customerId].forEach((clientId) => {
        io.to(clientId).emit("orderSync", customerOrders);
      });
    } else {
      console.log(`No connected clients for customerId: ${customerId}`);
    }
  });

  socket.on("cookingStart", (data) => {
    console.log("요리가 시작되었습니다.");
    console.log("주문 정보 확인 = ", data);
    const ownerId = data.loginId;
    console.log("ownerId = ", ownerId);
    if (connectedClients[ownerId]) {
      connectedClients[ownerId].forEach((clientId) => {
        io.to(clientId).emit("cookingStart", data);
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
