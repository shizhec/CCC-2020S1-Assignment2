import json

output = open("upload_command.txt", "w+",encoding="utf-8")


with open("vic_lga_raidus_center.json","r+",encoding="utf-8") as f:
    lgas = json.loads(f.read())
    for lga, data in lgas.items():
        district_name = lga.replace(" ","_")
        wr_line_1 = 'curl -XPOST "http://90024_12:90024_12@127.0.0.1:5984/{lgal}/_bulk_docs" --header "Content-Type: application/json" --data @"{lgah}/{lgah}_2020_labeled.json"\n'.format(lgal = district_name.lower(),lgah = district_name.upper())
        output.writelines(wr_line_1)

output.close()


        