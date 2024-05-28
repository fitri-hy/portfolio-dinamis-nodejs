<img src="./Screenshot.png">

# Portfolio Dinamis NodeJS
Dynamic Website Portfolio Using NodesJS MVC (Models-Views-Controller). Doesn't use a database connection but instead uses local JSON as the database

## Install
```
git clone https://github.com/fitri-hy/portfolio-dinamis-nodejs.git
cd portfolio-dinamis-nodejs
npm Install
npm start
```

## Admin Dashboard
```
http://localhost:3000/login

Username: admin
Password: admin
```

Changing or adding login data:

`models/adminModel.js`

```
this.users = [
	{ username: 'admin', passwordHash: '$2a$12$GIsTi7uPMiUds7QwHn8anuE1XSDSGesrLmKCoQLkmmJVYIeAYAM2y' }
];
```

## Technology

- Node JS.
- Tailwind.
- EJS.
- Other supporting modules.