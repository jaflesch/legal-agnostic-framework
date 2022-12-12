import colors from 'colors';
const yargs = require('yargs/yargs');

export type CLIArgs = {
	s: string;
  o: string;
	d: boolean;
  r: boolean;
	src: string;
	debug: boolean;
	output: string;
  rewrite: boolean;
}

export const args: CLIArgs = yargs(process.argv.slice(2))
	.options({
		'd': {
			alias: 'debug',
			demandOption: false,
			default: false,
			describe: colors.blue('Log de eventos'),
			type: 'boolean'
		},
    'r': {
      alias: 'rewrite',
			demandOption: false,
			default: false,
			describe: colors.blue('Sobrescrever arquivos mesmo nome'),
			type: 'boolean'
		},
		'o': {
			alias: 'output',
			demandOption: false,
			default: '../../txt',
			describe: colors.blue('Path relativo arquivo output'),
			type: 'string'
		},
		's': {
			alias: 'src',
			demandOption: false,
			default: '../../pdf',
			describe: colors.blue('Path relativo arquivos entrada'),
			type: 'string'
		},
	})
	.argv;
