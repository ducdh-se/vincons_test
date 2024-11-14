"""
Convert file .csv to file .json
"""

import json
import pandas as pd


FILE_NAME = r".\data\data.csv"
df = pd.read_csv(FILE_NAME)
df_json = [
    {
        "question": i[1].question, 
        "option": [i[1].option1,
                   i[1].option2,
                   i[1].option3,
                   i[1].option4],
        "answer": i[1].answer,
    } for i in df.iterrows()]

with open(r".\data\data.json", encoding="utf-8", mode="w") as f:
    json.dump(df_json, f, ensure_ascii=False, indent=4)

input("Done!")
