import { singleton } from "tsyringe";
import { Sequelize } from "sequelize";
import { env } from "~/env.mjs";
import {initOracleClient} from "oracledb"


const local_db = env.USE_LOCAL_DB;

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
	port: 1521,
};

const remoteDatabaseConfig: DatabaseConfig = {
	serviceName: "testplm",
	username: "SALARY",
	password: "salary",
	host: "10.4.3.224",
	port: 1521,
};


const ehrDatabaseConfig: DatabaseConfig = {
	serviceName: "flow_utf8",
	username: "SALARY",
	password: "salary",
	host: "10.4.3.11",
	port: 1521,
};


@singleton()
export class Database {
	constructor() {
		initOracleClient(env.ORACLE_LIB_PATH ? {libDir: env.ORACLE_LIB_PATH} : {});
		this.connection = this.initDatabaseConnection(remoteDatabaseConfig);
		this.ehr_connection = this.initDatabaseConnection(ehrDatabaseConfig);
	}

	connection: Sequelize;
	ehr_connection: Sequelize;

	initDatabaseConnection(config: DatabaseConfig) {
		if (process.env.NODE_ENV == "development") {
			if (local_db) {
				console.log("use local database");
				config = localDatabaseConfig;
			}
		}

		const sequelize = new Sequelize(
			config.serviceName,
			config.username,
			config.password,
			{
				dialect: "oracle",
				host: config.host,
				port: config.port,
				logging: false,
			}
		);

    	return sequelize
	}
}
