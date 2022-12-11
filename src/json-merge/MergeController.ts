const fs = require('fs');
const path = require('path');
import colors from 'colors';
import { existsSync, mkdirSync } from 'fs';
import { CLIArgs } from './args';

export class MergeController {
  private content: object[] = [];
  private folderPath: string[] = [];
  private filterKeys: string[] = [];
  private filefolders = ['../json'];
  private destinationFolder = path.join(__dirname, '../db');

  constructor (options?: CLIArgs) {
    this.filefolders = options?.src.split(',') ?? [''];
    
    if (options?.output) {
      this.destinationFolder = path.join(__dirname, options.output);
    }

    if(options?.filter) {
      this.filterKeys = options.filter.split(',');
    }

    this.folderPath = this.filefolders.map(f => path.join(
       __dirname, 
       options?.basepath ? options.basepath : '',
       f
    ));
  }

  async run () {
    this.parsePaginatedFiles();
    this.save();
  }

  private save (): void {
    if (! existsSync(this.destinationFolder)) {
      mkdirSync(this.destinationFolder);
    }
    
    let i = 0;
    for (const f of this.folderPath) {
      const fileName = path.parse(f).base;
      const filePath = path.join(this.destinationFolder, `${this.filefolders ? fileName : 'import'}.merge.json`);
      
      fs.writeFile(
        filePath, 
        JSON.stringify(this.content[i++]), 
        'utf8', 
        (err: Error) => {
          if(err) {
            console.log(colors.red(`Error when creating merged JSON data: ${err}`));
          } else {
            console.log(colors.green(`The data has been merged and saved successfully! View it at '${filePath}'`));
          }
        }
      );
    }
  }

  private parsePaginatedFiles () {
    let i = 0;
    for (const folder of this.folderPath) {
      const folders = this.parseFolders(folder);
      this.content.push(
        this.readPaginatedFiles(folders, i)
      );
      i++;
    }
  }

  private parseFolders (folderPath: string): number[] {    
    const dirFiles = fs.readdirSync(folderPath);
    
    const folders = [];
    for (let i = 0; i < dirFiles.length; i++) {
      if (! isNaN(dirFiles[i])) {
        folders.push(Number(dirFiles[i]));
      }
    }
    folders.sort((a, b) => a - b);

    return folders;
  }
    
  private readPaginatedFiles (folders: number[], index: number) {
    let mergedJson: any = [];
    folders.map((folder: number) => {
      const jsonFile = fs.readdirSync(`${this.folderPath[index]}/${folder}`)[0];
      const data = fs.readFileSync(`${this.folderPath[index]}/${folder}/${jsonFile}`);
      const judgements = JSON.parse(data);
      const filteredJson = [];
      
      for (const d of judgements) {
        if (this.filterKeys.length === 0) {
          filteredJson.push(d);
        } else {
          const obj: {[key: string]: any} = {};
          for (let i = 0; i < this.filterKeys.length; i++) {
            if (d[this.filterKeys[i]] !== undefined) {
              obj[this.filterKeys[i]] = d[this.filterKeys[i]];
            }
          }
          filteredJson.push(obj);
        }
      }
      mergedJson = mergedJson.concat(...filteredJson);
    });

    return mergedJson;
  }
}
