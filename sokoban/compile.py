def compile(file1, file2):
    infile=open(file1, "r")
    content=infile.read().splitlines()
    infile.close()
    levelGrid=[]
    grid=[]
    for line in content:
        if len(line)==0: 
            continue
        else:
            firstChar=line[0] 
            if firstChar != ";": 
                row=[]
                for x in line: 
                    row.append(x)
                grid.append(row)
            elif firstChar==";": 
                levelGrid.append(grid)
                grid=[]
    outfile=open(file2, "w")
    outfile.write("levelGrid="+str(levelGrid))
    outfile.close()
compile("Original.xsb", "levels.js")