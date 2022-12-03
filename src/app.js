const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./user.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.err(err.message);
    console.log("connection successful");
  });
//db.run(`CREATE TABLE userData(ID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL);`)

db.run(`INSERT INTO userData(ID,username,password) VALUES(2,"kalyan","online")`)

