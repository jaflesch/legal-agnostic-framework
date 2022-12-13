# Text Annotation service

This service provides text annotation using the [LeNER-Br model](https://github.com/peluz/lener-br).

Until now, this service is carried out manually. Initially, it is necessary to provide a `.txt` file with the text to be classified by the LeNER-Br model and, later, with the output `.txt` file, upload a Flask server to view the content in an HTML page.

For more information, please read the [LeNER-Br](https://github.com/peluz/lener-br/blob/master/README.md) documentation and instructions.

### Pre-requisites

```txt
Package            Version
----------------   ---------
nltk               ^3.2.4
numpy              ^1.14.2
scikit-learn       ^0.19.1
tensorflow         ^1.7.0
Flask              ^1.1.4
```

### Usage

In the root directory of the project, run the commands

```bash
$ cd ./src/text-annotation/model
```
```bash
$ python text-annotation-service.py "path-to-file-with-legal-text"
```

With the generated `output.txt` file, to present the annotated text on HTML page, run the command

```bash
$ python legal-text-helper.py
```
