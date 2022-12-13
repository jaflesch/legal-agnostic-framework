# Document Classification Service

This service presents 3 classifier models for the task of classifying legal documents.

### Prerequisites

All classifier models were developed using Python 3.7. In addition to the described version, it is necessary to have the following packages installed in the development environment
```txt
Package            Version
----------------   ---------
nltk               ^3.2.4
numpy              ^1.19.5
scikit-learn       ^0.19.1
scipy              ^1.5.4
```

### Usage

In order to analyze and debug the different execution blocks of each classifier in the notebook files (`.ipynb`), 
it is necessary to have the Jupyter software installed on your computer or to transfer the codes to the [Google Colab](https://colab.research.google.com/) platform.

To just run the Python classifier models, in the root directory of the project, run the commands

```bash
$ cd ./src/document-classification
```
Now, run the desired models with one or more of the following commands

```bash
$ python naive-bayes.py
```
```bash
$ python svm.py
```
```bash
$ python random-forest.py
```
---

### Parameters

Until now, there are no parameter settings available for the developed classifier models.
