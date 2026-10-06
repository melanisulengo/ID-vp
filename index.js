const express = require('express');
const app = express();
const dateTimeET = require("./src/dateTimeET");
const fs = require("fs").promises;
const fileFolk = "public/txt/vanasonad.txt";
const regTextRef = "public/txt/visits.txt";
//mooduli post päringute lahti harutamiseks
const bodyParser = require('body-parser');
//moodul andmebaasiga suhtlemiseks(koos asynci osaga)
const mysql = require('mysql2/promise');
//moodul .env keskkonnamuutajate lugemiseks
require('dotenv').config();


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
	const dateNow = dateTimeET.date(0);
	const timeNow = dateTimeET.time();
	try{
		await fs.open(regTextRef, 'a');
		await fs.appendFile(regTextRef, req.body.inputName + ',' + dateNow + ',' + timeNow + ';');
		res.render('regvisit');
	} catch(err){
		console.log(err);
		res.render('regvisit');
	}
});

app.get('/viimanekulastus', async (req, res)=>{
	try{
		const data = await fs.readFile(regTextRef, "utf8");
		let visits = data.split(";");
		let lastVisit = visits[visits.length - 2].split(",");
		res.render('viimanekulastus', {name: lastVisit[0], date: lastVisit[1], time: lastVisit[2]});
	} catch(err){
		console.log(err);
		res.render('vanasona', {name: null, date: null, time: null});
	}
});

app.get('/oppimineTLU', (req, res)=> {
	try {
		res.render('oppimineTLU');
	 } catch {
		console.log(err);
	 }
});

app.get('/eestifilm', (req, res)=> {
	res.render('eestifilm');
});

app.get('/eestifilm/inimesed', async (req, res)=> {
	let conn;
	try{
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		//defineerimine sql päringute
		let sqlReq = 'SELECT * FROM person';
		const [sqlRes] = await conn.execute(sqlReq);
		//console.log(sqlRes);
		res.render('eestifilminimesed', {personList: sqlRes});
	}catch(err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('eestifilminimesed', {personList: []});
	}
	finally {
		if(conn) {
			await conn.end();
		}
	}
});

app.get('/eestifilm/inimesed_lisa', (req, res)=> {
	res.render('eestifilminimesed_lisa', {notice: 'ootan sisendit!'});
});

app.post('/eestifilm/inimesed_lisa', async (req, res)=> {
	console.log(req.body);
	//kontrollime andmeid
	//sisestatud sünnikuupäev tuleb teisendada kuupäevaks
	const bornDate = new Date(req.body.bornInput);
	const timeNow = new Date();
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || isNaN(bornDate.getTime()) || bornDate > timeNow){
		console.log("Andmed pole korrektsed");
		return res.render('eestifilminimesed_lisa', {notice: 'Andmed ei ole korrektsed!'});
	}
	let deceasedDate = null;
	if(req.body.deceasedInput != ''){
		deceasedDate = req.body.deceasedInput;
	}
	let conn;
	try{
		conn = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?, ?, ?, ?)';
		await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			deceasedDate
			]);
		res.render('eestifilminimesed_lisa', {notice: req.body.firstNameInput + ' ' + req.body.lastNameInput + ' ' +  'Andmebaasi lisatud!'});
	} catch(err){
		console.log('Viga andmebaasiga suhtlemisel: ' + err);
		res.render('eestifilminimesed_lisa', {notice: 'Tekkis viga. Andmed ei salvestatud.'});
	} finally {
		if(conn) {
			await conn.end();
		}
	}
	
});

app.listen(5218);
