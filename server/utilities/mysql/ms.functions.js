import mysql from 'mysql2'
import mySQLConfig from './ms.config'

function initalizeMySQLConnection() {
    console.log('*MS--> Connected.*');
    return mysql.createPool(mySQLConfig);
}

export async function uploadToMySQL(collectionName, data) {
    try {
        const connection = initalizeMySQLConnection()

        const dimData = data.map((array) => [array[0], array[1]])
        const factData = data.map((array) => [array[0], array[2], array[3]])
        const dimName = `d_${collectionName}`
        const factName = `f_${collectionName}`

        await connection.promise().query('INSERT INTO ?? (productId, productName) VALUES ? ON DUPLICATE KEY UPDATE productName = VALUES (productName)',
        [dimName, dimData]);

        await connection.promise().query('INSERT INTO ?? (productId, productPrice, timeStamp) VALUES ?',
        [factName, factData]);

        connection.end()

    } catch(e) {
        console.log(e)
    }
}
