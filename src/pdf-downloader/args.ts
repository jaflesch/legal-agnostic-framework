const yargs = require('yargs/yargs');
const colors = require('colors');

export type CLIArgs = {
	o: string;
	u: string;
	d: boolean;
	output: string;
	urls: string;
	debug: boolean;
}

export const args = yargs(process.argv.slice(2))
.options({
	'o': {
		alias: 'output'.yellow,
		demandOption: false,
		default: './../pdf',
		describe: 'Folder para salvar pdfs'.blue,
		type: 'string'
	},
	'u': {
		alias: 'urls'.yellow,
		demandOption: false,
		default: 10,
		describe: 'Path para arquivo com lista de urls'.blue,
		type: 'string'
	},
	'd': {
		alias: 'debug',
		demandOption: false,
		default: false,
		describe: colors.blue('Log de eventos'),
		type: 'boolean'
	},
})
.argv;
