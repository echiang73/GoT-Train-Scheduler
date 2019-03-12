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

  alert("New train successfully added");

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-first-train-input").val("");
  $("#frequency-input").val("");
});

// function to refresh display every 0.1 second and add child
var windowTimeout = setInterval(function () {
  $("#current-time").text("Current date and time: " + moment().format("dddd, MMMM Do YYYY, hh:mm:ss A"));
  $("#schedule-display > tbody").empty();

  // Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function (childSnapshot) {
    // console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var timeFirstTrain = childSnapshot.val().timeFirstTrain;
    var frequency = childSnapshot.val().frequency;

    var currentTime = (moment().format("hh:mm A"));

    // First Time (pushed back 1 year to make sure it comes before current time)
    var timeFirstTrainConverted = moment(timeFirstTrain, "HH:mm").subtract(1, "years");

    // Difference between the times
    var diffTime = moment().diff(moment(timeFirstTrainConverted), "minutes");

    // Time apart (remainder)
    var timeRemainder = diffTime % frequency;

    // Minutes Until Train
    var minutesUntilTrain = frequency - timeRemainder;

    // Next Train
    var nextTrain = moment().add(minutesUntilTrain, "minutes");

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(moment(nextTrain).format("hh:mm A")),
      $("<td>").text(minutesUntilTrain)
    );

    // Append the new row to the table
    $("#schedule-display > tbody").append(newRow);

  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  $("#current-time").text("Current date and time: " + moment().format("dddd, MMMM Do YYYY, hh:mm:ss A"));

}, 1000 * 0.1);







// // function to refresh display every 0.1 second
// var windowTimeout = setInterval(function () {
//   $("#current-time").text("Current date and time: " + moment().format("dddd, MMMM Do YYYY, hh:mm:ss A"));
//   $("#schedule-display > tbody").empty();

//   database.ref().on("child_added", function(childSnapshot) {

//   var trainName = childSnapshot.val().trainName;
//   var destination = childSnapshot.val().destination;
//   var timeFirstTrain = childSnapshot.val().timeFirstTrain;
//   var frequency = childSnapshot.val().frequency;

//   var currentTime = (moment().format("hh:mm A"));
//   var timeFirstTrainConverted = moment(timeFirstTrain, "HH:mm").subtract(1, "years");
//   var diffTime = moment().diff(moment(timeFirstTrainConverted), "minutes");
//   var timeRemainder = diffTime % frequency;
//   var minutesTillTrain = frequency - timeRemainder;
//   var nextTrain = moment().add(minutesTillTrain, "minutes");

//   var newRow = $("<tr>").append(
//     $("<td>").text(trainName),
//     $("<td>").text(destination),
//     $("<td>").text(frequency),
//     $("<td>").text(moment(nextTrain).format("hh:mm A")),
//     $("<td>").text(minutesTillTrain)
//   );
//   $("#schedule-display > tbody").append(newRow);
//   });
// }, 1000 * 0.1);
