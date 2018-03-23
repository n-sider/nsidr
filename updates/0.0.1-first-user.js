exports.create = {
  User: [
    {
      name: 'Default User',
      email: 'admin@nsidr.com',
      password: process.env.FIRST_USER_PASSWORD,
      isAdmin: true
    }
  ]
};
