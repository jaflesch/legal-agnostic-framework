import path  from 'path';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { StopWords } from './stopwords';
import { Judgement } from '../models/judgement.model';
import { QueryBuilder } from '../query-builder';

type WordCountRow = {
  key: string;
  value: number;
}

(async function() {
  const files = readdirSync(path.join(__dirname, '..', 'txt'));
  const wordPerFile = [];
  const uniqueWordPerFile = [];
  let totalSize = 0;

  const qb = new QueryBuilder(Judgement).$();   
  const result = await qb.find().select({
    _id: 0,
    paginaInternaTitulo: 1,
    ementa: 1,
    decisao: 1,
    tese: 1,
    observacao: 1,
    doutrina: 1,
  });
  
  for (let i = 0; i < result.length; i++) {
    const wc: { [key: string]: number} = {};
    const a = (
      result[i].ementa?.trim() +
      result[i].paginaInternaTitulo?.trim() +
      result[i].decisao?.trim() +
      result[i].tese?.trim() +
      result[i].observacao?.trim() +
      result[i].doutrina?.trim()      
    );
    const c = a.split(/\n| /).filter(a => a !== '' && a !== ' ').join(' ');
    const rgx = new RegExp("[^A-zÀ-ú -]", "gi");
    const b = c.replace(rgx, '').toLocaleLowerCase();
    
    const words = b.split(/\n| |\/|“|"|'|`|–|—|-|\(|\)|\[|\]\t|\r|\\/).filter(a => {
      return (
        a !== '' &&
        a !== '-' &&
        a !== 'n' &&
        a.length > 1 &&
        !(a in StopWords)
      )
    });

    let totalWords = 0;
    let totalUniqueWords = 0;

    for (let j =0; j < words.length; j++) {
      //totalSize += new TextEncoder().encode(words[j]).length;
      totalSize += Buffer.byteLength(words[j], 'utf8');

      if (wc[words[j]]) {
        wc[words[j]] += 1;
        totalWords++;
      } else {
        wc[words[j]] = 1;
        totalWords++;
        totalUniqueWords++;
      }
    }


    wordPerFile.push(totalWords);
    uniqueWordPerFile.push(totalUniqueWords);
  }
  
  console.log('@ Total size: ', totalSize);
  console.log('@ Words/file: ', (
    wordPerFile.reduce(
      (partialSum, current) => partialSum + current, 0
    ) / wordPerFile.length)
  );
  console.log('@ Unique words/file: ', (
    uniqueWordPerFile.reduce(
      (partialSum, current) => partialSum + current, 0
    ) / uniqueWordPerFile.length)
  );
})();
