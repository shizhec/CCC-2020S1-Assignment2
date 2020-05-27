# @Author: Yizhou Zhu
# @Email:  yizzhu@student.unimelb.edu.au
# @Filename: daily_increase_lga_level.py
# @Last modified by:   Yizhou Zhu
# @Last modified time: 2020-05-26


import json
import os

output = open("create_db_commands.txt", "w+",encoding="utf-8")

with open("vic_lga_raidus_center.json","r+",encoding="utf-8") as f:
    lgas = json.loads(f.read())
    for lga, data in lgas.items():
        district_name = lga.replace(" ","_")
        wr_line_1 = "curl -XPUT 'http://admin:password@172.26.130.162:5984/{lga}?partitioned=true'\n".format(lga = district_name.lower())
        output.writelines(wr_line_1)

output.close()

