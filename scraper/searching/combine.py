import json

with open("vic_lga_raidus_center.json","r+",encoding="utf-8") as f:
    lgas = json.loads(f.read())
    for lga, data in lgas.items():
        district_name = lga.replace(" ","_")
        lst = ["{lga}\\{lga}01.json".format(lga=district_name),"{lga}\\{lga}02.json".format(lga=district_name),"{lga}\\{lga}03.json".format(lga=district_name),"{lga}\\{lga}04.json".format(lga=district_name)]
        combined_doc = {"docs":[]}
        for split in lst:
            try:
                fp = open(split,"r",encoding="utf_8")
                temp = json.loads(fp.read())
                combined_doc["docs"].extend(temp["docs"])
                fp.close()
            except:
                continue
        with open("{lga}\\{lga}_2020.json".format(lga=district_name),"w+",encoding="utf-8") as fn:
            json.dump(combined_doc,fn)