import json

fname = input("Input the filename (generally \"Temp_CPC.json\"")
jsonfile = open(fname, "rt")
jsn = json.load(jsonfile)
jsonfile.close()
cpcString = ""

cpcString += chr(jsn["picture_number"]) + (3 * chr(0))
cpcString += chr(jsn["dimx"]) + (3 * chr(0))
cpcString += chr(jsn["dimy"]) + (3 * chr(0))

for picture in jsn["pictures"]:
	for char in picture:
		cpcString += chr(char)

fname = input("Input the filename for output (include .cpc)")
file = open(fname,"wt")
file.write(cpcString)
file.close()