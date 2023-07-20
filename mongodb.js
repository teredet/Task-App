import { MongoClient, ObjectId } from 'mongodb';


const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = "task-app";

const client = new MongoClient(connectionUrl);


async function run() {
    try {
        await client.connect();

        
    } finally {
        await client.close()
    }
}


async function insertData(count, client, databaseName, collection, data) {
    if (count == 'one') {
        const result = await client.db(databaseName)
            .collection(collection)
            .insertOne(data);
        return result;
    } else if (count == 'many') {
        const result = await client.db(databaseName)
            .collection(collection)
            .insertMany(data);
        return result;
    } else return console.log('Wrong insert count');
}


async function getData(count, client, databaseName, collection, filter) {
    if (count == 'one') {
        const result = await client.db(databaseName)
            .collection(collection)
            .findOne(filter);
        return result;
    } else if (count == 'many') {
        const result = await client.db(databaseName)
            .collection(collection)
            .find(filter)
            .toArray();
        return result;
    } else return console.log('Wrong get count');
}


async function updateData(count, client, databaseName, collection, filter, update) {
    if (count == 'one') {
        const result = await client.db(databaseName)
            .collection(collection)
            .updateOne(filter, update);
        return result;
    } else if (count == 'many') {
        const result = await client.db(databaseName)
            .collection(collection)
            .updateMany(filter, update);
        return result;
    } else return console.log('Wrong update count');
}

async function deleteData(count, client, databaseName, collection, filter) {
    if (count == 'one') {
        const result = await client.db(databaseName)
            .collection(collection)
            .deleteOne(filter);
        return result;
    } else if (count == 'many') {
        const result = await client.db(databaseName)
            .collection(collection)
            .deleteMany(filter);
        return result;
    } else return console.log('Wrong get count');
}



async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

run().catch(console.error)
