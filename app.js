var selectedDepartment;
var selectedRole;

document.addEventListener("DOMContentLoaded", function () {
    // Initialize the page when the DOM content is loaded
    initializePage();
});

function initializePage() {
    // Display the initial page when the DOM content is loaded
    document.getElementById("page1").style.display = "block";
    document.getElementById("page2").style.display = "none";
    document.getElementById("page3").style.display = "none";

    // Set up event listeners for department buttons
    var departmentButtons = document.querySelectorAll(".department-buttons button");
    departmentButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectDepartment(button.textContent);
        });
    });

    // Set up event listeners for role buttons
    var roleButtons = document.querySelectorAll(".role-options button");
    roleButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectRole(button.textContent);
        });
    });

    // Set up event listener for the Back button
    var backButton = document.querySelector(".buttons-container button");
    backButton.addEventListener("click", goBack);
}

function selectDepartment(department) {
    selectedDepartment = department;
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
    showSheet();
}

function selectRole(role) {
    selectedRole = role;
    document.getElementById("page2").style.display = "none";
    document.getElementById("page3").style.display = "block";
    document.getElementById("options").style.display = "block";
    generateSheet();

    var saveButton = document.querySelector(".buttons-container button[type='submit']");
    
    if (selectedRole === 'HOD') {
        // If HOD is selected, hide the Save button
        saveButton.style.display = 'none';
    } else {
        // If Staff is selected, show the Save button
        saveButton.style.display = 'block';
    }
}

function showSheet() {
    var date = document.getElementById("date").value;
    var semester = document.getElementById("semester").value;
    var department = selectedDepartment;

    // Fetch data for the selected date and semester from the server
     fetch(`/get-data?date=${date}&semester=${semester}&department=${department}`)
        .then(response => response.json())
        .then(data => {
             var sheetBody = document.getElementById("sheetBody");

            // Clear the sheet
            sheetBody.innerHTML = "";

            // Generate the sheet with input fields
            for (var i = 1; i <= 8; i++) {
                var row = sheetBody.insertRow();
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);

                cell1.innerHTML = i;
                cell2.innerHTML = getTimeLabel(i);

                // Check if data exists for the selected date and semester
                if (data.length > 0) {
                    // Populate the form fields with the retrieved data
                    var entry = data.find(item => item.slNo === i);
                    cell3.innerHTML = `<input type='text' id='staff${i}' value='${entry.staff}'>`;
                    cell4.innerHTML = `<input type='text' id='subject${i}' value='${entry.subject}'>`;
                    cell5.innerHTML = `<textarea id='topic${i}' rows='2'>${entry.topicCovered}</textarea>`;
                } else {
                    // If no data exists, create empty form fields
                    cell3.innerHTML = `<input type='text' id='staff${i}'>`;
                    cell4.innerHTML = `<input type='text' id='subject${i}'>`;
                    cell5.innerHTML = `<textarea id='topic${i}' rows='2'></textarea>`;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert("Failed to fetch data. Please try again.");
        });
}

function generateSheet() {
    // Call the showSheet function after a short delay to allow the DOM to update
    setTimeout(showSheet, 100);
}

function getTimeLabel(index) {
    var timeLabels = ['10:15-11:10am', '11:10-12:05am', 'Break', '1:00-1:55pm', '1:55-2:50pm', '3:00-3:50pm', '3:50-4:40pm', '4:40-5:30pm'];
    return timeLabels[index - 1];
}

function saveData() {
    var dataToSave = [];
    var department = selectedDepartment; // Add this line to get the selected department

    for (var i = 1; i <= 8; i++) {
        var staff = document.getElementById("staff" + i).value;
        var subject = document.getElementById("subject" + i).value;
        var topic = document.getElementById("topic" + i).value;

        dataToSave.push({
            slNo: i,
            time: getTimeLabel(i),
            staff: staff,
            subject: subject,
            topicCovered: topic,
            department: department, // Add the department to the data
        });
    }

    fetch('/save-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);
            
        })
        .catch(error => {
            console.error('Error saving data:', error);
            alert("Failed to save data. Please try again.");
        });
}


function goBack() {
    if (document.getElementById("page3").style.display === "block") {
        document.getElementById("page3").style.display = "none";
        document.getElementById("page2").style.display = "block";
    } else if (document.getElementById("page2").style.display === "block") {
        document.getElementById("page2").style.display = "none";
        document.getElementById("page1").style.display = "block";
    }
}
