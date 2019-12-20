
const socket = io(); 
let messages; 
let isHistory = false; 
let isVisited = false; 

let test;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("room").onsubmit = e => {
    e.preventDefault(); 
    const username = e.target.elements[0].value; 
    if (!e.target.elements[0].value)
    {
      alert("Введите имя");
      return;
    }
    e.target.elements[0].value = ""; 
    socket.emit("set username", username); 
    document.getElementById("username").innerHTML = username; 
    test = username;
    isVisited = true;
  };

  document.getElementById("messageForm").onsubmit = e => {
    e.preventDefault(); 
    if (!e.target.elements[0].value)
    {
      alert("Пустые поля");
      return;
    }    
    if (!isVisited) {
      alert("Сначала создайте аккаунт");
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
            return response.json(); //оbject with db data
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
      alert("Сначала создайте аккаунт");
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
  document.getElementById("messages").innerText += `\t\t\ ${name} присоединился! \n`; 
});

socket.on("render message", data => {
  if(e.target.elements[0].value == "кот"){
    alert("кот");
  }
  document.getElementById("messages").innerText += `[${data.username}]: ${data.message} \n`; 
});
