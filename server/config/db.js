// JSON file-based database using lowdb (no MongoDB needed!)
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'db.json');

const defaultData = {
  users: [],
  vehicles: [],
  trips: [],
  passengerData: [],
  userVehicles: [],
  notifications: []
};

const adapter = new JSONFile(dbPath);
export const db = new Low(adapter, defaultData);

export const connectDB = async () => {
  await db.read();
  db.data ||= defaultData;
  await db.write();
  console.log('✅ JSON database ready at data/db.json');
};

export const saveDB = () => db.write();
export default connectDB;
