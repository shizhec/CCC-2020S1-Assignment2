import json

output = open("shell_label_commands.txt", "w+",encoding="utf-8")

with open("vic_lga_raidus_center.json","r+",encoding="utf-8") as f:
    lgas = json.loads(f.read())
    for lga in lgas.keys():
        district_name = lga.replace(" ","_")
        wr_line_1 = "python3 label.py --inputfilename \"VIC_LGA/{lga}/{lga}05.json\" --outputfilename \"VIC_LGA/{lga}/{lga}_2019_labeled.json\"\n".format(lga = district_name)
        output.writelines(wr_line_1)

output.close()