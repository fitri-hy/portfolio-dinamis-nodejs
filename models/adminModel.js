/*
Username: admin
Password: admin 		(bcrypt: $2a$12$GIsTi7uPMiUds7QwHn8anuE1XSDSGesrLmKCoQLkmmJVYIeAYAM2y)
*/

const bcrypt = require('bcrypt');

class Admin {
  constructor() {
    this.users = [
      { username: 'admin', passwordHash: '$2a$12$GIsTi7uPMiUds7QwHn8anuE1XSDSGesrLmKCoQLkmmJVYIeAYAM2y' }
    ];
  }

  async isValid(username, password) {
    const user = this.users.find(user => user.username === username);
    if (!user) return false;

    return await bcrypt.compare(password, user.passwordHash);
  }
}

module.exports = Admin;
