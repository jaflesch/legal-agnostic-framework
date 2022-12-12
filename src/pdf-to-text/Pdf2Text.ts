import path from 'path';
import colors from 'colors';
import PdfParse from "pdf-parse";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { CLIArgs } from './args';

export class Pdf2Text {
  files: string[];
  srcFolder: string;
  dstFolder: string;
  debug: boolean;
  rewrite: boolean;

  constructor (options: CLIArgs) {
    this.srcFolder = path.join(__dirname, options.src);
    this.dstFolder = path.join(__dirname, options.output);
    this.files = readdirSync(this.srcFolder);
    this.debug = options.debug;
    this.rewrite = options.rewrite;
  }

  async run() {    
    this.debug && console.log(colors.yellow('Starting...'));

    if (! existsSync(this.dstFolder)) {
      mkdirSync(this.dstFolder);
    }

    for (let i = 0; i < this.files.length; i++) {
      const fileName = `${this.files[i].substring(0, this.files[i].length - 4)}.txt`;
      const pdfFilePath = path.join(this.srcFolder, this.files[i]);
      const txtFilePath = path.join(this.dstFolder, fileName);

      if(path.extname(pdfFilePath) === '.pdf') {
        
        const dataBuffer = readFileSync(pdfFilePath);
        try {
          const { text } = await PdfParse(dataBuffer);
          
          if (
            !existsSync(txtFilePath) || (
              existsSync(txtFilePath) && this.rewrite
            )
          ) {
            this.debug && console.log(colors.yellow(`[${i + 1}] Converting '${this.files[i]} to text...`));
            this.createTextFile(txtFilePath, text.trim());
          }  
        } catch (err: any) {
          console.error(colors.red(`Error on PDF to HTML conversion: ${err.message}`));
        }
      }
    }
  } 

  createTextFile (fileName: string, text: string) {
    try {
      writeFileSync(
        fileName, 
        text, 
        'utf8'
      );
      this.debug && console.log(colors.green(`File '${fileName}' successfuly saved at '${this.dstFolder}'\n`));
    } catch (err: any) {
      if(err) {
        console.log(colors.red(`Error when creating file '${fileName}': ${err.message}\n`));					
      }
    }
  }
}
