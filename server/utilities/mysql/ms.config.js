import ck from 'ckey'

const mySQLConfig = {
  host: process.env.SQL_HOSTH,
  user: process.env.SQL_USERH,
  password: process.env.SQL_PASSWORDH,
  database: process.env.SQL_DATABASEH
  // port: ck.SQL_PORT
  };

  export default mySQLConfig