"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var knex_1 = __importDefault(require("knex"));
var env = process.env.DB_ENV || "development";
var config = require("../../knexfile");
var connection = knex_1.default(config[env]);
exports.default = connection;
