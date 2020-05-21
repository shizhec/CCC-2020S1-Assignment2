import json
import re
from ast import literal_eval

lst = ['14-05-2020.json','15-05-2020.json','16-05-2020.json','17-05-2020.json','18-05-2020.json','19-05-2020.json','20-05-2020.json','21-05-2020.json']



for name in lst:
    new_result = {}
    with open(name,'r',encoding='utf-8') as f:
        stats = json.loads(f.read())
        for state,result_today in stats.items():
            new_result[state] = {}
            for col,spcific_result in result_today.items():
                try:
                    number = int(spcific_result[0])
                    change = re.search('(\+|\-)\d+',spcific_result[1])
                    new_result[state][col] = [number,int(change.group(0))]
                except:
                   number = re.search('\d+',spcific_result.replace(',',''))
                   new_result[state][col] = int(number.group(0))
    with open('new-'+name,'w+',encoding='utf-8') as nf:
        json.dump(new_result,nf,indent= 2)