import getClient from '@/lib/mongo'
import producer from '@/lib/producer'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  // get
  if (req.method === 'GET') {
    const client = await getClient()
    const collection = client.collection('migrations')

    const result = await collection.find({}).toArray()
    res.status(200).json(result)
  } else if (req.method === 'POST') {
    const { sourceHostId, sourceDatabase,
      destinationHostId, destinationDatabase
     } = req.body

    const client = await getClient()
    const collection = client.collection('migrations')

    const result = await collection.insertOne({
      sourceHostId: new ObjectId(sourceHostId),
      destinationHostId: new ObjectId(destinationHostId),
      sourceDatabase,
      destinationDatabase,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    })



    await producer.connect()
    await producer.send({
      topic: 'migrations',
      messages: [
        {
          value: JSON.stringify({
            _id: result.insertedId,
            sourceHostId,
            sourceDatabase,
            destinationHostId,
            destinationDatabase,
          }),
        },
      ],
    })


    res.status(200).json({
      message: 'Migration created successfully',
    })

  } else if (req.method === 'DELETE') {
    // delete all
    const client = await getClient()
    const collection = client.collection('hosts')
    const all = await collection.find({}).toArray()
    await collection.deleteMany(
      { _id: { $in: all.map((item) => new ObjectId(item._id)) } }
    )
    res.status(200).json({
      message: 'Migration deleted successfully',
    })
  }

}
