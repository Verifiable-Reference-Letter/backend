import { Client } from "pg";
import { User } from "./users/User.dbmodel";

export abstract class DatabaseService<DatabaseModel> {
  protected client: Client;
  protected clientCredentials = {};
  private dbModels: DatabaseModel[] = [];

  constructor() {
    // Temporary for testing until we implement running in development and production modes
    this.clientCredentials = {
      connectionString:
        process.env.DATABASE_URL ||
        "postgres://plrnqvkoieossi:6e67d9a93ad03361124f172fa865b56e16966f7edd112dc0d4be24e303399d00@ec2-52-86-73-86.compute-1.amazonaws.com:5432/d4ur44i35a17si",
      ssl: true,
    };
  }

  async selectAll(): Promise<DatabaseModel[]> {
    this.dbModels = [];
    const client = new Client(this.clientCredentials);
    client.connect();
    try {
      const res = await client.query(this.selectAllQuery);
      let jsonRow;
      for (const row of res.rows) {
        jsonRow = JSON.stringify(row);
        console.log("got to json row");
        console.log(jsonRow);
        this.dbModels.push(this.dbRowToDbModel(row));
      }
      this.dbModels.filter((value: any) => Object.keys(value).length !== 0);
      this.dbModels.map((value, index) => {
        console.log("Db Model " + index + ": ");
        console.dir(value);
      });
      return this.dbModels;
    } catch (err) {
      console.log(err.stack);
    } finally {
      client.end().then(() => console.log("client has disconnected"));
    }
  }

  async selectOneRowByPrimaryId(id: string): Promise<DatabaseModel> | null {
    const values = [id];
    const client = new Client(this.clientCredentials);
    client.connect();
    try {
      const res = await client.query(this.selectOneRowByIdQuery, values);
      if (res.rows.length === 0) {
        return null;
      }
      let jsonRow;
      jsonRow = JSON.stringify(res.rows[0]);
      console.log(jsonRow);
      const dbModel: DatabaseModel = this.dbRowToDbModel(res.rows[0]);

      console.dir(dbModel);
      return dbModel;
    } catch (err) {
      console.log(err.stack);
    } finally {
      client.end().then(() => console.log("client has disconnected"));
    }
  }

  protected async runParameterizedQueryWithValuesArray(
    queryText: any,
    values: any[]
  ): Promise<DatabaseModel[]> {
    const dbModels: DatabaseModel[] = [];
    const client = new Client(this.clientCredentials);
    client.connect();
    try {
      const res = await client.query(queryText, values);
      let jsonRow;
      for (const row of res.rows) {
        jsonRow = JSON.stringify(row);
        console.log(jsonRow);
        dbModels.push(this.dbRowToDbModel(row));
      }
      dbModels.filter((value: any) => Object.keys(value).length !== 0);
      dbModels.map((value, index) => {
        console.log("Db Model " + index + ": ");
        console.dir(value);
      });
      return dbModels;
    } catch (err) {
      console.log(err.stack);
    } finally {
      client.end().then(() => console.log("client has disconnected"));
    }
  }

  protected async runParameterizedQueryWithValuesArrayCount(
    queryText: any,
    values: any[]
  ): Promise<Number> {
    const client = new Client(this.clientCredentials);
    client.connect();
    try {
      const res = await client.query(queryText, values);
      return res.rowCount;
    } catch (err) {
      console.log(err.stack);
    } finally {
      client.end().then(() => console.log("client has disconnected"));
    }
  }

  protected async runParameterizedQueryWithValuesArrayString(
    queryText: any,
    values: any[]
  ): Promise<string[]> {
    const client = new Client(this.clientCredentials);
    const models: string[] = [];
    client.connect();
    try {
      const res = await client.query(queryText, values);
      let jsonRow;
      for (const row of res.rows) {
        jsonRow = JSON.stringify(row);
        console.log(jsonRow);
        models.push(row[0]);
      }
      models.filter((value: any) => Object.keys(value).length !== 0);
      models.map((value, index) => {
        console.log("Db Model " + index + ": ");
        console.dir(value);
      });
      return models;
    } catch (err) {
      console.log(err.stack);
    } finally {
      client.end().then(() => console.log("client has disconnected"));
    }
  }

  protected async runParameterizedQueryWithValuesArrayNumber(
    queryText: any,
    values: any[]
  ): Promise<number[]> {
    const client = new Client(this.clientCredentials);
    const models: number[] = [];
    client.connect();
    try {
      const res = await client.query(queryText, values);
      let jsonRow;
      for (const row of res.rows) {
        jsonRow = JSON.stringify(row);
        console.log(jsonRow);
        models.push(row[0]);
      }
      models.filter((value: any) => Object.keys(value).length !== 0);
      models.map((value, index) => {
        console.log("Db Model " + index + ": ");
        console.dir(value);
      });
      return models;
    } catch (err) {
      console.log(err.stack);
    } finally {
      client.end().then(() => console.log("client has disconnected"));
    }
  }

  protected async runParameterizedQueryWithValuesArrayUser(
    queryText: any,
    values: any[]
  ): Promise<User[]> {
    const client = new Client(this.clientCredentials);
    const models: User[] = [];
    client.connect();
    try {
      const res = await client.query(queryText, values);
      let jsonRow;
      for (const row of res.rows) {
        jsonRow = JSON.stringify(row);
        console.log(jsonRow);
        models.push(User.dbRowToDbModel(row));
      }
      models.filter((value: any) => Object.keys(value).length !== 0);
      models.map((value, index) => {
        console.log("Db Model " + index + ": ");
        console.dir(value);
      });
      return models;
    } catch (err) {
      console.log(err.stack);
    } finally {
      client.end().then(() => console.log("client has disconnected"));
    }
  }

  protected async runParameterizedQueryWithValuesArrayInsert(
    queryText: any,
    values: any[]
  ): Promise<boolean> {
    const client = new Client(this.clientCredentials);
    client.connect();
    try {
      await client.query(
        queryText,
        values,
      );
    } catch (err) {
      console.log(err.stack);
      return false;
    } finally {
      client.end().then(() => console.log("client has disconnected"));
    }
    return true;
  }

  protected async runParameterizedQueryWithValuesArrayDelete(
    queryText: any,
    values: any[]
  ): Promise<boolean> {
    const client = new Client(this.clientCredentials);
    client.connect();
    try {
      await client.query(
        queryText,
        values,
      );
    } catch (err) {
      console.log(err.stack);
      return false;
    } finally {
      client.end().then(() => console.log("client has disconnected"));
    }
    return true;
  }

  protected async runParameterizedQueryWithValuesArrayUpdate(
    queryText: any,
    values: any[]
  ): Promise<boolean> {
    const client = new Client(this.clientCredentials);
    client.connect();
    try {
      await client.query(
        queryText,
        values,
      );
    } catch (err) {
      console.log(err.stack);
      return false;
    } finally {
      client.end().then(() => console.log("client has disconnected"));
    }
    return true;
  }


  protected abstract dbRowToDbModel(dbRow: any): DatabaseModel;

  protected selectAllQuery: any;

  protected selectOneRowByIdQuery: any;
}
