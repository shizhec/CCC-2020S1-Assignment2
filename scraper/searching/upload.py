import json

import argparse

parser = argparse.ArgumentParser(description='shell generator for upload')
parser.add_argument('--address',type = str,default="127.0.0.1")
parser.add_argument('--username',type = str,default= "admin")
parser.add_argument('--password',type = str,default = "password")
args = parser.parse_args()

output = open("upload_command.txt", "w+",encoding="utf-8")


with open("vic_lga_raidus_center.json","r+",encoding="utf-8") as f:
    lgas = json.loads(f.read())
    for lga, data in lgas.items():
        district_name = lga.replace(" ","_")
        wr_line_1 = 'curl -XPOST "http://{username}:{password}@{address}:5984/{lgal}/_bulk_docs" --header "Content-Type: application/json" --data @"{lgah}_labeled.json"\n'\
            .format(lgal = district_name.lower(),lgah = district_name.upper(),username = args.username,password = args.password,address =args.address )
        output.writelines(wr_line_1)

output.close()


        