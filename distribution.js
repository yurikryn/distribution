"use script";
function createRandomGenerator( { prob , number } ){// ГВЧ "n" з імов. "prob(n)", n = 0...number - 1 ;
	// start[k]; thresholds[n], invSteps[n], n = 0...number-1
	const startLength = 10000;
	const start = [];
	const invSteps = [];
	const thresholds = [];
	{	
		thresholds[0] = 0;
		let i = k = 0;
		for( let stepsSum = 0, stepI; i < number - 1; i++){
			stepI = prob(i);
			stepsSum += stepI;
			invSteps[i] = 1 / stepI;
			thresholds[i + 1] = stepsSum;
			while( k < thresholds[i + 1] * startLength ){
			start.push(i); k++;
			}
		}
		invSteps[number - 1] = 1 / ( 1 - thresholds[number - 1]);
		while( k < startLength ){
			start.push(i); k++;
		}
	}
	{//---- ALERTS -----------------------------------------------
	if(start.length !== startLength){
		alert("start.length  === " + start.length + "!== " + startLength)}
	if(thresholds.length !== number){
		alert("thresholds.length !== " + number)}
	if(invSteps.length !== number){
		alert("invSteps.length !== " + number)}}
	//----- Випадковий розподіл чисел n в межах 0...number-1 ---------
	return function F(){
		F.count = F.count || 0;
		let count = 0;
		const x = Math.random();
		let n = start[Math.floor(x * startLength)];
		let dn = 0;
		do{	n += dn;
			n = (n < 0)? 0: (n > number - 1)? number - 1: n;
			dn = Math.floor( invSteps[n] * (x - thresholds[n]) );
			count++;
		} while(dn !== 0);
		F.count = Math.max(count, F.count);
		return n;
	}
}
function createText( randomWordGen, randomSentenceLengthMines1Gen, N){// Вихідний текст;
	let output = [];
	for( var wordNumber = 0, sentenceNumber = 0; wordNumber < N; sentenceNumber++){
		let currentSentenceLength = randomSentenceLengthMines1Gen();
		for(let j = 0; j <= currentSentenceLength; j++, wordNumber++){
			output.push(" " + randomWordGen());
		}
		output.push("\n");
	}
	console.log("Макс. кількість кроків пошуку слів: " + randomWordGen.count);
	console.log("Макс. кількість кроків пошуку речень: " + randomSentenceLengthMines1Gen.count);
	console.log("Кількість слів у тексті: " + wordNumber);
	console.log("Кількість речень у тексті: " + sentenceNumber);
	console.log("done");
	return output.join("");
}

const PoissonDistr = function(a,b,W){// Розподіл Пуассона обсягу W, n = 0 ... W-2;
	function factorial(m){
		factorial.store = ( m > 0 )? factorial.store * m: 1;
		return factorial.store;
	}
	return {	
		prob: (n) => a * Math.exp(Math.log(a + b * n) * (n - 1) - a - b * n) / factorial(n),
		number: W
	};
};

const ZipfDistr = function(V){// Розподіл Ціпфа обсягу V, n = 0 ... V-1; 
	let sum = 0;
	for(let j = 1 ; j <= V; j++){
		sum += 1 / j;
	}
	C = 1 / sum;
	return {
		prob: (n) => C / (n+1),
		number: V
	};
};
const HomogeneousDistr = function(V){// Розподіл рівномірний обсягу V, n = 0 ... V-1; 
	return {
		prob: (n) => 1 / V,
		number: V
	};
};
const modifiedZipfDistr = function(ratio,V){// Розподіл не зовсім Ціпфа обсягу V, n = 0 ... V-1;
	const maxR = Math.floor( V * ratio );
	let sum = 0;
	for(let j = 1 ; j <= maxR; j++){
		sum += 1 / j;
	}
	sum += ( V - maxR ) / maxR;
	C = 1 / sum;
	return {
		prob: (n) => (n < maxR)? C / (n+1): C / maxR,
		number: V
	};
};
const modifiedZipfDistr2 = function(N,ratio,V){// Розподіл не зовсім Ціпфа обсягу V, n = 0 ... V-1;
	const maxR = Math.floor( V * ratio );
	let sum = 0;
	for(let j = 1 ; j <= maxR; j++){
		sum += 1 / j;
	}
	C = ( N - ( V - maxR ) ) / sum;
	console.log(C);
	console.log(maxR);
	console.log(C/maxR);
	return {
		prob: (n) => (n < maxR)? C / (n+1) / N: 1 / N,
		number: V
	};
};
const realDistr = function(input){// Розподіл  обсягу V, n = 0 ... V-1; 
	let sum = 0;
	for(let i = 0 ; i < input.length; i++){
		sum += input[i];
	}
	C = 1 / sum;
	return {
		prob: (n) => C * input[n],
		number: input.length
	};
};

const N = 69936; // Приблизна кількість слів у тексті;

const V = 9724;// Обсяг словника;
//const randomWordGen = createRandomGenerator(ZipfDistr(V));// 0...V - 1;
//const randomWordGen = createRandomGenerator(HomogeneousDistr(V));// 0...V - 1;
//const randomWordGen = createRandomGenerator(modifiedZipfDistr(0.67,V));// 0...V - 1;
//const randomWordGen = createRandomGenerator(modifiedZipfDistr2(N,0.50,V));// 0...V - 1;
//const randomWordGen = createRandomGenerator(realDistr(input));// 0...V - 1;

const W = 100;// Максимальна довжина речення;
const a = 2.417;
const b = 0.635;
const randomSentenceLengthMines1Gen = createRandomGenerator(PoissonDistr(a,b,W));// 0...W - 1;

const output = createText( randomWordGen, randomSentenceLengthMines1Gen, N);
document.getElementById("view").innerText = output;

