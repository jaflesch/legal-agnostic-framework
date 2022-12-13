# STF Scrap Service

This service is responsible for extracting judgments presented on pages of the [Brazilian Federal Supreme Court](https://portal.stf.jus.br/).

### Usage

In the root directory of the project, run the commands

```bash
$ npm run scrap
```
---

### Parameters

The service accepts the following parameters in its execution:

#### # limit

Number of total pages to scrap data and complete script execution. A param with `0` value means no limit.

| Item 	| Value 	|
|------	|-------	|
| Type    	| number     	|
| Default    	| `0`     	|

Usage:

```$
$ npm run scrap -- --limit=100
```

#### # offset

Initial page to scrap data until complete script execution.

| Item 	| Value 	|
|------	|-------	|
| Type    	| number     	|
| Default    	| `1`     	|

Usage:

```$
$ npm run scrap -- --offset=10
```

#### # rows

Number of results per page that will be scraped at each iteration of execution.

| Item 	| Value 	|
|------	|-------	|
| Type    	| number     	|
| Default    	| `10`     	|

Usage:

```$
$ npm run scrap -- --rows=50
```

#### # dateInterval

Filter judgements query by start and end period. Format is `'DDMMYYYY-DDMMYYYY'`.

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `''`     	|

Usage:

```$
$ npm run scrap -- --dateinterval="01012022-12122022"
```

#### # sort

Sort the judgement results. It follows the format <(date|score),(asc|desc)>

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `'date,desc'`     	|

Usage:

```$
$ npm run scrap -- --sort="score,desc"
```

#### # debug

Allow log of events during script execution. Good for debugging.

| Item 	| Value 	|
|------	|-------	|
| Type    	| boolean     	|
| Default    	| `false`     	|

Usage:

```$
$ npm run scrap -- --debug
```

#### # minify

Minifies generated JSON file.

| Item 	| Value 	|
|------	|-------	|
| Type    	| boolean     	|
| Default    	| `false`     	|

Usage:

```$
$ npm run scrap -- --minify
```
