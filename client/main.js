const socket = io(); 
let messages; 
let isHistory = false; 
let isVisited = false; 

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("room").onsubmit = e => {
    e.preventDefault(); 
    const username = e.target.elements[0].value; 
    if (!e.target.elements[0].value)
    {
      alert("Введите имя пользователя");
      return;
    }
    e.target.elements[0].value = ""; 
    socket.emit("set username", username); 
    document.getElementById("username").innerHTML = username; 
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
      alert("Сначала зарегистрируйтесь");
      return;
    }
    socket.emit("message", e.target.elements[0].value); 
    e.target.elements[0].value = ""; 
  };
  document.getElementById("toHistory").onclick = async () => {
    if (!isHistory && isVisited) {  
      await fetch("/db") 
        .then(response => {
          if (response.ok) {
            return response.json(); 
          }
        })
        .then(data => {
          const box = document.getElementById("messages"); 
          messages = box.innerText;
          isHistory = true; 
          box.innerText = ""; 
          data.forEach(elem => {
            box.innerText += `[${elem.username}]: ${elem.message}`; 
          });
        });
    } else {
      alert("Сначала зарегистрируйтесь");
      return;
    }
  };
  document.getElementById("toChat").onclick = () => { 
    if (isHistory) { 
      document.getElementById("messages").innerText = messages; 
      isHistory = false; 
    }
  };
});

socket.on("system new", name => {
  document.getElementById("messages").innerText += `\t\t\ ${name} присоединился! \n`; //вывод сообщения о новом юзере
});

socket.on("render message", data => {
  if(data.message=="кот"){
    alert("кот");
  }
  document.getElementById("messages").innerText += `[${data.username}]: ${data.message} \n`; //выводим*/
});

