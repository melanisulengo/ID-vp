const express = require('express');
const app = express();
const dateTimeET = require("./src/dateTimeET");
const fs = require("fs").promises;
const fileFolk = "public/txt/vanasonad.txt";
const regTextRef = "public/txt/visits.txt";

//mooduli post päringute lahti harutamiseks
const bodyParser = require('body-parser');

//määrame renderdusmootori: ejs
app.set('view engine', 'ejs');
//määrame avalikuna kasutatava kataloogi
app.use(express.static('public'));
//määrame vormide sisu parsimiseks
app.use(bodyParser.urlencoded({extended: false}));

//marsuudid
app.get('/', (req, res)=> {
	const dayNow = dateTimeET.day();
	const dateNow = dateTimeET.date(0);
	const timeNow = dateTimeET.time();
	//res.send('Express.js veeb läks käima');
	res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow});
});

app.get('/vanasona', async (req, res)=>{
	try{
		const data = await fs.readFile(fileFolk, "utf8");
		let folkWisdom = data.split(";");
		res.render('vanasona', {wisdom: folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]});
	} catch(err){
		console.log(err);
		res.render('vanasona', {wisdom: 'Kahjuks ei leidnud ühtegi vanasõna'});
	}
});

app.get('/regvisit', (req, res)=> {
	res.render('regvisit');
});

app.post('/regvisit', async (req, res)=> {
	try{
		await fs.open(regTextRef, 'a');
		await fs.appendFile(regTextRef, req.body.inputName + ';');
		res.render('regvisit');
	} catch(err){
		console.log(err);
		res.render('regvisit');
	}
});

app.listen(5218);
