const { DownloaderHelper } = require('node-downloader-helper');
import colors from 'colors';
import { existsSync, mkdirSync, writeFile, readdirSync, createWriteStream } from 'fs';
import path from 'path';
import fs from 'fs';
import { Judgement } from '../models/judgement.model';
import { QueryBuilder } from '../query-builder';
import { CLIArgs } from './args';

export class PdfDownloader {
	urls: string;
	destFolder: string;
	debug: boolean;

	constructor (options?: CLIArgs) {
		this.urls = options?.urls ?? '';
		this.destFolder = options?.output ?? '../../pdf';
		this.debug = options?.debug ?? false;
	}

	async getUrls () {
		let shouldReadFromDatabase = false;

		if (this.urls) {
			const target = path.join(__dirname, this.urls);
			if (existsSync(target)) {
				const buffer = fs.readFileSync(target, 'utf-8');
				return buffer.split('\r\n').filter(url => url !== '');
			} else {
				shouldReadFromDatabase = true;
			}
		} else {
			shouldReadFromDatabase = true;
		}

		if (shouldReadFromDatabase) {
			try {
				const qb = new QueryBuilder(Judgement).$();
				const result = await qb.find().select({
						id: 1, 
						_id: 0,
						arquivoPdfUrl: 1, 
				});
				
				return result.map(record => record.arquivoPdfUrl);
			} catch(err: any) {
				console.error(`Could not fetch PDF url list: ${err.message}`.red);
			}
		} else {
			return [];
		}
	}

	async run () {
		const urls = await this.getUrls() ?? [];
		this.debug && console.log('..::PDF Scraper::..'.blue);
		this.debug && console.log(`${urls.length} urls found\n`.blue);

		const responses = [];
		const destinationFolder = path.join(__dirname, this.destFolder);	
		if (! existsSync(destinationFolder)) {
      mkdirSync(destinationFolder);
    }

		const logStream = createWriteStream(path.join(destinationFolder, 'log.txt'), {flags: 'a'});
		let currentUrl = '', fileName = '', status = 0;

		const filesMap = new Set([
			...readdirSync(destinationFolder)
		]);
		
		const filteredUrls = [];
		for (let i = 0; i < urls.length; i++) {
			fileName = urls[i].split('&docID=')[1] + '.pdf';
			if (! filesMap.has(fileName)) {
				filteredUrls.push(urls[i]);
			}
		}
		
		try {
			for (let i = 0; i < filteredUrls.length; i++) {
				currentUrl = filteredUrls[i];
				this.debug && console.warn(`[${i + 1}] Downloading file from: ${filteredUrls[i]} ...`.yellow);
				fileName = currentUrl.split('&docID=')[1] + '.pdf';
							
				const download = new DownloaderHelper(
					filteredUrls[i], 
					destinationFolder, 
					{ fileName }
				);					
				this.debug && download.on('end', () => console.log('Download completed!\n'.green))
				this.debug && download.on('error', (err: any) => console.log('Download failed: '.red, err.status));
				
				let status = 0, size = 0;
				try {
					await download.start();
				} catch (err: any) {
					status = err.status ?? 500;
				}
				
				if (status === 0) {
					const totalSize = await download.getTotalSize();
					size = totalSize.total;
				}
				
				responses.push({
					pdfUrl: filteredUrls[i],
					fileName,
					size,
					error: status,
				});
				logStream.write(`${status}\t${filteredUrls[i]}\t${size}\n`)
			}
		}	catch (err) {} 
		finally {
			logStream.end();
		}
		
		writeFile(
			path.join(destinationFolder, 'log.json'),
			JSON.stringify(responses, undefined, 2), 
			'utf8', 
			(err) => {
				if(err) {
					console.log(`Error when creating logfile: ${err.message}`.red);					
				}

				console.log(`The data has been scrapped and saved successfully! View it at '${destinationFolder}'`.green);
			}
		);

		return responses;
	}
}
