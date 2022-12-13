# PdfToText Service

This service is responsible for extracting text from files in `.pdf` format and saving in `.txt` files.

### Usage

In the root directory of the project, run the commands

```bash
$ npm run pdf2text
```
---

### Parameters

The service accepts the following parameters in its execution:

#### # src

Relative path of folder containing `.pdf` files.

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `../../pdf`     	|

Usage:

```$
$ npm run pdf2text -- --src="./path/to/pdf/files"
```

#### # output

Relative path to folder for output `.txt` files.

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `../../txt`     	|

Usage:

```$
$ npm run scrap -- --output="./path/to/folder/for/txt/files"
```

#### # rewrite

Rewrite files with same name upon pdf to txt conversion.

| Item 	| Value 	|
|------	|-------	|
| Type    	| boolean     	|
| Default    	| `false`     	|

Usage:

```$
$ npm run scrap -- --rewrite
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
