#!/usr/bin/env python
# coding: utf-8


import json
import json
from ast import literal_eval
import nltk
from tqdm import tqdm
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import sys
import argparse


parser = argparse.ArgumentParser(description = 'label the simple sentiment analysis')
parser.add_argument('--inputfilename', type=str, default='defaultinput.json')
parser.add_argument('--outputfilename', type=str, default='defaultoutput.json')
args = parser.parse_args()

#nltk.download('vader_lexicon')



f = open(args.inputfilename)
twitter = json.load(f)
fr = twitter['docs']

text = []
for i in range(len(twitter['docs'])):
    text.append(twitter['docs'][i]['text'])


no_text_index = []
for i in range(len(fr)):
    if len(fr[i]['text']) == 0:
        no_text_index.append(i)




processed_fr = [i for i in fr if i['text']]




len(processed_fr)



(len(no_text_index)+len(processed_fr)) == len(fr)



def nltk_sentiment(sentence):
    nltk_sentiment = SentimentIntensityAnalyzer()
    score = nltk_sentiment.polarity_scores(sentence)
    return score




for i in tqdm(range(len(processed_fr))):
    score = nltk_sentiment(processed_fr[i]['text'])
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

twitter['docs'] = processed_fr


with open(args.outputfilename, 'w') as f:
    json.dump(twitter, f)





