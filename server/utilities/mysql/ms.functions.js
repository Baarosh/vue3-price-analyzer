import mysql from 'mysql2'
import mySQLConfig from './ms.config'

export function initalizeMySQLConnection() {
    console.log('*MS--> Connected.*');
    return mysql.createConnection(mySQLConfig);
}

export async function uploadToMySQL(collectionName, data, connection) {
    try {
        connection.connect((err) => {
            if (err) throw err;
            });

        const dimData = data.map((array) => [array[0], array[1]])
        const factData = data.map((array) => [array[0], array[2], array[3]])
        const dimName = `d_${collectionName}`
        const factName = `f_${collectionName}`

        await connection.promise().query('INSERT INTO ?? (productId, productName) VALUES ? AS VAL ON DUPLICATE KEY UPDATE productName = VAL.productName',
        [dimName, dimData]);

        await connection.promise().query('INSERT INTO ?? (productId, productPrice, timeStamp) VALUES ?',
        [factName, factData]);

    } catch(e) {
        console.log(e)
    }
}
