import 'dotenv/config';
import path from 'path';
import express, {Request, Response} from 'express';
import { DocumentCategory } from "./infra/document-category.enum";
import { normalizeAverageValue } from './infra/normalize-avg-value';
import { DocumentCategoryLabel } from "./infra/document-category-label.enum";
import { 
  VotesByMinisterQuery,
  VotesByJudgementQuery,
  JudgementsByYearQuery,
  JudicialBodyCountQuery,
  JudgementsByWriterQuery,
  JudicialBodyByYearQuery, 
  JudgementsByRappoteurQuery,
  VotesMonocraticByYearQuery,
  JudgementsByDecisionTypeQuery,
  JudgementsByLocationCountQuery,
  JudgementsByDecisionDelayedQuery,
  JudgementsByDocumentCategoryYearQuery,
  JudgementsByDocumentCategoryCountQuery,
} from './query';

const app = express();
const router = express.Router();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./pages"));

app.use('/public', express.static(path.join(__dirname, './public')));

router.get('/', (_req: Request, res: Response) => {
  const chart = [
    { nome : "AYRES BRITTO", count : 564 },
    { nome : "CARLOS VELLOSO", count : 2 },
    { nome : "CELSO DE MELLO", count : 138 },
    { nome : "CEZAR PELUSO", count : 258 },
    { nome : "CÁRMEN LÚCIA", count : 664 },
    { nome : "DIAS TOFFOLI", count : 438 },
    { nome : "ELLEN GRACIE", count : 653 },
    { nome : "EROS GRAU", count : 203 },
    { nome : "GILMAR MENDES", count : 464 },
    { nome : "JOAQUIM BARBOSA", count : 569 },
    { nome : "MARCO AURÉLIO", count : 360 },
    { nome : "NÉRI DA SILVEIRA", count : 1 },
    { nome : "OCTAVIO GALLOTTI", count : 1 },
    { nome : "RICARDO LEWANDOWSKI", count : 634 }
  ];

  const normalizedChart = normalizeAverageValue(chart, 50);

  if( normalizedChart.length > 0) {
    normalizedChart.push({
      nome: 'Outros',
      count: chart.length - normalizedChart.length
    })
  }

  res.render("index", { 
    chart: normalizedChart,
  });
});

router.get('/acordao-ano', async ({ query }: Request, res: Response) => {
  const judgementsByYearsQuery = new JudgementsByYearQuery();
  const chart = await judgementsByYearsQuery.execute(query);
 
  res.render("acordao-ano", { 
    chartTitle: 'Acordãos por ano',
    chart: JSON.stringify(chart) 
  });
});

router.get('/acordao-relator', async ({ query }: Request, res: Response) => {
  const judgementByRapporteur = new JudgementsByRappoteurQuery();
  const chart = await judgementByRapporteur.execute(query);
  
  res.render("acordao-relator", { 
    chartTitle: 'Acordãos por relator',
    chart: JSON.stringify(chart) 
  });
});

router.get('/acordao-redator', async ({ query }: Request, res: Response) => {
  const judgementsByWriter = new JudgementsByWriterQuery();
  const chart = await judgementsByWriter.execute(query);
  
  res.render("acordao-redator", { 
    chartTitle: 'Acordãos por redator',
    chart: JSON.stringify(chart) 
  });
});

router.get('/acordao-orgao-ano', async ({ query }: Request, res: Response) => {
  const judicialBodyByYearQuery = new JudicialBodyByYearQuery();
  const chart = await judicialBodyByYearQuery.execute(query);
  
  res.render("orgao-ano", { 
    chartTitle: 'Acórdãos / Órgão julgador / ano',
    chart: JSON.stringify(chart) 
  });
});

router.get('/acordao-orgao', async (_req: Request, res: Response) => {
  const judicialBodyCountQuery = new JudicialBodyCountQuery();
  const chart = await judicialBodyCountQuery.execute();
  
  res.render("acordao-orgao", { 
    chartTitle: 'Total acõrdãos / Órgão julgador',
    chart: JSON.stringify(chart) 
  });
});

router.get('/acordao-categoria', async ({ query }: Request, res: Response) => {
  const judgementsByDocumentCategoryCountQuery = new JudgementsByDocumentCategoryCountQuery();
  const chart = await judgementsByDocumentCategoryCountQuery.execute(query);

  res.render("acordao-categoria", { 
    chartTitle: 'Total acórdãos / categoria',
    chart: JSON.stringify(chart),
  });
});

router.get('/acordao-categoria-ano', async ({ query }: Request, res: Response) => {
  const judgementsByDocumentCategoryYearQuery = new JudgementsByDocumentCategoryYearQuery();
  const chart = await judgementsByDocumentCategoryYearQuery.execute(query);

  const categories = [];
  const dcKeys = Object.values(DocumentCategory);
  const dcLabels = Object.values(DocumentCategoryLabel);

  for (let i = 0; i < dcKeys.length; i++) {
    categories.push({
      key: dcKeys[i],
      value: dcLabels[i],
    });
  }

  res.render("acordao-categoria-ano", { 
    chartTitle: 'Total acõrdãos / categoria / ano',
    categories: categories,
    chart: JSON.stringify(chart),
  });
});

router.get('/decisao-tipo', async({ query}: Request, res: Response) => {
  const judgementsByDecisonTypeQuery = new JudgementsByDecisionTypeQuery();
  const chart = await judgementsByDecisonTypeQuery.execute(query);

  res.render("decisao-tipo", { 
    chartTitle: 'Tipo de decisão',
    chart: JSON.stringify(chart),
  });
});

router.get('/decisao-tipo-ano', async({ query}: Request, res: Response) => {
  const judgementsByDecisonTypeByYearQuery = new JudgementsByDecisionTypeQuery();
  const chart = await judgementsByDecisonTypeByYearQuery.execute({
    ...query,
    groupByYear: true,
  });

  res.render("decisao-tipo-ano", { 
    chartTitle: 'Tipo de decisão / ano',
    chart: JSON.stringify(chart),
  });
});

router.get('/decisao-adiamento', async({ query}: Request, res: Response) => {
  const judgementsByDecisonDelayedQuery = new JudgementsByDecisionDelayedQuery();
  const chart = await judgementsByDecisonDelayedQuery.execute(query);

  res.render("decisao-adiamento", { 
    chartTitle: 'Decisão adiada',
    chart: JSON.stringify(chart),
  });
});

router.get('/votos-ministro', async({ query}: Request, res: Response) => {
  const votesByMinisterQuery = new VotesByMinisterQuery();
  const chart = await votesByMinisterQuery.execute(query);

  res.render("votos-ministro", { 
    chartTitle: 'Votos / ministro',
    chart: JSON.stringify(chart),
  });
});

router.get('/votos-monocraticos-ano', async({ query}: Request, res: Response) => {
  const votesMonocraticByYearQuery = new VotesMonocraticByYearQuery();
  const chart = await votesMonocraticByYearQuery.execute(query);

  res.render("votos-monocraticos-ano", { 
    chartTitle: 'Votos monocráticos / ano',
    chart: JSON.stringify(chart),
  });
});

router.get('/votos-acordao', async({ query}: Request, res: Response) => {
  const votesByJudgementQuery = new VotesByJudgementQuery();
  const chart = await votesByJudgementQuery.execute(query);

  res.render("votos-acordao", { 
    chartTitle: 'Votos / acórdão',
    chart: JSON.stringify(chart),
  });
});

router.get('/local-federacao', async({ query }: Request, res: Response) => {
  const judgementsByLocationCountQuery = new JudgementsByLocationCountQuery();
  const chart = await judgementsByLocationCountQuery.execute({
    ...query,
    country: 'BR'
  });
  
  res.render("local-federacao", { 
    chartTitle: 'Acõrdãos / federação brasileira',
    chart: JSON.stringify(chart),
  });
});

router.get('/local-estado', async({ query }: Request, res: Response) => {
  const judgementsByLocationCountQuery = new JudgementsByLocationCountQuery();
  const chart = await judgementsByLocationCountQuery.execute(query);

  res.render("local-estado", { 
    chartTitle: 'Acórdãos / país',
    chart: JSON.stringify(chart),
  });
});

app.use('/', router);
app.listen(process.env.PORT || 3000);

console.log('Running at Port 3000');
