const { MongoClient } = require('mongodb');

const getClient = async () => {
    const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
    return client.db('migration');
}

export default getClient;