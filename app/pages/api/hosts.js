import getClient from '@/lib/mongo'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  // get
  if (req.method === 'GET') {
    const client = await getClient()
    const collection = client.collection('hosts')

    const result = await collection.find({}).toArray()
    res.status(200).json(result)
  } else if (req.method === 'POST') {
    const { name, host, port, username, password } = req.body

    const client = await getClient()
    const collection = client.collection('hosts')

    await collection.insertOne({
      name,
      host,
      port,
      username,
      password,
    })
    res.status(200).json({
      message: 'Host added successfully',
    })

  } else if (req.method === 'PATCH') {
    const { _id, name, host, port, username, password } = req.body

    const client = await getClient()
    const collection = client.collection('hosts')


    await collection.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          name,
          host,
          port,
          username,
          password,
        },
      }
        );

    res.status(200).json({
      message: 'Host updated successfully',
    })
  }

}
