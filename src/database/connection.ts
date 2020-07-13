import knex from "knex";

const env = process.env.DB_ENV || "development";
const config = require("../../knexfile");

const connection = knex(config[env]);

export default connection;
