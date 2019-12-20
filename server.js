const express = require("express");
const http = require("http");

const app = express();
const server = http.Server(app);
const port = process.env.PORT || 3000;
const io = require("socket.io")(server); //подключили сокет іо к серверу
const db = require("./db.js");
app.get("/", (req, res) => {
  //получаем запрос на index.html
  res.sendFile(__dirname + "/client/index.html"); //присылаем на клиента
});

app.get("/db", (req, res) => { //запрос на бд
  db.all("SELECT * FROM messages", (err, rows) => { //запрос на получение всех столбцов с таблички messages
    res.send(rows); //отправляем на клиент бд
  });
});

app.use(express.static("./client")); //подгрузка всех файлов папки клиента

io.on("connection", socket => {
  //когда кто-то подключился к серверу
  socket.on("set username", username => {
    //реагируем на то, что было установлено имя
    socket.username = username; //устанавливаем имя этому сокету
    socket.broadcast.emit("system new", socket.username); //отправляем на клиент нового юзера
  });
  socket.on("message", message => {
    //сервер слушает, пока напишут текст сообщения
    const data = {
      //создаем обьект и записываем в него данные
      username: socket.username,
      message
    };
    db.run( //заполняем бд сообщением юзера
      `INSERT INTO messages VALUES (NULL, '${socket.username}', '${message} \n')`
    );
    io.emit("render message", data); //уведомление о новом сообщении
  });
});

server.listen(port, () => {
  console.log("listening on *:" + port);
});
