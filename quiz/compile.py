import sys

def compile(file1, file2):
    infile=open(file1, "r")
    content=infile.read().splitlines()
    infile.close()
    questions=[]
    for line in content:
        if len(line)==0: 
            continue
        elif len(line)==1: 
            print("EREUR")
            print(line)
        else:
            code=line[0]
            text=line[1:]
            if code=="":
                continue
            elif code=="?": 
                question={"q": text}
                questions.append(question)
            elif code=="!":
                question["a"]=text
                question["b"]=[]
            elif code=="@":
                question["b"].append(text)
            else: 
                print("EREUR")
                print("CODE INCONNU:"+ code)
    outfile=open(file2, "w")
    outfile.write("questions="+str(questions))
    outfile.close()
compile(sys.argv[1], sys.argv[2])