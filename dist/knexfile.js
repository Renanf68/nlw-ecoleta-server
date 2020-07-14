"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: path_1.default.resolve(__dirname, "src", "database", "database.sqlite"),
        },
        pool: {
            afterCreate: function (conn, cb) {
                return conn.run("PRAGMA foreign_keys = ON", cb);
            },
        },
        migrations: {
            directory: path_1.default.resolve(__dirname, "src", "database", "migrations"),
        },
        seeds: {
            directory: path_1.default.resolve(__dirname, "src", "database", "seeds"),
        },
        useNullAsDefault: true,
    },
    production: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: "./database/migrations",
        },
        seeds: {
            directory: "./database/seeds",
        },
    },
};
