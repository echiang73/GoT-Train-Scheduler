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
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
//   var timeFirstTrain = moment($("#time-first-train-input").val().trim(), "HH:mm").format("X");
  var timeFirstTrain = $("#time-first-train-input").val().trim();
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




// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var timeFirstTrain = childSnapshot.val().timeFirstTrain;
  var frequency = childSnapshot.val().frequency;

  // Employee Info
  console.log(trainName);
  console.log(destination);
  console.log(timeFirstTrain);
  console.log(frequency);

  // Prettify the employee start
//   var timeFTPretty = moment.unix(timeFirstTrain).format("HH:mm");

  // Calculate the months worked using hardcore math
  // To calculate the months worked
//   var empMonths = moment().diff(moment(empStart, "X"), "months");
//   console.log(empMonths);

  // Calculate the total billed rate
//   var empBilled = empMonths * empRate;
//   console.log(empBilled);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    // $("<td>").text(nextArrival),
    // $("<td>").text(minutesAway)
  );

  // Append the new row to the table
  $("#schedule-display > tbody").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case
