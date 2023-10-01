from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import sqlite3
import json


app = Flask(__name__)
#app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///madden_stats.db"
#db = SQLAlchemy(app)

conn = sqlite3.connect("madden_stats.db")
cur = conn.cursor()
cur.execute("select * from stats limit 2")
rows = cur.fetchall()

# Get column names from cursor.description
column_names = [desc[0] for desc in cur.description]


def create_dict(data):
    # Create a list of dictionaries where keys are column names
    result = []

    for row in data:
        row_dict = {}
        for i, value in enumerate(row):
            row_dict[column_names[i]] = value
        result.append(row_dict)

    return result


all_results = create_dict(rows)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/data")
def data():
    return jsonify(all_results)


if __name__ == "__main__":
    app.run(debug=True)