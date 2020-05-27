import json

# usde to generate shell scripts for labelling the freshly scraped tweets from getfromLocation.py

output = open("shell_label_commands.sh", "w+",encoding="utf-8")
output.writelines("#!/bin/bash\n")
output.writelines("# label scripts shell\n")

with open("vic_lga_raidus_center.json","r+",encoding="utf-8") as f:
    lgas = json.loads(f.read())
    for lga in lgas.keys():
        district_name = lga.replace(" ","_")
        wr_line_1 = "python3 label.py --inputfilename \"{lga}.json\" --outputfilename \"{lga}_labeled.json\"\n".format(lga = district_name)
        output.writelines(wr_line_1)

output.close()