# QueryBuilder Service

This service is responsible for importing JSON data into the MongoDB database and performing queries on the collection.

### Usage

In the root directory of the project, run the commands

```bash
$ npm run mongo-import
```
---

### Parameters

The service accepts the following parameters in its execution:

#### # host

Host value for database connection.

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `process.env.HOST`     	|

Usage:

```$
$ npm run mongo-import -- --host=localhost
```

#### # table

Table name value for database connection.

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `process.env.TABLENAME`     	|

Usage:

```$
$ npm run mongo-import -- --table=judgements
```

#### # port

Port value for database connection.

| Item 	| Value 	|
|------	|-------	|
| Type    	| number     	|
| Default    	| `process.env.PORT`     	|

Usage:

```$
$ npm run mongo-import -- --port=27001
```

#### # src

Relative path of `.merge.json` files' folder. 

| Item 	| Value 	|
|------	|-------	|
| Type    	| string     	|
| Default    	| `''`     	|

Usage:

```$
$ npm run mongo-import -- --src="path/to/merge.json/folder"
```

#### # debug

Allow log of events during script execution. Good for debugging.

| Item 	| Value 	|
|------	|-------	|
| Type    	| boolean     	|
| Default    	| `false`     	|

Usage:

```$
$ npm run mongo-import -- --debug
```
