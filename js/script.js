console.log("hello world")

try { 
	var token = GLOBAL_TOKEN
}
catch (e) {
	var token = ''
}


//https://api.github.com/users/floresnathaniel83
//https://api.github.com/users/floresnathaniel83/repos

var promiseProfileUrlRoot = "https://api.github.com/users/",
	repoUrlRoot = "https://api.github.com/users/",
	profileParams = {
		//login: "floresnathaniel83",
		// name: "Nathaniel Flores",
		// blog: null,
		// location: "Houston, TX",
		// email: "floresnathaniel83@gmail.com",
		// avatar_url: "https://avatars.githubusercontent.com/u/18020008?v=3",
		// html_url: "https://github.com/floresnathaniel83",
		// created_at: "2016-03-23T02:21:11Z",
		// followers: 0,
		// following: 0
	}

	repoParams = {
	}

	if (token) {
		profileParams.access_token = token
		repoParams.access_token = token
	}


var gitHubQuery = function(loginInput) {

	// profileParams.login = loginInput

	var promiseProfileUrlFull = promiseProfileUrlRoot + loginInput + genParamString(profileParams)
	console.log(promiseProfileUrlFull)
	var repoUrlFull = repoUrlRoot + loginInput + "/repos" + genParamString(repoParams)
	console.log(repoUrlFull)

	var profilePromise = $.getJSON(promiseProfileUrlFull)
	var repoPromise = $.getJSON(repoUrlFull)

	profilePromise.then(profileDataHandler)
	repoPromise.then(repoDataHandler)

}


var genParamString = function(paramObject) {
 	
   	var pString = "?"
    for (var key in paramObject) {
    	// if we're looking at the access_token key and its value is empty string,
    	// // skip this iteration
    	// if (key === "access_token" && !paramObject[key]) {
    	// 	continue
    	// }
    	pString += key + "=" + paramObject[key] + "&" 
     }
     return pString.substr(0,pString.length - 1) 

   
}

var profileDataHandler = function (responseObj) {

	var htmlString = " "
	var fullName = responseObj.name,
		login = responseObj.login,
		blog = responseObj.blog,
		location = responseObj.location,
		email = responseObj.email,
		avatar_url = responseObj.avatar_url,
		html_url = responseObj.html_url,
		created_at = new Date(responseObj.created_at).toString().substr(4,12),
		followers = responseObj.followers,
		following = responseObj.following,
		starred_url = responseObj.starred_url
		console.log(starred_url)
			if (blog === null) {
			blog = "not listed"
		}

		htmlString += "<img src = ' " + avatar_url + "'/>"
		htmlString += "<h1 id = 'fullName'>" + fullName + "</h1>"
		htmlString += "<h3 id = 'loginName'>" + login + "</h3>"
		htmlString += "<p id = 'blog'>" + blog + "</p>"
		htmlString += "<p id = 'location'>" + location + "</p>"
		htmlString += "<p id = 'email'>" + email + "</p>"
		htmlString += "<p id = 'createdAt'> Joined on " + created_at + "</p>" 
		htmlString += "<p id = 'html_url'>" + html_url + "</p>"
		htmlString += "<div id = 'followContainer'>"
		htmlString += "<div id = 'followersContainer'>"
		htmlString += "<p id = 'followers'>" + followers + "</p>" 
		htmlString += "<p id = 'followersHeading'>" + "followers" + "</p>"
		htmlString += "</div>"
		htmlString += "<div id = 'followingContainer'>"
		htmlString += "<p id = 'following'>" + following + "</p>" 
		htmlString += "<p id = 'followingHeading'>" + "following" + "</p>"
		htmlString += "</div>"
		htmlString += "</div>"


		var leftContainer = document.querySelector("#leftCol")
		leftContainer.innerHTML = htmlString
}

		
var repoDataHandler = function (repoArray) {

	var repoCards = " "
	for (var i = 0; i < repoArray.length; i++) {
		var repObj = repoArray[i],
					name = repObj.name

		repoCards += '<div class="repoCard">'
		repoCards += '<div class="portrait">' 
		repoCards += 	'<h2 class="name">' + name + '</h2>'
		repoCards += '</div>'
		repoCards += '</div>'
	}
	
	var rightContainer = document.querySelector('#rightCol')
	rightContainer.innerHTML = repoCards
}

var inputNode = document.querySelector('input[type="text"]')

var handleGitHubSearch = function (eventObj) {
	// if enter key is pressed 
	if(eventObj.keyCode === 13) {
		//Extract value that user typed
		var inputElement = eventObj.target
		var inputValue = inputElement.value
		//console.log("here is the input value>>>>" + inputValue)
		//make a custom query  with the input value
		gitHubQuery(inputValue)
		inputElement.value = ""
	}
}

inputNode.addEventListener('keydown', handleGitHubSearch)
















