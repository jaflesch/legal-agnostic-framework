import 'dotenv/config';
import { importArgs } from './args';
import { MongoDBImporter } from './MongoDBImporter';

(async function () {
  const mongoDbImporter = new MongoDBImporter(importArgs);
  await mongoDbImporter.run();
  process.exit();
})();
