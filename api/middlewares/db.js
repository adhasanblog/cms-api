const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'apicms_dev',
  'supercmsapi',
  '!A23j4nj1<3UCMS',
  {
    host: 'localhost',
    dialect:
      'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
  },
);

try {
  sequelize.authenticate();
  sequelize.sync({ alter: true });
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

module.exports = sequelize;
