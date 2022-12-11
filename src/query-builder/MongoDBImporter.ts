import 'dotenv/config';
import fs from 'fs';
import colors from 'colors';
import path  from 'path';
import mongoose from "mongoose";
import { exit } from 'process';
import { Judgement } from "../models/judgement.model";
import { JSONtoModel } from "./utils";
import { ImportCLIArgs } from './args';

type MongoDBImporterParams = {
  host: string;
  port: number;
  table: string;
  src?: string;
  debug?: boolean;
}

export class MongoDBImporter {
  host: string;
  port: number;
  tablename: string;
  debug: boolean;
  srcFolder: string;
  
  constructor (options: MongoDBImporterParams) {
    this.host = options.host;
    this.port = options.port;
    this.tablename = options.table;
    this.debug = options?.debug ?? false;
    this.srcFolder = options?.src ?? 'merge';
  }

  async run() {
    const db = await mongoose.connect(`mongodb://${this.host}:${this.port}/${this.tablename}`);
    const con = db.connection;

    const mergeFilesFolderPath = path.join(__dirname, '..', this.srcFolder);
    const mergeFilesFolder = fs.readdirSync(mergeFilesFolderPath);
    const mergeFiles = mergeFilesFolder.filter(mf => mf.match(/\.merge\.json$/))
    
    let count = 0;
    let repeated = 0;

    for (const mergeFile of mergeFiles) {
      let acordaos: any = [];
      const jsonData = fs.readFileSync(
        path.join(mergeFilesFolderPath, mergeFile), 
        'utf-8',
      ) as string;
      
      acordaos = acordaos.concat(...JSON.parse(jsonData));
      
      const judgementIds = new Set([
        ...(
          await Judgement.find().select('id').exec()
        ).map(j => j.id)
      ]);
          
      for (const acordao of acordaos) {
        if (judgementIds.has(acordao.id)) {
          repeated++;
          continue;
        }
    
        const row = new Judgement(
          JSONtoModel(acordao)
        );
        
        const result = await row.save();
        this.debug && console.log(colors.blue(`Inserted row with ID: ${result?._id.valueOf()}`));
        count++;
      }
    }
    con.close();

    console.log(colors.yellow(`\nFinished with: [${count}/${count + repeated}] insertions.`));
  }
}
