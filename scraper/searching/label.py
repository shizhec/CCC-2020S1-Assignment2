#!/usr/bin/env python
# coding: utf-8


import json
from ast import literal_eval
import nltk
from tqdm import tqdm
from nltk.sentiment.vader import SentimentIntensityAnalyzer




#nltk.download('vader_lexicon')



f = open('Canberra_April.txt','r+',encoding = "utf-8")
fr = f.readlines()

no_text_index = []
processed_fr = []
for tweet in fr:
    candidate = literal_eval(tweet.strip())
    if len(candidate['text']) == 0:
        no_text_index.append(candidate)
    else:
        processed_fr.append(candidate)





def nltk_sentiment(sentence):
    nltk_sentiment = SentimentIntensityAnalyzer()
    score = nltk_sentiment.polarity_scores(sentence)
    return score




for i in tqdm(range(len(processed_fr))):
    text = processed_fr[i]['text']
    score = nltk_sentiment(text)
    #processed_fr[i]['negative'] = score['neg']
    #processed_fr[i]['neutral'] = score['neu']
    #processed_fr[i]['positive'] = score['pos']
    #processed_fr[i]['compound'] = score['compound']
    if score['compound'] >= 0.05:
        processed_fr[i]['simple_sentiment_label'] = str("positive")
    elif score['compound'] <= -0.05:
        processed_fr[i]['simple_sentiment_label'] = str("negative")
    else:
        processed_fr[i]['simple_sentiment_label'] = str("neutral")

result = {"new_edits":False,"docs":processed_fr}



with open('processed_canberra_april.json', 'w+',encoding="utf-8") as fp:
    json.dump(result, fp)

f.close()





