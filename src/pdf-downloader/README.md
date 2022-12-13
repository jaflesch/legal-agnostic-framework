# PdfDownloader Service

This service is responsible for extracting judgments presented on pages of the [Brazilian Federal Supreme Court](https://portal.stf.jus.br/).

### Usage

In the root directory of the project, run the commands

```bash
$ npm run pdf-down
```
---

### Parameters

The service accepts the following parameters in its execution:

#### # urls

Relative path `.txt` file with a list of a Pdf page's URL from [Brazilian Federal Supreme Court](https://portal.stf.jus.br/). Each line should contain a Pdf URL. If no file is provided, the script will fetch data from MongoDB `judgements` collection.

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `''`     	|

Usage:

```$
$ npm run pdf-down -- --urls="./path/to/file/with/urls"
```

#### # output

Relative path to folder for download `.pdf` files.

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `../../pdf`     	|

Usage:

```$
$ npm run pdf-down -- --output="./path/to/folder/for/pdf/files"
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
