#!/usr/bin/env python
# coding: utf-8


import json
import nltk
from tqdm import tqdm
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import argparse








def nltk_sentiment(sentence):
    nltk_sentiment = SentimentIntensityAnalyzer()
    score = nltk_sentiment.polarity_scores(sentence)
    return score

def label_sentiment(tweet):
    text = tweet['text']
    score = nltk_sentiment(text)
    if score['compound'] >= 0.05:
        tweet['simple_sentiment_label'] = str("positive")
    elif score['compound'] <= -0.05:
        tweet['simple_sentiment_label'] = str("negative")
    else:
        tweet['simple_sentiment_label'] = str("neutral")
    return tweet


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description = 'label the simple sentiment analysis')
    parser.add_argument('--inputfilename', type=str, default='defaultinput.json')
    parser.add_argument('--outputfilename', type=str, default='defaultoutput.json')
    args = parser.parse_args()

    f = open(args.inputfilename,'r+',encoding = "utf-8")
    tweets = json.loads(f.read())["docs"]

    no_text_index = []
    processed_fr = []
    for candidate in tweets:
        if len(candidate['text']) == 0:
            no_text_index.append(candidate)
        else:
            processed_fr.append(candidate)

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

    result = {"docs":processed_fr}



    with open(args.outputfilename, 'w+',encoding="utf-8") as fp:
        json.dump(result, fp,indent= 2)

    f.close()





