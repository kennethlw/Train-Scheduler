//database initializing so we can send and receive info
var config = {
    apiKey: "AIzaSyCgiIixISNHqcJosZc8VrMvWfVZJV5WcNg",
    authDomain: "my-awesome-project-df85a.firebaseapp.com",
    databaseURL: "https://my-awesome-project-df85a.firebaseio.com",
    projectId: "my-awesome-project-df85a",
    storageBucket: "my-awesome-project-df85a.appspot.com",
    messagingSenderId: "949105366496"
  };

  firebase.initializeApp(config);


var database = firebase.database();
var trainsRef = database.ref();


var name;
var dest;
var firstTrainTime;
var freq;
var minAway;
var nextArrival;


var newRow = $("<tr>");
var rowName = $("<td>").html(name);
var rowDest = $("<td>").html(dest);
var rowFreq = $("<td>").html(freq);
var rowNextArrival = $("<td>").html(nextArrival);
var rowMinAway = $("<td>").html(minAway);
newRow.append(rowName);
newRow.append(rowDest);
newRow.append(rowFreq);
newRow.append(rowNextArrival);
newRow.append(rowMinAway);
$("#train-info").append(newRow);

//when there is a new child added in the database, update the page info
trainsRef.on("child_added", function(childSnapshot) {

    name = childSnapshot.child("name").val();
    dest = childSnapshot.child("dest").val();
    firstTrainTime = childSnapshot.child("firstTrainTime").val();
    freq = childSnapshot.child("freq").val();
    minAway = childSnapshot.child("minAway").val();
    nextArrival = childSnapshot.child("nextArrival").val();

    var newRow = $("<tr>");
    var rowName = $("<td>").html(name);
    var rowDest = $("<td>").html(dest);
    var rowFreq = $("<td>").html(freq);
    var rowNextArrival = $("<td>").html(nextArrival);
    var rowMinAway = $("<td>").html(minAway);
    newRow.append(rowName);
    newRow.append(rowDest);
    newRow.append(rowFreq);
    newRow.append(rowNextArrival);
    newRow.append(rowMinAway);

    $("#train-info").append(newRow);

});



$("#add-train").on("click", function(event, snapshot) {

    event.preventDefault();

    name = " ";
    name = $("#name-input").val().trim();
    dest = $("#dest-input").val().trim();
    firstTrainTime = $("#time-input").val().trim();
    freq = $("#frequency-input").val().trim();
 

    var firstTimeConverted = moment(firstTrainTime, "HH:mm ").subtract(1, "years");
  //console.log(firstTimeConverted);

    var currentTime = moment();
    //console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm a"));

    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    //console.log("DIFFERENCE IN TIME: " + timeDiff);
    
    var remainder = timeDiff % freq;
    //console.log(remainder);

    var minAway = freq - remainder;
    //console.log("Minutes til: " + minAway);

    var nextArrival = moment().add(minAway, "minutes");
  
    //console.log("next arrival: " + moment(nextArrival).format("HH:mm"));

    var nextArrivalConverted = moment(nextArrival).format("hh:mm a");
  
    //send the information to the database
    trainsRef.push({
    name: name,
    dest: dest,
    firstTrainTime: firstTrainTime,
    freq: freq,
    minAway: minAway,
    nextArrival: nextArrivalConverted
  });

    //clear input fields after user has clicked submitted
   $("#name-input").val("");
   $("#dest-input").val("");
   $("#time-input").val("");
   $("#frequency-input").val("");	
}) 