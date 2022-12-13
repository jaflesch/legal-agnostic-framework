from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    with open('output.txt', 'r', encoding='utf8') as file:
        text = file.read().replace('`', "'")

    return render_template('about.html', content=text)
