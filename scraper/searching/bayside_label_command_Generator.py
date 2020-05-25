import json

output = open("shell_label_commands.txt", "w+",encoding="utf-8")

district_name = "bayside"
wr_line_1 = "python3 label.py --inputfilename \"VIC_LGA/{lga}/{lga}_2019.json\" --outputfilename \"VIC_LGA/{lga}/{lga}_2019_labeled.json\"\n".format(lga = district_name)
output.writelines(wr_line_1)

output.close()