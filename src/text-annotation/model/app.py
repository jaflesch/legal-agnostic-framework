from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    with open('output.txt', 'r', encoding='utf8') as file:
        text = file.read().replace('`', "'")

    #return (text)
    return render_template('index.html', content=text)