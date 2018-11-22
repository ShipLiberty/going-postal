const puppeteer = require('puppeteer');											//setup the chrome library for scraping			

const houseURL = 'https://vote-usa.org/officials.aspx?report=u2';

(async () => {
	const browser = await puppeteer.launch({
	headless: false, 															// default is true, this lets us see in action
	//slowMo: 500 																// slow down by 500ms
	});
	const page = await browser.newPage();										
	await page.goto(houseURL);
	let arrayOfReps = await page.evaluate(() => {  								
		let repsArray = [];  													
		let repElements = Array.from(document.querySelectorAll('div.candidate-cell'));   
		repElements.forEach((repElement) => { 											
			let repData = {};
			try {
				//get state and title
				let stateAndTitle = repElement.querySelector('div.cell-heading').innerText;
				let stateAndTitleSplitArray = stateAndTitle.split(' ');
                repData.state = stateAndTitleSplitArray[0];
                repData.title = stateAndTitleSplitArray[1];
                
                //get name and party intial
                let nameAndParty = repElement.querySelector('div.candidate-name span').innerText;
                let nameAndPartySplitArray = nameAndParty.split('-');
                let name = nameAndPartySplitArray[0];
                repData.name = name;
                let partyInitial = nameAndPartySplitArray[1];
                repData.partyInitial = partyInitial;
                
                //get image url
                let repDateImageHTML = repElement.querySelector('div.candidate-image').innerHTML;
                let imageURLSplitArray = repDateImageHTML.split('"');
                repData.imageURL = 'https://vote-usa.org' + imageURLSplitArray[1];

                //get age
                repData.age = repElement.querySelector('div.candidate-age').innerText;
                
                //get website
                repData.website = repElement.querySelector('div.candidate-website span a').getAttribute("href");
            }
            catch (exception){
            }
			repsArray.push(repData); 									
		}); 														
		return repsArray;
	});
	console.log(arrayOfReps);
	await browser.close();												
})();
