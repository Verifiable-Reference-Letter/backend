import { Client } from 'pg';

export abstract class DatabaseService<DatabaseModel> {

    protected client: Client;
    private dbModels: DatabaseModel[] = [];

    constructor() {
        // Temporary for testing until we implement running in development and production modes
        this.client = new Client({
            connectionString: process.env.DATABASE_URL || "postgres://plrnqvkoieossi:6e67d9a93ad03361124f172fa865b56e16966f7edd112dc0d4be24e303399d00@ec2-52-86-73-86.compute-1.amazonaws.com:5432/d4ur44i35a17si",
            ssl: true,
        });
    }

    async selectAll(): Promise<DatabaseModel[]> {
        this.dbModels = [];
        this.client.connect();
        try {
            const res = await this.client.query(this.selectAllQuery);
            let jsonRow;
                for (const row of res.rows) {
                    jsonRow = JSON.stringify(row);
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
            this.client.end().then(() => console.log("client has disconnected"));
        }
    }


    // protected selectOneRowById(id: string): DatabaseModel {
    //     var dbModel: DatabaseModel;

    //     const text = 'SELECT * from users WHERE user_id = $1';
    //     const values = [id];
    //     this.client.query(text, values, (err, res) => {
    //         if (err) {
    //             console.log(err.stack);
    //         }
    //         else {
    //             dbModel = this.dbRowToDbModel(res.rows[0]);
    //         }
    //     });
    //     return dbModel;
    // }

    protected abstract dbRowToDbModel(dbRow: any): DatabaseModel;

    protected selectAllQuery: any;

    // protected selectOneRowByIdQuery: Object;

}