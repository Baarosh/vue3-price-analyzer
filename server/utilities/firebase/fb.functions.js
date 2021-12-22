import { initializeApp } from 'firebase/app'
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import firebaseConfig from './fb.config';

export function initalizeFirebaseConnection() {
    initializeApp(firebaseConfig);
    console.log('*FB--> Connected.*');
}

export async function uploadToFirebase(collectionName, data) {
    const db = getFirestore()

    const numberOfBatches = Math.ceil(data.length/250)
    let index = 0
    let batch = null

    for (let i = 1; i <= numberOfBatches ; i+=1) {
        batch = writeBatch(db)

        for(let j = 1; j <= 250; j+=1) {
            if (data[index]) {
                const productRef = doc(db, collectionName, data[index][0]+'')
                const productMeasuresRef = doc(db, `${collectionName}/${data[index][0]+''}/Measures`, data[index][3])

                batch.set(productRef, {
                    productId: data[index][0],
                    productName: data[index][1],
                })

                batch.set(productMeasuresRef, {
                    timeStamp: data[index][3],
                    productPrice: data[index][2]
                })
                index+=1
            } else break
        }
        try {
            await batch.commit()
        } catch(e) {
            console.log(e)
        }
        batch = null
    }
}
