/*
	Data model
	q = question text
	c = category string
	e = explanation string
	o = options array { t: text, i: image(opt), w: weight (0..1) }
*/

const QUESTIONS = [
	{
		"q": "Who is the current U.S. President (2025)?",
		"c": "Current Presidency",
		"e": "Donald J. Trump serves as the 47th President of the United States, having been inaugurated on January 20, 2025, following his victory in the 2024 presidential election.",
		"o": [
			{ "t": "Joe R. Biden", "i": "https://www.loc.gov/static/portals/free-to-use/public-domain/presidential-portraits/46-joe-biden.png", "w": 0.1 },
			{ "t": "Donald J. Trump", "i": "https://www.whitehouse.gov/wp-content/uploads/2025/01/Donald-J-Trump.jpg", "w": 1 },
			{ "t": "Barack H. Obama", "i": "https://www.loc.gov/static/portals/free-to-use/public-domain/presidential-portraits/44-obama.jpg", "w": 0 },
			{ "t": "George W. Bush", "i": "https://www.loc.gov/static/portals/free-to-use/public-domain/presidential-portraits/43-bush.jpg", "w": 0 }
		]
	},
	{
		"q": "Who is the current U.S. Vice President (2025)?",
		"c": "Current Presidency",
		"e": "JD Vance is the current Vice President of the United States, serving alongside President Donald J. Trump since the 2025 inauguration.",
		"o": [
			{ "t": "Kamala D. Harris", "i": "https://bidenwhitehouse.archives.gov/wp-content/uploads/2025/01/harris-profile-21.png", "w": 0.1 },
			{ "t": "Mike R. Pence", "i": "https://trumpwhitehouse.archives.gov/wp-content/uploads/2017/11/VicePresidentPence-620x620.jpg", "w": 0 },
			{ "t": "JD Vance", "i": "https://www.whitehouse.gov/wp-content/uploads/2025/01/JD-Vance.jpg", "w": 1 },
			{ "t": "Dick B. Cheney", "i": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/46_Dick_Cheney_3x4.jpg/500px-46_Dick_Cheney_3x4.jpg", "w": 0 }
		]
	},
	{
		"q": "What makes Donald J. Trump’s 2025 presidency noteworthy?",
		"c": "Current Presidency",
		"e": "Donald J. Trump’s 2025 term is notable for making him the oldest president ever inaugurated in U.S. history.",
		"o": [
			{ "t": "First president to serve three terms", "i": "", "w": 0 },
			{ "t": "Oldest president ever inaugurated", "i": "", "w": 1 },
			{ "t": "First president born in the 1980s", "i": "", "w": 0 },
			{ "t": "First female president", "i": "", "w": 0 }
		]
	}
];


/*

{
	"q": "",
	"c": "",
	"e": "",
	"o": [
		{ "t": "", "i": "", "w": 0 },
		{ "t": "", "i": "", "w": 0 },
		{ "t": "", "i": "", "w": 0 },
		{ "t": "", "i": "", "w": 0 }
	]
},

*/