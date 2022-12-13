from model.ner_model import NERModel
from model.config import Config
from nltk import word_tokenize
from nltk import data
from nltk.tokenize.punkt import PunktSentenceTokenizer
import sys
import os

bcolors = {
    "PESSOA": '[p]',
    "TEMPO": '[t]',
    "LOCAL": '[l]',
    "ORGANIZACAO": '[o]',
    "JURISPRUDENCIA": '[J]',
    "LEGISLACAO": '[L]',
    "ENDC": '[e]',
    "O": ""
}

# create instance of config
config = Config()

# build model
model = NERModel(config)
model.build()
model.restore_session(config.dir_model)

filename = sys.argv[1]

tokenizer = PunktSentenceTokenizer()

with open(filename, 'r', encoding='utf8') as file:
    text = file.read()

tokenizer.train(text)
sentences = tokenizer.tokenize(text)

f = open("output.txt", "w", encoding='utf8')
fileoutput = ""

for sentence in sentences:
    words = word_tokenize(sentence, language='portuguese')
    preds = model.predict(words)
    for index, word in enumerate(words):
        if preds[index][0:2] in ['B-', 'I-', 'E-', 'S-']:
            preds[index] = preds[index][2:]
        fileoutput += (bcolors[preds[index]] + word + bcolors["ENDC"]+'\n')

f.write(fileoutput)
f.close()
