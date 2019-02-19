const readlineSync = require('readline-sync');
const fs = require('fs');
const data = fs.readFileSync('animals.json', 'utf8');
const gameDB = JSON.parse(data);
const animalsDB = gameDB.animals;
const questionsDB = gameDB.questions;

function askQuestions() {
    let answer,
        localAnimalsDB = JSON.parse(data).animals, // fixme: зробити копію
        newAnimalQuestions = [];
    localAnimalsDB.map((obj) => {
        obj.matchChance = 0;
        return obj;
    })
    questionsDB.forEach((question) => {
        answer = readlineSync.question(`${question}\n`);
        if (answer == "+" || answer == "-") {
            for (let i = 0; i < localAnimalsDB.length; i++) {
                if (animalsMatch(answer, localAnimalsDB[i], question)) {
                    localAnimalsDB[i].matchChance++;
                } else {
                    localAnimalsDB.splice(i, 1);
                    i--;
                }
            }
        }
        if (answer == "+")
            newAnimalQuestions.push(question);
    })
    if (localAnimalsDB.length != 0)
        return endGame(true, localAnimalsDB.reduce((prev, current) => { return (prev.y > current.y) ? prev : current }), newAnimalQuestions);

    return endGame(false)
}

function animalsMatch(answer, obj, question) {
    if ((answer == "+" && obj.questions.indexOf(question) > -1) ||
            (answer == "-" && obj.questions.indexOf(question) == -1)) {
        return true;
    }
    return false;
}

function endGame(success, animal, matchedQuestions) {
    if (success) {
        let answer, newAnimal, newQuestion;
        if (animal.name != "undefined") {
            possibleAnimal = animal.name;
            answer = readlineSync.question(`Це - ${possibleAnimal}\n`);
            if (answer == "-") {
                newAnimal = readlineSync.question(`Я програв!\nЩо це за тварина?\n`);
                newQuestion = readlineSync.question(`Наведіть питання яке допоможе відрізнити цю тварину від "${possibleAnimal}":\n`);
                questionsDB.push(newQuestion)
                animalsDB.push({name : newAnimal, questions: [newQuestion].concat(matchedQuestions)})
                fs.writeFile('animals.json', JSON.stringify(gameDB), 'utf-8', function(err) {
                    if (err) throw err
                    console.log('Done!')
                });
            }
            return 0
        }
    } else {
        console.log("Щось пішло не так");
    }

    return 0;
}

function startGame(){
    return askQuestions()
}


startGame()
