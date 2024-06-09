const letters = document.querySelectorAll(".scoreboard-letter");
let loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;
let ROUNDS = 6;
async function init(){
let currentGuess= '';
let currentRow = 0;
// const string = "BRIAN";
// string.length === 5;
let isLoading = true;


const res = await fetch("https://words.dev-apis.com/word-of-the-day");
const resObj = await res.json();
const word  = resObj.word.toUpperCase();
const wordParts = word.split(""); 
let done = false;
 isLoading = false;
setLoading(isLoading);
console.log(word)

function addLetter(letter){
    if(currentGuess.length < ANSWER_LENGTH){
        currentGuess += letter;
    }
    else{
        currentGuess = currentGuess.substring(0,currentGuess.length - 1) + letter;
    }
    letters[ANSWER_LENGTH *currentRow +  currentGuess.length - 1].innerText = letter;
}

async function commit(){
    if(currentGuess ===! ANSWER_LENGTH){
        // do nothing
        return;
    }
  
isLoading = true;
setLoading(true);
const res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: currentGuess }),
  });
  const { validWord } = await res.json();
  isLoading = false;
setLoading(false);
//TODO validate the word
if(!validWord){
    markInvalidWord();
    return;
}

//TODO  do all the marking as "correct", "close" & "Wrong"
let guessParts = currentGuess.split("");

let map = makeMap(wordParts);
console.log(map)

for(let i = 0; i<ANSWER_LENGTH ; i++){
// mark as correct 
if(guessParts[i] === wordParts[i]){
    letters[currentRow*ANSWER_LENGTH+i].classList.add("correct");
    map[guessParts[i]]--;
}
}

for(let i =0;i<ANSWER_LENGTH; i++){
    if(guessParts[i]=== wordParts[i]){

    }else if(wordParts.includes(guessParts[i]) && map[guessParts[i]]> 0){
        letters[currentRow*ANSWER_LENGTH+i].classList.add("close");
        map[guessParts[i]]--;

    }else{
        letters[currentRow*ANSWER_LENGTH+i].classList.add("wrong");

    }
}

    currentRow++;
    if(currentGuess=== word){
        alert("you win!");
        document.querySelector(".brand").classList.add("winner");
        done = true
        return
        }
        else if(currentRow === ROUNDS){
            alert(`You lost, the  word was ${word}`)
            done = true;
            }
        currentGuess = '';
}

function backspace(){
  currentGuess = currentGuess.substring(0,currentGuess.length - 1);
  letters[ANSWER_LENGTH*currentRow + currentGuess.length].innerText = "";  
}

function markInvalidWord(){
for(let i = 0; i<ANSWER_LENGTH; i++){
    letters[currentRow*ANSWER_LENGTH + i].classList.remove("invalid")
setTimeout( function () {
    letters[currentRow*ANSWER_LENGTH + i].classList.add("invalid")
}, 10);
}
}

    document.addEventListener('keydown', function handleKeyPress (event){
if(done || isLoading){
    return;
}

        const action = event.key;
        // console.log(action);
        if(action === 'Enter'){
            commit();
        }
        else if(action === "Backspace"){
            backspace();
        }
        else if(isLetter(action)){
            addLetter(action.toUpperCase());
        }
        else{
// 
        }
    })

}

function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading){
    loadingDiv.classList.toggle("hidden", !isLoading);
}


function makeMap(array){
    const obj = {};
    for(let i= 0;i<array.length; i++){
        const letter = array[i];
        if(obj[letter]){
            obj[letter]++;
        }else{
            obj[letter] = 1;
        }
    }
    return obj;
}

init();