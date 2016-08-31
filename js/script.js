
try { 
	var token = GLOBAL_TOKEN
}
catch (e) {
	var token = ''
}

var myUserUrl = 'https://api.github.com/users/floresnathaniel83'
var myRepoUrl = 'https://api.github.com/users/floresnathaniel83/repos'
var params = {
	access_token: token

}

var genParamString = function(paramObject) {
 	if(token !== " ") {
	   	var pString = "?"
	    	for (var key in paramObject) {
	    		pString += key + "=" + paramObject[key] + "&" 
	     	}

	     	return pString.substr(0,pString.length - 1)

 		} else {

 			return token

 		} 
}

var myFullUserUrl = myUserUrl + genParamString(params)
var myFullRepoUrl = myRepoUrl + genParamString(params)

var gitHubQuery = function(loginInput) {

	var promiseProfileUrlRoot = "https://api.github.com/users/"

	var promiseProfileUrlFull = promiseProfileUrlRoot + loginInput + genParamString(params)
	var repoUrlFull = promiseProfileUrlRoot + loginInput + "/repos" + genParamString(params)

	var searchProfilePromise = $.getJSON(promiseProfileUrlFull)
	var searchRepoPromise = $.getJSON(repoUrlFull)

	searchProfilePromise.then(profileDataHandler)
	searchRepoPromise.then(repoDataHandler)

}

var inputNode = document.querySelector('input[type="text"]')

var handleGitHubSearch = function (eventObj) {
	if(eventObj.keyCode === 13) {
		var inputElement = eventObj.target
		var inputValue = inputElement.value
		gitHubQuery(inputValue)
		inputElement.value = ""
	}
}

inputNode.addEventListener('keydown', handleGitHubSearch)

var updatedLast = function(repoUpdateTime) {

	var timeNow = new Date()
	var timeThen = new Date(repoUpdateTime)
	var timeDiff = timeNow - timeThen
    
    var seconds = Math.floor(timeDiff/1000) + " second"
    var minutes = Math.floor(timeDiff/(1000 * 60)) + " minute"
    var hours = Math.floor(timeDiff/(1000 * 60 * 60)) + " hour"
    var days = Math.floor(timeDiff/(1000 * 60 * 60 * 24)) + " day"
   	var months = Math.floor(timeDiff/(1000 * 60 * 60 * 24 * 30)) + " month"
    var years = Math.floor(timeDiff/(1000 * 60 * 60 * 24 * 30 * 12)) + " year"
    
    var timeArray = [years, months, days, hours, minutes, seconds]

    for(var i = 0; i < timeArray.length; i++) {
    	if (parseInt(timeArray[i]) !== 0) {
            
            if(parseInt(timeArray[i]) >= 2) {
            	return "Updated about " + timeArray[i] + "s ago"
            }
            else if (parseInt(timeArray[i]) < 2) {
                return "Updated about " + timeArray[i] + " ago"
            }
        }
        
    }
       
}

var userPromise = $.getJSON(myFullUserUrl)

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

		if (avatar_url !== null) {
			htmlString += "<img src = ' " + avatar_url + "'/>"			

		}

		htmlString += '<div class = "userInfo">'
		if (fullName !== null) {
			htmlString += "<h1 id = 'fullName'>" + fullName + "</h1>"

		}
		

		if (login !== null) {
			htmlString += "<h3 id = 'loginName'>" + login + "</h3>"

		}
		
		htmlString += '</div>'
	
		
		if (location !== null) {
			htmlString += '<div>'
			htmlString += "<i class='fa fa-map-marker' aria-hidden='true'></i><span id = 'location'>" + location + "</span>"
			htmlString += '</div>'
		}

		if (blog !== null) {
			htmlString += '<p id = "blog"><a href="' + blog + '">' + blog + '</a></p>'
		}

		if (email !== null) {
			htmlString += '<div>'
			htmlString += "<i class='fa fa-envelope-o' aria-hidden='true'></i><span id = 'email'><a href=mailto:' + email + '>" + email + "</a></span>"
			htmlString += '</div>'
			
		}

		htmlString += '<div>'
		htmlString += "<i class='fa fa-clock-o' aria-hidden='true'></i><span id = 'createdAt'> Joined on" + created_at + "</span>" 
		htmlString += '</div>'
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

userPromise.then(profileDataHandler)

var repoPromise = $.getJSON(myFullRepoUrl)
		
var repoDataHandler = function (repoArray) {

	var repoCards = " "
	for (var i = 0; i < repoArray.length; i++) {
		var repObj = repoArray[i],
					name = repObj.name,
					repoUrl = repObj.html_url,
					repoLang = repObj.language,
					repoForks = repObj.forks_count
					repoStars = repObj.stargazers_count
					repoUpdate = repObj.updated_at


		repoCards += '<div class="repoCard">'
		repoCards += 	'<div class="repo-info">' 
		repoCards += 		'<a class="name" href="' + repoUrl + '">' + name + '</a>'
		repoCards += 		'<p class="repo-date">' + updatedLast(repoUpdate) + '</p>'
		repoCards += 	'</div>'
		repoCards += 	'<div class="repo-meta">'
		if(repoLang !== null) {
			repoCards += '<span>' + repoLang + '</span>'

		}

		repoCards +=		'<span><i class="fa fa-code-fork" aria-hidden="true"></i>' + ' ' + repoForks + '</span>'
		repoCards +=		'<span><i class="fa fa-star" aria-hidden="true"></i>' + ' ' + repoStars + '</span>'		
		repoCards +=	'</div>'
		repoCards += '</div>'
	}
	
	var rightContainer = document.querySelector('#rightCol')
	rightContainer.innerHTML = repoCards
}

repoPromise.then(repoDataHandler)