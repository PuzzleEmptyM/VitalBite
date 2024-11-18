import { NextApiRequest, NextApiResponse } from 'next';
import { seedDatabase } from '../../../lib/seed';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      await seedDatabase();
      res.status(200).json({ message: 'Database seeded successfully' });
    } catch (error) {
      console.error('Error seeding database:', error);
      res.status(500).json({ error: 'Failed to seed database' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
