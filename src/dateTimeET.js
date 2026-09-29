const dateFormattedET = function(monthType) {
	let timeNow = new Date();
	let dateNow = timeNow.getDate();
	let monthNow = timeNow.getMonth();
	let yearNow = timeNow.getFullYear();

	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	const monthFolkNames = ["näärikuu", "küünlakuu", "paastukuu", "jürikuu", "lehekuu", "jaanikuu", "heinakuu", "lõikuskuu", "mihklikuu", "viinakuu", "talvekuu", "jõulukuu"];
	
	if(monthType == 0){
		return dateNow + ". " + monthNamesET[monthNow] + " " + yearNow;
	} 
	else if(monthType == 1) {
		return dateNow + ". " + monthFolkNames[monthNow] + " " + yearNow;
	}
	else{
		return "Vajalik on valida parameeter";
	}

	//return dateNow + ". " + monthNamesET[monthNow] + " " + yearNow;
}

const timeFormattedET = function(){
//function timeFormattedET(){
	let timeNow = new Date();
	let hourNow = timeNow.getHours();
	let minuteNow = timeNow.getMinutes();
	let secondNow = timeNow.getSeconds();

	if(minuteNow <=9){
		minuteNow = "0" + minuteNow;
	}

	if(secondNow <=9){
		secondNow = "0" + secondNow;
	}
	
	//console.log(timeNow);
	return hourNow + ":" + minuteNow + ":" + secondNow;
	
}

const getDayNames = function(){
	const dayNames = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev", "pühapäev"];
	let dayNow = new Date().getDay();

	return dayNames[dayNow];
}

//ekspordin kõik funkstsioonid koos mugavamate nimedega
module.exports = {time: timeFormattedET, date: dateFormattedET, day: getDayNames};