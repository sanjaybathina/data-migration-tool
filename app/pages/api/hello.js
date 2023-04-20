// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getClient from '@/lib/mongo'
export default async function handler(req, res) {
  // get
  if (req.method === 'GET') {
    const client = await getClient()
    const collection = client.collection('test')

    const result = await collection.find({}).toArray()
    res.status(200).json(result)
  } else if (req.method === 'POST') {
    // post
    const client = await getClient()
    const collection = client.collection('test')

    const result = await collection.insertOne({
      name: 'test',
      age: 18,
    })
    res.status(200).json(result)

  }
}
