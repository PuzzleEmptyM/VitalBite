import { NextApiRequest, NextApiResponse } from 'next';
import { seedDatabase } from '../../../lib/seed';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Request method:', req.method);
  console.log('Headers:', req.headers);

  if (req.method === 'GET') {
    try {
      console.log('Seeding database...');
      await seedDatabase();
      res.status(200).json({ message: 'Database seeded successfully' });
    } catch (error) {
      console.error('Error seeding database:', error);
      res.status(500).json({ error: 'Failed to seed database' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    console.log('Invalid method:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
