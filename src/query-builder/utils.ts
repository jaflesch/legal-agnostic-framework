import * as cherrio from "cheerio";
import { IJudgement } from "../models/judgement.model";
import { utils } from '../utils';

enum BodyContentItem {
  PUBLICATION = "publicacao",
  PARTS = "partes",
  RESUME = "ementa",
  DECISION = "decisao",
  INDEXING = "indexacao",
  LEGISLATION = "legislacao",
  OBSERVATION = "observacao",
  TOPIC = "tema",
  THESIS = "tese",
  DOCTRINE = "doutrina",
  SIMILAR = "acordaos no mesmo sentido",
  JUDGEMENT_BODY = 'orgao julgador',
  WRITER = 'redator',
  RAPPOTEUR = 'relator',
  JUDGEMENT_DATE = 'julgamento',
  PUBLICATION_DATE = 'publicacao',
}

type JSONtoModelParams = {
  id: string;
  docId: string;
  innerHTML: string;
  pdfFileUrl: string;
  innerPageUrl: string;
  innerPageHTML: string;
}

const parseDate = (date: string | undefined) => {
  if (!date) {
    return '0001-01-01';
  }

  const d = date.split('/');
  return `${d[2]}-${d[1]}-${d[0]} 00:00:00`;
}

export const JSONtoModel = (data: JSONtoModelParams): IJudgement => {
  const $ = cherrio.load(data.innerPageHTML);
  const body = $('.jud-text.ng-star-inserted');
  const bodyHeader = $('.jud-text:first-child h4');
  
  let partes: string[] = [];
  let paginaInternaPublicacao = '';
  let ementa = '', decisao = '', dje = '', tese = '', tema = ''; 
  let doutrina = '', legislacao = '', observacao = '', similares = ''; 
  
  let dataJulgamento = '', dataPublicacao = '';
  let redator = '', relator = '';
  
  let orgao = '', decisaoUnanime = undefined, decisaoAdiada = false;

 const indexacao: string[] = [];
  const judgementBodyItems: any = [];

  bodyHeader.each(function(i, el) {
    const text = $(el).text().split(':');
    const key = utils.normalizeString(text[0]);
    const value = text[1]?.trim();

    switch (key) {
      case 'orgao':
      case BodyContentItem.JUDGEMENT_BODY:  
        orgao = value; 
        break;
      case BodyContentItem.JUDGEMENT_DATE:  
        dataJulgamento = value;
        break;
      case BodyContentItem.PUBLICATION_DATE:  
        dataPublicacao = value; 
        break;
      case BodyContentItem.WRITER: 
        redator = value; 
        break;

      case 'relatora':
      case 'relator(a)':
      case BodyContentItem.RAPPOTEUR: 
        relator = value; 
        break;
    }
  });
  
  const paginaInternaTitulo = $(bodyHeader[0]).text().split('/');
  const paginaInternaSubtitulo = $(bodyHeader[1]).text();
  
  body.each(function(i, el) {
    let key = utils.normalizeString($(el).children('h4').text());
    let value = $(el).children('div').text();

    judgementBodyItems.push({
      [key]: value
    });    

    switch (key) {      
      case BodyContentItem.THESIS:
        tese = value; 
        break;
      case BodyContentItem.TOPIC:
        tema = value; 
        break;
      case BodyContentItem.RESUME:
        ementa = value; 
        break;
      case BodyContentItem.SIMILAR:
        similares = value; 
        break;
      case BodyContentItem.DOCTRINE:
        doutrina = value; 
        break;
      case BodyContentItem.LEGISLATION:
        legislacao = value;
        break;
      
        case BodyContentItem.PARTS:
        partes = value.split('\n');
        break;

      case BodyContentItem.DECISION:
        decisao = value; 
        const normalizedDecisao = utils.normalizeString(decisao);

        if (normalizedDecisao.match(/unanime|unanimidade|unaminidade|unanidade|unanimdade/)) {
          decisaoUnanime = true;
        } else if (normalizedDecisao.match(/maioria|majoritaria/)) {
          decisaoUnanime = false;
        } else if (normalizedDecisao.match(/o tribunal|a turma/)) {
          decisaoUnanime = true;
        } else if (normalizedDecisao.match(/empate|empatado|empatada/)) {
          decisaoUnanime = true;
        }

        if (normalizedDecisao.match(/interrompido|interrompida|adiado|adiada/)) {
          decisaoAdiada = true;
        }

        break;

      case BodyContentItem.OBSERVATION:
        observacao = value;
        const normalizedObservacao = utils.normalizeString(observacao);

        if (normalizedObservacao.match(/unanime|unanimidade|unaminidade|unanidade|unanimdade/)) {
          decisaoUnanime = true;
        }
        if (normalizedObservacao.match(/votacao:.*maioria|votacao:.*majoritaria/)) {
          decisaoUnanime = false;
        }
        break;

      case BodyContentItem.PUBLICATION: 
        paginaInternaPublicacao = value.replace('\n', ' ');
        const djeRegex = paginaInternaPublicacao.match(/.*(dj.{0,1}-[0-9]*)/i);
        if (djeRegex) {
          dje = djeRegex[1];
        }
        break;

      case BodyContentItem.INDEXING:
        const tags = value.split(/(\n|,|\.)/g);
        for (const tag of tags) {
          if (tag.length > 0 && tag !== '.' && tag !== ',' && tag !== '\n' && tag !== ' ') {
            indexacao.push(tag.trim().replace(/- */, ''))
          }
        }
        break;
    }
  });
  
  const headerInfos = $('.jud-text:first-child').children('h4');
  orgao = $('.jud-text:first-child > h4').last().text()?.split(': ')[1];
  dataJulgamento = $('.jud-text:first-child > div h4').first().text()?.split(': ')[1];
  dataPublicacao = $('.jud-text:first-child > div h4').last().text()?.split(': ')[1];
  relator = $(headerInfos[2]).text().split(': ')[1];

  if (headerInfos.length > 4) {
    redator = $(headerInfos[3]).text()?.split(': ')[1];
  }
  
  relator = relator.replace(/(Min\. | \(.*\))/g, '');
  redator = redator?.replace(/(Min\. | \(.*\))/g, '');  

  return {
    id: data.id,
    titulo: $(bodyHeader[0]).text(),
    orgao,
    origem: paginaInternaTitulo[1]?.trim(),
    categoria: paginaInternaTitulo[0].split(' ')[0].trim(), 
    relator,
    redator,
    relatorPresidente: !!relator.match('Presidente'),
    redatorPresidente: redator ? !!redator.match('Presidente') : false,
    dataJulgamento: new Date(parseDate(dataJulgamento)),
    dataPublicacao: new Date(parseDate(dataPublicacao)),
    ementa,
    partes,
    decisao,
    decisaoAdiada,
    decisaoUnanime,
    indexacao,
    tese,
    tema, 
    doutrina,
    legislacao,
    observacao,
    similares,
    paginaInternaUrl: data.innerPageUrl,
    paginaHTML: data.innerHTML,
    arquivoPdfUrl: data.pdfFileUrl,
    paginaInternaTitulo: paginaInternaTitulo[0].trim(),
    paginaInternaSubtitulo,
    paginaInternaPublicacao,
    dje,
    paginaInternaHTML: data.innerPageHTML,
    documentId: Number(data.docId),
  }
}
