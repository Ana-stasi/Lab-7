const socket = io(); //подключение
let messages; //сообщения
let isHistory = false; //проверка в истории ли
let isVisited = false; //проверка регистрации

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("room").onsubmit = e => {
    e.preventDefault(); //запрещаем перезагрузку
    const username = e.target.elements[0].value; 
    if (!e.target.elements[0].value)
    {
      alert("Введите имя пользователя");
      return;
    }
    e.target.elements[0].value = ""; 
    socket.emit("set username", username); //имя юзера на сервер
    document.getElementById("username").innerHTML = username; //имя юзера в поле
    isVisited = true;
  };

  document.getElementById("messageForm").onsubmit = e => {
    e.preventDefault(); 
    if (!e.target.elements[0].value)
    {
      alert("Не оставляйте поле сообщения пустым");
      return;
    }
    if (!isVisited) {
      //если не зарегались
      alert("Сначала зарегистрируйтесь");
      return;
    }
    socket.emit("message", e.target.elements[0].value); //отправляем на сервер сообщение
    e.target.elements[0].value = ""; 
  };
  document.getElementById("toHistory").onclick = async () => {
    if (!isHistory && isVisited) {  //если зарегестрированы и нажата кнопка истории
      await fetch("/db") //запрос в бд
        .then(response => {
          if (response.ok) {
            return response.json(); //обьект с данными с бд
          }
        })
        .then(data => {
          const box = document.getElementById("messages"); 
          messages = box.innerText; //сохранение сообщения
          isHistory = true; 
          box.innerText = ""; 
          data.forEach(elem => {
            box.innerText += `[${elem.username}]: ${elem.message}`; //выводим сообщения
          });
        });
    } else {
      alert("Сначала зарегистрируйтесь");
      return;
    }
  };
  document.getElementById("toChat").onclick = () => { 
    if (isHistory) { //если мы в истории
      document.getElementById("messages").innerText = messages; //выводим сохраненные сообщения
      isHistory = false; 
    }
  };
});

socket.on("system new", name => {
  document.getElementById("messages").innerText += `\t\t\ ${name} присоединился! \n`; //вывод сообщения о новом юзере
});

socket.on("render message", data => {
  document.getElementById(    //слушаем сообщение от клиента
    "messages"
  ).innerText += `[${data.username}]: ${data.message} \n`; //выводим
});
