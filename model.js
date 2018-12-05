class Model {

    constructor() {
        this.table = this.constructor.table();
        this.values = {};
    }

    // set values
    setValue(key, value) {
        if (this.fields.includes(key) && value !== undefined && value !== "") {
            this.values[key] = value;
        }
    }

    // reset values
    resetValues() {
        this.values = {};
    }

    /**
     * load all from particular table
     *
     * @param callback
     * @returns {Promise<void>}
     */
    async loadAll(callback) {
        db.query(`SELECT * FROM ${this.table}`, await function (err, result) {
            if (err)
                callback(err, null);
            else
                callback(null, result);
        });
    }

    /**
     * load one with join table
     *
     * @param callback
     * @returns {Promise<void>}
     */
    async load(callback) {

        let where = "";
        let whereArr = [];

        // build where
        for (let key in this.values) {
                where += " " + this.table +"." + key + "=? AND";
                whereArr.push(this.values[key]);
        }

        // build where equal
        if (where !== "") {
            where = " WHERE " + where;
            where = where.substring(0, where.length - 3);
        }

        // build join
        let join = "";
        if (this.hasMany[0]['primaryKey'] !== undefined && this.hasMany[0]['foreignKey'] !== undefined && this.hasMany[0]['model'] !== undefined) {
            let joinTable = this.hasMany[0].model.table();
            let joinEqual = this.table + "." + this.hasMany[0].primaryKey + "=" + joinTable +"."+ this.hasMany[0].foreignKey

            join = " INNER JOIN " + joinTable + " ON " + joinEqual;
        }

        // request
        db.query(`SELECT * FROM ${this.table} ${join} ${where}`, whereArr, await function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
    }

    /**
     * delete item by id
     *
     * @param callback
     * @returns {Promise<void>}
     */
    async delete (callback) {

        let deleteId;
        if (this.values.id === undefined || this.values.id <= 0) callback(new Error("invalid id"), null);
        else deleteId = this.values.id;

        db.query(`DELETE FROM ${this.table} WHERE id = ?`, [deleteId], await function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
    }

    /**
     * create or update one row
     *
     * @param callback
     * @returns {Promise<void>}
     */
    async save (callback) {

        let saveId;
        let sql;
        if (this.values.id !== undefined && this.values.id > 0) saveId = this.values.id;

        // save
        if (saveId === undefined) {
            let saveFields = [];
            for (let i = 0; i < this.fields.length; i++) {
                if (this.fields[i] === 'id' && this.values['id'] === undefined) {
                    saveFields.push('NULL');
                    continue;
                }
                if (this.values[this.fields[i]] !== undefined) {
                    if (!+this.values[this.fields[i]]) saveFields.push("'" + this.values[this.fields[i]] + "'");
                    else saveFields.push(this.values[this.fields[i]]);
                }
                else callback(new Error("invalid value in field " + this.fields[i]), null);
            }
            sql = `INSERT INTO ${this.table} (` + this.fields.join(", ") + `) VALUES (` + saveFields.join(", ") + `);`;

            db.query(sql, await function (err, result) {
                if (err) callback(err, null);
                else callback(null, result);
            });
        // update
        } else if (saveId) {
            this.values.id = undefined;

            let changeFields = "";
            for (let key in this.values) {
                let val = this.values[key];
                if (!+val && val !== undefined) val = "'" + val + "'";
                if (val) changeFields += key + "=" + val + ", ";
            }
            changeFields = changeFields.slice(0, -2);

            sql = `UPDATE ${this.table} SET ${changeFields} WHERE id = ${saveId}`;
            db.query(sql, await function (err, result) {
                if (err) callback(err, null);
                else callback(null, result);
            });
        }
    }
}

module.exports = Model;
