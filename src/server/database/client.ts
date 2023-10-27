import {singleton} from "tsyringe";
import { Sequelize } from "sequelize";

const local_db = true;

interface DatabaseConfig {
	serviceName: string;
	username: string;
	password: string;
	host: string;
	port: number;
}

const localDatabaseConfig: DatabaseConfig = {
	serviceName: "FREE",
	username: "C##SALARY",
	password: "salary",
	host: "localhost",
	port: 1521
}

const remoteDatabaseConfig: DatabaseConfig = {
	serviceName: "testplm",
	username: "SALARY",
	password: "salary",
	host: "10.4.3.224",
	port: 1521
}

@singleton()
export class Database {
	constructor() {
		this.initDatabaseConnection();
	}

	database: Sequelize;

 	initDatabaseConnection() {
		let config = remoteDatabaseConfig;
		if (process.env.NODE_ENV == "development") {
			if (local_db) {
				config = localDatabaseConfig;
			}
		}

		const sequelize = new Sequelize(config.serviceName, config.username, config.password, {
			dialect: 'oracle',
			host: config.host,
			port: config.port
		});

		this.database = sequelize;
	}
}
