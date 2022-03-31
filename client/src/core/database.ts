import { Connection, createConnection } from 'mysql';
import { config } from '../../config';

class Database {
  con: Connection;
  constructor() {
    console.log(`Connecting to database...`);
    console.log({
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
    });

    this.con = createConnection({
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
    });
    this.con.connect((err) => {
      if (err) {
        console.log('Error connecting to Db', err);
        return;
      }
      console.log('Connection established');
    });
  }

  fetchTable = async (table: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.con.query(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  };
}
export const databaseWrapper = new Database();
