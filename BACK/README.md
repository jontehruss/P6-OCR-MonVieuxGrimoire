# initialiser le backend 
npm init

# installer nodemon pour faciliter le refresh du server.js
npm install -g nodemon

# installer express & middleware
npm install express --save

# installer mongoDB
## fait avec MongoDB for Windows
## Compass CLI
### admin db
* user : admin
* password : p@ssw0rd!
### mvgdb
* user : mvgdbuser
* password : p@ssw0rd!



net start MongoDB
net stop MongoDB

mongosh

use admin

db.createUser({
  user: "mvguser",
  pwd: "p@ssw0rd!",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
});

mongosh --host localhost --port 27017 -u "admin" -p "p@ssw0rd!" --authenticationDatabase "admin"


mongodb://admin:p@ssw0rd!@localhost:27017/mvgdb?authSource=admin


# installer mongoose pour accéder depuis le backend à la DB
<!-- Mongoose facilite les interactions entre Express et MongoDB -->
npm install mongoose
