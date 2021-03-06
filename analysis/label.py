# @Peng Cao 798530
# @Email:  caop1@student.unimelb.edu.au

#import modules
import json
import json
import nltk
from tqdm import tqdm
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import argparse

#define a function that gives score of a sentence, using simple analyzer in nltk.
def nltk_sentiment(sentence):
    nltk_sentiment = SentimentIntensityAnalyzer()
    score = nltk_sentiment.polarity_scores(sentence)
    return score

#define a function that given a tweet, gives a result from positive, negative or neutral
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
    
    #add argument of input and output file name, with input being unlabeled tweets, and output being labeled.
    parser = argparse.ArgumentParser(description = 'label the simple sentiment analysis')
    parser.add_argument('--inputfilename', type=str, default='defaultinput.json')
    parser.add_argument('--outputfilename', type=str, default='defaultoutput.json')
    args = parser.parse_args()


    f = open(args.inputfilename,'r+',encoding = "utf-8")
    tweets = json.loads(f.read())["docs"]
    
    #add a process of detecting no-text tweets, and store their index
    no_text_index = []
    processed_fr = []
    for candidate in tweets:
        if len(candidate['text']) == 0:
            no_text_index.append(candidate)
        else:
            processed_fr.append(candidate)

    #label every tweets if they have text.
    for i in tqdm(range(len(processed_fr))):
        text = processed_fr[i]['text']
        score = nltk_sentiment(text)
        #could be use for detailed analysis
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





