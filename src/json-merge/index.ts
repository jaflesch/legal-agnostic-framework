import { MergeController } from './MergeController';
import { args } from './args';

(async function () {
  const m = new MergeController(args);
  await m.run();
})();
