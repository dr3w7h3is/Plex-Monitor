// Creates time system
var currentDate = new Date();
var dd = currentDate.getDate();
var mm = currentDate.getMonth() + 1;  //January == 0
var yyyy = currentDate.getFullYear();
var nextdd = dd + 7;
// Function to get stats for webpage
async function getStats() {
    // Get JSON files needed
    var userjson = await getUser();
    var countjson = await getCount();
    var tvjson = await getJSON();
    var moviejson = await getNew();
    var qjson = await getStatus();
    var spaceStat = await getSysSpace();
    // Starts calling functions to build
    buildTiles(userjson, countjson);
    buildQueue(qjson);
    buildOutlook(tvjson);
    buildNewAdd(moviejson);
    buildStatusBar(spaceStat);
}
// Builds titles on page to display numnber of movies, tv shows, educational shows, and usernames
function buildTiles(userjson, countjson) {
    // Grabs element ID's
    var movieEl = document.getElementById("movieCount");
    var tvEl = document.getElementById("tvCount");
    var eduEl = document.getElementById("eduCount");
    var userEl = document.getElementById("userCount");
    // Creates new header elements
    var movieh3 = document.createElement("h3");
    var tvh3 = document.createElement("h3");
    var eduh3 = document.createElement("h3");
    var userh3 = document.createElement("h3");
    // assigns values from json file to created elements as text
    movieh3.textContent = countjson.response.data[2].count;
    tvh3.textContent = countjson.response.data[4].count;
    eduh3.textContent = countjson.response.data[0].count;
    userh3.textContent = userjson.response.data.length - 1;
    // Append h3 element to elements from id on html
    movieEl.appendChild(movieh3);
    tvEl.appendChild(tvh3);
    eduEl.appendChild(eduh3);
    userEl.appendChild(userh3);
}
// Creates table for queue shows
function buildQueue(qjson) {
    var queTV = document.getElementById("queue");
    var qTbl = document.createElement("table");
    var qTblBody = document.createElement("tbody");
    for (var i = 0; i < qjson.length; i++) {
        var qRow = document.createElement("tr");
        var qCone = document.createElement("td");
        var qFont = document.createElement("i");
        var hasFile = qjson[i].episode.hasFile;
        var tracked = qjson[i].episode.monitored;
        // Logic to create different color icon for element
        if (tracked === false) {
            qFont.setAttribute("class", "fa fa-tv w3-large w3-text-blue");
        } else if (hasFile === false && tracked === true) {
            qFont.setAttribute("class", "fa fa-tv w3-large w3-text-purple");
        } else if (hasFile === true) {
            qFont.setAttribute("class", "fa fa-tv w3-large w3-text-green");
        }
        qCone.appendChild(qFont);
        var qCtwo = document.createElement("td");
        qCtwo.textContent = (qjson[i].series.title + " - " + qjson[i].episode.title);
        qRow.appendChild(qCone);
        qRow.appendChild(qCtwo);
        qTblBody.appendChild(qRow);
        qTbl.appendChild(qTblBody);
    }
    qTbl.setAttribute("class", "w3-table w3-striped w3-white");
    queTV.appendChild(qTbl);
}
// Create table for soon to come shows
function buildOutlook(tvjson) {
    var newFilm = document.getElementById("newShows");
    var tbl = document.createElement("table");
    var tblbody = document.createElement("tbody");
    for (var i = 0; i < tvjson.length; i++) {
        var row = document.createElement("tr");
        var cellOne = document.createElement("td");
        var cellTwo = document.createElement("td");
        var cellThree = document.createElement("td");
        var cellFour = document.createElement("td");
        cellOne.textContent = tvjson[i].series.title;
        cellTwo.textContent = tvjson[i].title;
        cellThree.textContent = "s" + tvjson[i].seasonNumber + "E" + tvjson[i].episodeNumber;
        cellFour.textContent = tvjson[i].airDate + " " + tvjson[i].series.airTime;
        row.appendChild(cellOne);
        row.appendChild(cellTwo);
        row.appendChild(cellThree);
        row.appendChild(cellFour);
        tblbody.appendChild(row);
        tbl.appendChild(tblbody);
    }
    tbl.setAttribute("class", "w3-table w3-striped w3-white");
    newFilm.appendChild(tbl); 
}
// Create table for recently add
function buildNewAdd(moviejson) {
      var newFilm = document.getElementById("newAdd");
      var tbl = document.createElement("table");
      var tblbody = document.createElement("tbody");
      for (var i = 0; i < moviejson.response.data.recently_added.length; i++) {
          var row = document.createElement("tr");
          var cellOne = document.createElement("td");
          var fontA = document.createElement("i");
          fontA.setAttribute("class", "fa fa-tv w3-text-green w3-large");
          cellOne.appendChild(fontA);
          var cellTwo = document.createElement("td");
          cellTwo.textContent = moviejson.response.data.recently_added[i].full_title;
          row.appendChild(cellOne);
          row.appendChild(cellTwo);
          tblbody.appendChild(row);
          tbl.appendChild(tblbody);
      }
      tbl.setAttribute("class", "w3-table w3-striped w3-white");
      newFilm.appendChild(tbl);
}
 // Creates progress bar for storage space available
function buildStatusBar(spaceStat) {
    var spaceElement = document.getElementById("storage");
    var spaceDiv = document.createElement("div");
    spaceDiv.setAttribute("class", "w3-container w3-center w3-padding w3-red");
    var freeSpace = spaceStat[0];
    var totalSpace = spaceStat[1];
    var usedSpace = totalSpace - freeSpace;
    var usedSpace = Math.floor((usedSpace / totalSpace) * 100);
    spaceDiv.setAttribute("style", "width:" + usedSpace + "%");
    spaceDiv.textContent = usedSpace + "%";
    spaceElement.appendChild(spaceDiv);
}

// Function to get usernames
async function getUser() {
    const response = await fetch('http://68.7.7.158:8181/api/v2?apikey=*************************&cmd=get_user_names');
    const json = await response.json();
    return json;
} 
// Function get number of users
async function getCount() {
    const response = await fetch('http://68.7.7.158:8181/api/v2?apikey=*************************&cmd=get_libraries');
    const json = await response.json();
    return json;
}
// Function to get Newly added
async function getNew() {
    const response = await fetch('http://68.7.7.158:8181/api/v2?apikey=*************************&cmd=get_recently_added&count=6&section_id=1');
    const json = await response.json();
    return json;
}
// Grabs info for diskspace responds with 2 messages freeSpace and totalSpace    
async function getSysSpace() {
    const response = await fetch('http://68.7.7.158:8989/api/diskspace?apikey=*************************');
    const json = await response.json();
    return [json[0].freeSpace, json[0].totalSpace];
}
// Grabs info for shows on comming week
async function getJSON() {
    const response = await fetch('http://68.7.7.158:8989/api/calendar?apikey=*************************&start=' 
        + yyyy + '-' + mm + '-' + dd + '&end=' + yyyy + '-' + mm + '-' + nextdd);
    const json = await response.json();
    return json;
} 
// Grabs info for status of downloading shows
async function getStatus() {
    const response = await fetch('http://68.7.7.158:8989/api/queue?apikey=*************************');
    const json = await response.json();
    return json;
}               