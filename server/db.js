// const Pool = require("pg").Pool;

// const pool = new Pool({
//   user: "postgres",
//   password: "bhutan",
//   host: "localhost",
//   port: 5432,
//   database: "sanamtshongpoen",
// });

// module.exports = pool;

const Pool = require("pg").Pool;
require("dotenv").config();

const devConfig = {
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "sanamtshongpoen",
};

const proConfig = {
  connectionString:
    // "postgres://stdb_user:hIKrTzFkjzZlC3kWa2wv0Z2eW13jXEOq@dpg-ci2oh3bhp8u1a1bdpog0-a.oregon-postgres.render.com/stdb?ssl=true",
    "postgres://hh_dbb_user:WYRWPv1aG4EABbBtKHRCRPfQU5gSXdJ6@dpg-ckaev2kg66mc73d0duo0-a/hh_dbb?ssl=true",
};

// const pool = new Pool(
//   process.env.NODE_ENV === "production" ? proConfig : devConfig
// );
const pool = new Pool(devConfig);

module.exports = pool;
