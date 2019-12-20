const sqlite3 = require('sqlite3').verbose(); //подключаем 

const DB_PATH = 'app.db' //название 

const DB = new sqlite3.Database(DB_PATH); //инициализация новой бд

DB.serialize(() => { //создаем таблицу
    DB.run("CREATE TABLE IF NOT EXISTS messages (key INT PRIMARY KEY UNIQUE,username TEXT, message TEXT)");
})

module.exports = DB; //экспортируем бд