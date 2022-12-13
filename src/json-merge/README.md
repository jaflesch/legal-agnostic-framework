# Json Merge Service

This service is responsible for unifying all JSONs generated for each page in the STF Scrap service.

### Usage

In the root directory of the project, run the commands

```bash
$ npm run merge
```
---

### Parameters

The service accepts the following parameters in its execution:

#### # basepath

Relative path to append to json folders' basepath

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `../../json`     	|

Usage:

```$
$ npm run merge -- --basepath="./new/base/path"
```

#### # src

Relative path of paginated `.json` files' folder. 

It is possible to pass a list of src paths. The syntax is as follows: `--src="path/to/folder1,path/to/folder2,..."`. 

> Be aware that the `basepath` param will be appended at each of given paths.

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `''`     	|

Usage:

```$
$ npm run merge -- --src="my/json/folder/path"
```

#### # output

Relative path to folder for output each `.merge.json` files.

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `../../merge`     	|

Usage:

```$
$ npm run merge -- --output="./path/to/new/folder"
```

#### # filter

List of accepted `.json` files keys. Each provided key will be copied to the merged file with its respective value. Keys are separated by `,`.

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `'*'`     	|

Usage:

```$
$ npm run merge -- --filter="id,innerPageHTML,docId"
```

#### # debug

Allow log of events during script execution. Good for debugging.

| Item 	| Value 	|
|------	|-------	|
| Type    	| boolean     	|
| Default    	| `false`     	|

Usage:

```$
$ npm run merge -- --debug
```
