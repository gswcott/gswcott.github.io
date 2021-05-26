from bottle import Bottle, run, response
import random
import sys

# Pour résoudre le problème: Blocage d’une requête multiorigines (Cross-Origin Request) : la politique « Same Origin » ne permet pas de consulter la ressource distante située sur http://localhost:8080/randRect. Raison : l’en-tête CORS « Access-Control-Allow-Origin » est manquant.
# From https://mushfiq.me/2015/10/07/enable-cors-in-bottle-python/
def allow_cors(func):
    """ this is a decorator which enable CORS for specified endpoint """
    def wrapper(*args, **kwargs):
        response.headers['Access-Control-Allow-Origin'] = '*' # * in case you want to be accessed via any website
        return func(*args, **kwargs)

    return wrapper

def compile(file):
    infile=open(file, "r", encoding='utf8')
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
    return questions

monApplication=Bottle()
@monApplication.route("/randQuiz")
@allow_cors
def randQuiz(): 
    questions=compile(sys.argv[1])
    selected10Q=random.sample(questions,10)
    dict={}
    for i in range(len(selected10Q)): 
        dict["Q"+str(i+1)]=selected10Q[i]
    for key in dict: 
        tmp=random.sample(dict[key]["b"],3)
        tmp.insert(random.randint(0,3), dict[key]["a"])
        dict[key]["choice"]=tmp
    response.content_type = 'application/json'
    return dict
run(monApplication, host="localhost", port=8080)