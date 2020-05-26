import json
import os

output = open("add_views_commands.txt", "w+",encoding="utf-8")

with open("vic_lga_raidus_center.json","r+",encoding="utf-8") as f:
    lgas = json.loads(f.read())
    for lga, data in lgas.items():
        district_name = lga.replace(" ","_")
        request_type1 = "curl -X PUT 'http://admin:password@172.26.130.162:5984/{lga}/_design/coronavirus_related'".format(lga = district_name.lower())
        header = " --header 'Content-Type:application/json'\n"
        data1 = " --data @'view1.json'"
        wr_line_1 = request_type1+data1+header
        output.writelines(wr_line_1)

output.close()