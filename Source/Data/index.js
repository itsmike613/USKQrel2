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
		"e": "",
		"o": [
			{ "t": "Kamala D. Harris", "i": "", "w": 0.1 },
			{ "t": "Mike R. Pence", "i": "", "w": 0 },
			{ "t": "JD Vance", "i": "", "w": 1 },
			{ "t": "Dick B. Cheney", "i": "", "w": 0 }
		]
	},
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
	}
];