import json
import os

output = open("shell_commands.txt", "w+",encoding="utf-8")

# path = os.getcwd()
# os.mkdir(path+"\\VIC_LGA")

with open("vic_lga_raidus_center.json","r+",encoding="utf-8") as f:
    lgas = json.loads(f.read())
    for lga, data in lgas.items():
        district_name = lga.replace(" ","_")
        # os.mkdir(path+"\\VIC_LGA\\"+district_name)
        [X,Y] = data["center"]
        radius = data["raidus"]+1
        wr_line_1 = "python3 getfromLocation.py --coordinates \"{lat}, {lon}\" --startdate 2020-05-01 --enddate 2020-05-24 --within {rad}km --filename \"VIC_LGA/{lga}/{lga}05.json\"\n".format(lat=Y,lon=X,rad=radius,lga = district_name)
        output.writelines(wr_line_1)
output.close()

 
# for i in range (1, 21):
# 	wr_line_1 = "gifsicle --delay=100 gif/App_" + str(i) + "_hour_*_down.gif > combine_gif/App_" + str(i) + "_hour_down.gif" + "\n"
# 	wr_line_2 = "gifsicle --delay=100 gif/App_" + str(i) + "_hour_*_up.gif > combine_gif/App_" + str(i) + "_hour_up.gif" + "\n"
# 	output.writelines(wr_line_1)
# 	output.writelines(wr_line_2)
# output.close()