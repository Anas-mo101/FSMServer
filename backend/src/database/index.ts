import { Sequelize } from "sequelize-typescript";
import User from "../models/User";
import AutomationFlow from "../models/Flow";
import UserFlow from "../models/UserFlow";

// eslint-disable-next-line
const dbConfig = require("../config/database");

const sequelize = new Sequelize(dbConfig);

const models = [
  User,
  UserFlow,
  AutomationFlow,
];

sequelize.addModels(models);

export default sequelize;
