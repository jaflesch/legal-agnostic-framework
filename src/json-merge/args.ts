const yargs = require('yargs/yargs');
const colors = require('colors');

export type CLIArgs = {
	f: string;
	s: string;
	o: string;
	d: boolean;
	b: string;
	basepath: string;
	filter: string;
	src: string;
	output: string;
	debug: boolean;
}

export const args = yargs(process.argv.slice(2))
	.options({
		'b': {
			alias: 'basepath',
			demandOption: false,
			default: './../../json',
			describe: colors.blue('Path base para folderss jsons'),
			type: 'string'
		},
		's': {
			alias: 'src',
			demandOption: false,
			default: '',
			describe: colors.blue('Path de folder jsons paginados'),
			type: 'string'
		},
		'o': {
			alias: 'output',
			demandOption: false,
			default: './../../merge',
			describe: colors.blue('Path destino de arquivo final'),
			type: 'string'
		},
		'f': {
			alias: 'output',
			demandOption: false,
			default: "*",
			describe: colors.blue('Keys aceitas do json (separadas por ,)'),
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
