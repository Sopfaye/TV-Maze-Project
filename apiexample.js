// initialize page after HTML loads
window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload


// get data from TV Maze
function searchTvShows() {
  document.getElementById("main").innerHTML = "";
  
  var search = document.getElementById("search").value;  
    
  fetch('http://api.tvmaze.com/search/shows?q=' + search)
    .then(response => response.json())
    .then(data => showSearchResults(data) 
    );
} // window.onload 
 

// change the activity displayed 
function showSearchResults(data) {
  
  // show data from search
  console.log(data); 
  
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } // for


} // showSearchResults

// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   var g;
   var output = "<ul>";
   for (g in genres) {
      output += "<li>" + genres[g] + "</li>"; 
   } // for       
   output += "</ul>";
   return output; 
} // showGenres

// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
  
    // get the main div tag
    var elemMain = document.getElementById("main");
    
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
    elemDiv.classList.add("showDiv");
    var elemImage = document.createElement("img");
    elemImage.classList.add("elemImage");
    
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
    
    var elemGenre = document.createElement("div");
    elemGenre.classList.add("elemGenre");
    var elemRating = document.createElement("div");
    elemRating.classList.add("elemRating");
    var elemSummary = document.createElement("div");
    elemSummary.classList.add("elemSummary");
    
    // add JSON data to elements
    elemImage.src = tvshowJSON.show.image.medium;
    elemShowTitle.innerHTML = tvshowJSON.show.name;
    
    elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);
    if (tvshowJSON.show.rating.average != null) {
      elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
    }
    if (elemSummary == null || elemSummary == "" || elemSummary == undefined) {
      elemSummary.style.display = "none";
    } else {
      elemSummary.style.display = "block";
    }
    
       
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
    elemDiv.appendChild(elemImage);
    
    // get id of show and add episode list
    var showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
    
    // add this tv show to main
    elemMain.appendChild(elemDiv);
    
} // createTVShow

// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
  
  fetch('http://api.tvmaze.com/shows/' + showId + '/episodes')  
    .then(response => response.json())
    .then(data => showEpisodes(data, elemDiv));
    
} // fetch episodes


// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
  
    // print data from function fetchEpisodes with the list of episodes
    console.log("episodes");
    console.log(data); 
    
    var elemEpisodes = document.createElement("div");  // creates a new div tag
    var output = "<ol>";
    for (episode in data) {
        output += "<li><a href='javascript:showLightBox(" + data[episode].id + ")'>" + data[episode].name + "</a></li>";
    }
    output += "</ol>";
    elemEpisodes.innerHTML = output;
    elemDiv.appendChild(elemEpisodes);  // add div tag to page
        
} // showEpisodes

function showEpisodes (data, elemDiv) {
  
  // print data from function fetchEpisodes with the list of episodes
  console.log("episodes");
  console.log(data); 
  
  var elemEpisodes = document.createElement("div");  // creates a new div tag
  elemEpisodes.classList.add("elemEpisodes");
  var output = "<ol>";
  for (episode in data) {
      output += "<li><a href='javascript:EpisodeInformation(" + data[episode].id + ")'>" + data[episode].name + "</a></li>";
  }
  output += "</ol>";
  elemEpisodes.innerHTML = output;
  elemDiv.appendChild(elemEpisodes);  // add div tag to page
      
} // showEpisodes

// open lightbox and display episode info
function EpisodeInformation(episodeId){
     //use the episodeID to *fetch* the individual
     //episode's info (JSON Data) from the TV maze API
    fetch('https://api.tvmaze.com/episodes/' + episodeId)
    .then(response => response.json())
    .then(data => showLightBox(data));
    
     
     // show episode info in lightbox
     /*document.getElementById("message").innerHTML = "<h3>The episode unique id is " + episodeId + "</h3>";
     document.getElementById("message").innerHTML += "<p>Your job is to make a fetch for all info on this"  
                        + " episode and then to also show the episode image, name, season, number, and description.</p>";
                        */
     
} //Fetch Episode Info

function showLightBox(data){
  let description = data.summary;

  //console log the data
    console.log(data);
    document.getElementById("lightbox").style.display = "block";
    document.getElementById("messageName").innerHTML = "<h1> Episode Name: " + data.name + "</h1>";
    document.getElementById("messageEpisode").innerHTML = "<h2> Episode: " + data.number + "</h2>";
    document.getElementById("messageSeason").innerHTML = "<h3> Season: " + data.season + "</h3>";
    if (data.image == null || data.image == "" || data.image == null) {
      document.getElementById("messageImage").style.display = "none"
    } else {
      document.getElementById("messageImage").style.display = "block";
      document.getElementById("messageImage").innerHTML = '<img id="image" src=" ' + data.image.medium + ' ">'
    }
    if (description == undefined || description == "" || description == null) {
      document.getElementById("messageDescription").style.display = "none";
    } else {
      document.getElementById("messageDescription").style.display = "block";
      document.getElementById("messageDescription").innerHTML = "<p> Description:" + data.summary + "</p>"
    }
    
} // showLightBox

 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";
 } // closeLightBox 






