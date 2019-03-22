//1. Create and assign variables & retrieve the necessary HTML elements 
var record = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var imgRec = [];
var rand; 
var flipIndex = 0; 
var cardTextRec = [];
var cardRec = [];
var cardNum;
var front; 
var back; 
var cardChk = 0; 
var correct = 0; //score 

var memory = document.getElementById("game");
var timer = document.getElementById("timer");
var scoreEl = document.getElementById("score");
var newGame; 
var result = document.getElementById('result');
var opacityD = document.getElementById("opacityD");
var h1Res = document.getElementById("h1Res");
var pRes = document.getElementById("pRes");

var status = 0; 
var countDown; 
var secsInput = 60; 
var seconds = secsInput; 
var gameOver = false; 

//2. Make the flipping work 
memory.addEventListener("click",function(e) {
	var el = e.target.parentElement;
	var numId = el.id;
	if(Number.isInteger(parseInt(numId.replace("back",""),10))) {
		cardClick(el.parentElement.id);
	}
	else {
		cardClick(numId);
	}
});

function cardClick(cardId) {
	cardNum = cardId.replace("card",""); //"1", "2"
	cardNum = parseInt(cardNum,10); //1, 2
	
	//if conditions - game is over, record value of the card is 0, see if card is checked 
	if(record[cardNum-1] == 0 && cardChk == 0 && gameOver == false) {
		//Do the actul flipping 
		front = document.getElementById("front" + cardNum); //"front" + 1 -> "front1"
		back = document.getElementById("back" + cardNum);
		front.style.transform = "rotateY(-180deg)";
		back.style.transform = "rotateY(0deg)";
		
//3. Basic game - no randomization, no timer, just flipping, comparing and alert box for result 
		//change data of variables, compare the 2 flipped cards, display result etc
		cardTextRec.push(back.innerHTML); //['<img src="images/img1.png">','<img src="images/img3.png">']
		cardRec.push(cardNum); //[1,2]
		
		flipIndex++;
		record[cardNum-1] = 1;
		
		if(flipIndex == 2) {
			//comparison
			if(cardTextRec[0] == cardTextRec[1]) {
				correct++;
				scoreEl.innerHTML = "Score: " + correct; //Score: 1
				cardRec = [];
				cardTextRec = [];
				flipIndex = 0;
				
				if(correct == 10) {
					//STOP TIMER CALL HERE
					clearTimeout(countDown);
					//display result and stop game 
					setTimeout(function(){displayResult();},600); //delay the display of result by 600 milliseconds
				}
				return;
			}
			else {
				//flip back because they're not the same
				cardChk = 1;
				//call the flipBack functio at a time delay of 600 milliseconds 
				setTimeout(function(){flipBack();},600);
				return;
			}
		}
	}
	
	if(gameOver == true) {
		alert("Game is over. Click on the New Game button to start a new game");
	}
}

function flipBack() {
	front = document.getElementById("front" + cardRec[0]);
	back = document.getElementById("back" + cardRec[0]);
	front.style.transform = "rotateY(0deg)";
	back.style.transform = "rotateY(180deg)";
	
	front = document.getElementById("front"+cardRec[1]);
	back = document.getElementById("back"+cardRec[1]);
	front.style.transform = "rotateY(0deg)";
	back.style.transform = "rotateY(180deg)";
	
	record[cardRec[0]-1] = 0;
	record[cardRec[1]-1] = 0;
	cardTextRec= [];
	cardRec = [];
	flipIndex = 0;
	cardChk = 0;
}

//4. Make new game button work 
newGame = document.getElementById("new");
newGame.addEventListener("click",newClick);

function newClick() {
	window.location.reload();
}

//5. Randomize the game boxes on loading - also create images.js file here
function newBoard() { //called on window load 
	for(var i=0; i<20; i++) {
		if(i==0) {
			//Math.random -> 0 to 1 => 0.999 * 20 - round(8.6) - 9, round(8.4) - 8, 19.99 - 20
			rand = Math.round(Math.random() * images.length);
			while(rand == images.length) {
				rand = Math.round(Math.random() * images.length);
			}
			imgRec[i] = rand; //[4,0,7,3,12], i = 4
		}
		else { //generate unique random values - not in imgRec array 
			while(status == 0) {
				rand = Math.round(Math.random() * images.length); //12
				if(rand !== images.length) {
					for(var j=0; j<imgRec.length; j++) {
						if(rand == imgRec[j]) { // 3 == 12
							break;
						}
						else if(j == imgRec.length - 1) { // 3 == 3
							status = 1;
							imgRec[i] = rand;
						}
					}
				}
			}
		}
		status = 0;
		document.getElementById("back" + (i+1)).innerHTML = images[rand]; 
	}
	//CALL THE TIMER 
	startTimer(seconds);
}

//6. Create timer 
function startTimer(secs) {
	timer.innerHTML = "00:" + secs; //00:00
	
	if(secs == 0) {
		//stop the time out and stop the function as well 
		clearTimeout(countDown);
		setTimeout(function(){displayResult();},800);
		timer.innerHTML = "00:00";
		return;
	}
	
	secs--; //0
	//recurring function - a function that keeps calling itself with new/updated arguments 
	countDown = setTimeout(function(){startTimer(secs);},1000);
}


//7. Make the fancy display for results 
function displayResult() {
	gameOver = true; 
	
	var width = window.innerWidth;
	opacityD.style.display = "block";
	result.style.display = "block";
	result.style.left = (width/2) - (500/2) + "px"; //"500px"
	result.style.top = 150 + "px";
	
	if(correct == 10) {
		h1Res.innerHTML = "Congratulations! You won!";
		pRes.innerHTML = "You've scored " + correct + " points.";
	}
	else {
		h1Res.innerHTML = "Try again!";
		pRes.innerHTML = "You've scored " + correct + " points.";
	}
}

var okayButton = document.getElementById("okayButton");
okayButton.addEventListener("click",okayClick);

function okayClick() {
	result.style.display = "none";
	opacityD.style.display = "none";
}

//call the new board function on loading 
window.onload = newBoard();


