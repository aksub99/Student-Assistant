'use strict';
process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

//definition of map to store timetable
var map = new Array(7);
for (var i = 0; i < 7; i++) {
  map[i] = new Array(24);
}

//initialisation of map
for(var i=0;i<7;i++)
{
	for(var j=0;j<24;j++)
	{
		map[i][j]="0";
	}
}

//initialising action name variables
const NAME_ACTION1='classattime';
const NAME_ACTION2='class/tomorrow';
const NAME_ACTION3='now/next';

//initialising data type names for parameters
const now_or_next ='nownext';
const morning_evening ='timeofday';
const tomorrow ='any';
const time ='number';

exports.Akshay = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

//timetable definition
map[1][9]="Tutorial of Mechanical Engineering Drawing";
map[1][12]="Tutorial of Maths";
map[1][15]="Lecture of Structural Metallurgy";
map[1][16]="Lecture of Mechanical engineering Drawing";
map[1][17]="Lecture of Maths";
map[2][11]="Tutorial of Structural Metallurgy";
map[2][12]="Tutorial of Thermodynamics and Kinetics";
map[2][15]="Lecture of Chemistry";
map[2][16]="Lecture of Thermodynamics";
map[2][17]="Lecture of Maths";
map[3][9]="Tutorial of Mechanical Engineering Drawings";
map[3][14]="Lecture of Chemistry";
map[3][15]="Lecture of Structural Metallurgy";
map[4][9]="Metallography Lab";
map[4][15]="Lecture of Thermodynamics and Kinetics";
map[4][16]="Lecture of Mechanical Engineering Drawing";
map[4][17]="Lecture of Maths";
map[5][11]="Lab of Chemistry";
map[5][14]="Lecture of Chemistry";
map[5][15]="Lecture of Structural Metallurgy";
map[5][16]="Lecture of Thermodynamics and Kinetics";


//function to return class from time
function get_class_from_time(app)
{
  var d = new Date();
  d.setHours(d.getHours() + 5);
  d.setMinutes(d.getMinutes() + 30);
  var N = d.getDay();
  var n = d.getHours();
  var t = d.getMinutes();
	 
  let number=app.getArgument(time);
  let timeofday=app.getArgument(morning_evening);
 
  if(timeofday=="morning" && map[N][+number]!="0" )
  app.tell('You have '+map[N][+number]+' at ' + number +" O' Clock." );
  else if(timeofday=="evening" && map[N][+number+(+12)]!="0")
  app.tell('You have '+map[N][+number + (+12)]+' at ' + number+" O' Clock.");
  
  else{
  	  app.tell("You don't have any class at "+number+" O' Clock." );
      }		  
}


//function to return class when now/next are specified

function now_or_next_class(app)
{
	var d = new Date();
	d.setHours(d.getHours() + 5);
	d.setMinutes(d.getMinutes() + 30);
	var N = d.getDay();
	var n = d.getHours();
	var t = d.getMinutes();
	//app.tell(n);
	let nownext=app.getArgument(now_or_next);
	if(nownext=="now")
	{
		if(map[N][n]!="0")
		{
			app.tell('You have '+map[N][n]+' now. Hurry!');
		}
		else
		{
			app.tell("No worries.You don't have any class now.");
		}
	}
	if(nownext=="next")
	{
			for(var i=n+1;;i++)
			{
				if(i==24)
				{
					app.tell("You don't have any more tasks for the day.");
					break;
				}

				if(map[N][i]!="0")
				{
					app.tell('The next class you have is '+map[N][i]+' at '+i+" O'Clock");
					break;
				}
			}
		
	}


}

//function that returns class at given time tomorrow
function get_class_tomorrow(app)
{
  var d = new Date();
  d.setHours(d.getHours() + 5);
  d.setMinutes(d.getMinutes() + 30);
  var N = d.getDay();
  var n = d.getHours();
  var t = d.getMinutes();
	 
  let number=app.getArgument(time);
  let timeofday=app.getArgument(morning_evening);
  let any=app.getArgument(tomorrow);
 
  if(timeofday=="morning" && map[+N+1][+number]!="0" )
  app.tell('You have '+map[+N+1][+number]+' at ' + number +" O' Clock." );
  else if(timeofday=="evening" && map[+N+1][+number+(+12)]!="0")
  app.tell('You have '+map[+N+1][+number + (+12)]+' at ' + number+" O' Clock.");
  
  else{
  	  app.tell("You don't have any class at "+number+" O' Clock." );
      }		  
}



//mapping action names to functions

let actionMap = new Map();
  actionMap.set(NAME_ACTION1, get_class_from_time);
  actionMap.set(NAME_ACTION2, get_class_tomorrow);
  actionMap.set(NAME_ACTION3, now_or_next_class);
  
  app.handleRequest(actionMap);
  });