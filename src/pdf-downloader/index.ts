
const yargs = require('yargs/yargs');
const colors = require('colors');
import { PdfDownloader } from './pdfDownloader';
import { args } from "./args";

(async function() {
	const pdfDownloader = new PdfDownloader(args);
	await pdfDownloader.run();
})();
