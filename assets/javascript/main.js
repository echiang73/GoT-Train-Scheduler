// Initialize Firebase
var config = {
  apiKey: "AIzaSyAvmZSPq4xICPs16mWbkWmbOGwmSHAAh-o",
  authDomain: "game-of-thrones-train-schedule.firebaseapp.com",
  databaseURL: "https://game-of-thrones-train-schedule.firebaseio.com",
  projectId: "game-of-thrones-train-schedule",
  storageBucket: "game-of-thrones-train-schedule.appspot.com",
  messagingSenderId: "801680752075"
};
firebase.initializeApp(config);

var database = firebase.database();

// Functions ----------------------------------------------------------------------------

// On click button to submit new train information
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var timeFirstTrain = moment($("#time-first-train-input").val().trim(), "HH:mm").format("HH:mm A");
  var frequency = $("#frequency-input").val().trim();

  var newInput = {
    trainName: trainName,
    destination: destination,
    timeFirstTrain: timeFirstTrain,
    frequency: frequency
  };
  database.ref().push(newInput);

  console.log(newInput.trainName);
  console.log(newInput.destination);
  console.log(newInput.timeFirstTrain);
  console.log(newInput.frequency);

  alert("New train successfully added");

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-first-train-input").val("");
  $("#frequency-input").val("");
});


// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var timeFirstTrain = childSnapshot.val().timeFirstTrain;
  var frequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(destination);
  console.log("Firebase - 1st Train Time is: " + timeFirstTrain);
  console.log(frequency);

  var currentTime = (moment().format("hh:mm A"));
  console.log("The current time is: " + currentTime);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var timeFirstTrainConverted = moment(timeFirstTrain, "HH:mm").subtract(1, "years");
  console.log(timeFirstTrainConverted);

  // Difference between the times
  var diffTime = moment().diff(moment(timeFirstTrainConverted), "minutes");
  console.log("Difference in time: " + diffTime);

  // Time apart (remainder)
  var timeRemainder = diffTime % frequency;
  console.log(timeRemainder);

  // Minutes Until Train
  var minutesTillTrain = frequency - timeRemainder;
  console.log("Minutes until train: " + minutesTillTrain);

  // Next Train
  var nextTrain = moment().add(minutesTillTrain, "minutes");
  console.log("Arrival time: " + moment(nextTrain).format("hh:mm A"));

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(moment(nextTrain).format("hh:mm A")),
    $("<td>").text(minutesTillTrain)
  );

  // Append the new row to the table
  $("#schedule-display > tbody").append(newRow);

}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

$("#current-time").text("Current date and time: " + moment().format("dddd, MMMM Do YYYY, hh:mm:ss A"));

// function to refresh display every second
var windowTimeout = setInterval(function () {
  $("#current-time").text("Current date and time: " + moment().format("dddd, MMMM Do YYYY, hh:mm:ss A"));
  $("#schedule-display > tbody").empty();
  console.log("15 sec refresh");
  database.ref().on("child_added", function(childSnapshot) {
  
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var timeFirstTrain = childSnapshot.val().timeFirstTrain;
  var frequency = childSnapshot.val().frequency;

  var currentTime = (moment().format("hh:mm A"));
  var timeFirstTrainConverted = moment(timeFirstTrain, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(timeFirstTrainConverted), "minutes");
  var timeRemainder = diffTime % frequency;
  var minutesTillTrain = frequency - timeRemainder;
  var nextTrain = moment().add(minutesTillTrain, "minutes");

  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(moment(nextTrain).format("hh:mm A")),
    $("<td>").text(minutesTillTrain)
  );
  $("#schedule-display > tbody").append(newRow);
  });
}, 1000 * 1);
