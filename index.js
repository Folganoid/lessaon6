require('dotenv').config();
const mysql = require('mysql');
const util = require('util');
const Car = require('./car');
const User = require('./user');

global.db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

global.db.query = util.promisify(global.db.query);

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


let user = new User;

//show all users
user.loadAll(function(err,data){
    if (err) console.log("ERROR : ",err);
    else console.log("result from db is : ",data);
});

//show one user with cars
user.setValue('id', 2);
user.load(function(err,data){
   if (err) console.log("ERROR : ",err);
   else console.log("result from db is : ",data);
});

user.resetValues();

// create new user
user.setValue('first_name', "John");
user.setValue('last_name', 'Doe');
user.setValue('age', 37);
user.setValue('gender', "M");
user.save(function(err,data){
    if (err) console.log("ERROR : ",err);
    else console.log("result from db is : ",data);
});

user.resetValues();

// change name
user.setValue('id', 3);
user.setValue('first_name', "Bill");
user.save(function(err,data){
    if (err) console.log("ERROR : ",err);
    else console.log("result from db is : ",data);
});

user.resetValues();

// delete user
user.setValue('id', 3);
user.delete(function(err,data){
    if (err) console.log("ERROR : ",err);
    else console.log("result from db is : ",data);
});

// create new car
let car = new Car;
car.setValue('user_id', 2);
car.setValue('year', '1963');
car.setValue('model', 'ZIL');
car.save(function(err,data){
    if (err) console.log("ERROR : ",err);
    else console.log("result from db is : ",data);
});

// + Открыть с БД и вывести в консоль сузествующего пользователя с машинами

// + Создать нового пользователя

// + Изменить имя пользователю

// + Удалить пользователя

// + Добавить пользователю новую машину
