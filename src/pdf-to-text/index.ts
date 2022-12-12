import { args } from './args';
import { Pdf2Text } from "./Pdf2Text";

(async function () {
  const pdf2text = new Pdf2Text(args);
  await pdf2text.run();
  
  process.exit();
})();
