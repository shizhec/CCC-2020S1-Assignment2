# @Author: Yizhou Zhu
# @Email:  yizzhu@student.unimelb.edu.au
# @Filename: AURIN_Income.py
# @Last modified by:   Yizhou Zhu
# @Last modified time: 2020-05-26

import json


resultDict = {}
outputfile = open("income_results.json","w")
file = open("income_2016.json","rb")

dictionary = json.loads(file.read())
features = dictionary["features"]

for district in features:
    if "lga_name18" in district["properties"].keys():
        lganame = district["properties"]["lga_name18"]

    if lganame not in resultDict.keys():
        
        resultDict[lganame] = {}
        resultDict[lganame]["income_num"] = 0
   



    if "eq_t_hs_inc_fam_lone_grp_hslds_med_eq_t_hs_inc_wk_aud" in district["properties"] and district["properties"]["eq_t_hs_inc_fam_lone_grp_hslds_med_eq_t_hs_inc_wk_aud"]!=None :
        resultDict[lganame]["income_num"] = district["properties"]["eq_t_hs_inc_fam_lone_grp_hslds_med_eq_t_hs_inc_wk_aud"]
    

json.dump(resultDict, outputfile, indent=2)
outputfile.close()
file.close()