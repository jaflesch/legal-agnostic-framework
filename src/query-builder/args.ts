import 'dotenv/config';
import colors from 'colors';
const yargs = require('yargs/yargs');

export type ImportCLIArgs = {
	h: string;
	t: string;
	p: number;
  s: string;
  d: boolean;
	host: string;
  table: string;
  port: number;
  src: string;
  debug: boolean;
}

export const importArgs = yargs(process.argv.slice(2))
.options({
	'h': {
		alias: 'host',
		demandOption: false,
		default: process.env.DB_HOST,
		describe: colors.blue('Host database'),
		type: 'string'
	},
	't': {
		alias: 'table',
		demandOption: false,
		default: process.env.DB_TABLENAME,
		describe: colors.blue('Nome tabela database'),
		type: 'string'
	},
	'p': {
		alias: 'port',
		demandOption: false,
		default: process.env.DB_PORT,
		describe: colors.blue('Porta database'),
		type: 'number'
	},
  's': {
		alias: 'src',
		demandOption: false,
		default: './../merge',
		describe: colors.blue('Path folder arquivos .merge'),
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
