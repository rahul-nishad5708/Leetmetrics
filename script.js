document.addEventListener("DOMContentLoaded", function () {

    const SearchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");

    const statsContainer = document.querySelector(".stats-container");

    const easyprogressCircle = document.querySelector(".easy-progress");
    const mediumprogressCircle = document.querySelector(".medium-progress");
    const hardprogressCircle = document.querySelector(".hard-progress");

    const easylabel = document.getElementById("easy-label");
    const mediumlabel = document.getElementById("medium-label");
    const hardlabel = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-cards");


    // -------------------------------
    // Validate Username
    // -------------------------------
    function validateUserName(userName) {

        if (userName.trim() === "") {
            alert("Username can't be empty.");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,30}$/;
        const isMatching = regex.test(userName);

        if (!isMatching) {
            alert("Invalid username.");
            return false;
        }

        return true;
    }


    // -------------------------------
    // Update Progress Circles
    // -------------------------------
    function updateProgress(solved, total, label, circle) {

        const progressDegree = total > 0
            ? (solved / total) * 100
            : 0;

        circle.style.setProperty(
            "--progress",
            `${progressDegree}%`
        );

        label.textContent = `${solved} / ${total}`;
    }


    // -------------------------------
    // Display User Data
    // -------------------------------
    function displayUserData(data) {

        const {
            totalQuestions,
            totalSolved,
            acceptanceRate,
            byDifficulty
        } = data;


        const easySolved = byDifficulty?.easy || 0;
        const mediumSolved = byDifficulty?.medium || 0;
        const hardSolved = byDifficulty?.hard || 0;


        // Update progress circles
        updateProgress(
            easySolved,
            Math.round(totalQuestions * 0.25),
            easylabel,
            easyprogressCircle
        );

        updateProgress(
            mediumSolved,
            Math.round(totalQuestions * 0.50),
            mediumlabel,
            mediumprogressCircle
        );

        updateProgress(
            hardSolved,
            Math.round(totalQuestions * 0.25),
            hardlabel,
            hardprogressCircle
        );


        // Cards
        const cardsData = [

            {
                label: "Total Problems Solved",
                value: totalSolved
            },

            {
                label: "Easy Solved",
                value: easySolved
            },

            {
                label: "Medium Solved",
                value: mediumSolved
            },

            {
                label: "Hard Solved",
                value: hardSolved
            },

            {
                label: "Acceptance Rate",
                value: `${acceptanceRate}%`
            },

            {
                label: "Total Questions",
                value: totalQuestions
            }

        ];


        console.log("Card data:", cardsData);


        // Clear previous cards
        cardStatsContainer.innerHTML = "";


        // Create cards
        cardsData.forEach(item => {

            const card = document.createElement("div");

            card.classList.add("card");


            const title = document.createElement("h1");

            title.textContent = item.label;


            const value = document.createElement("p");

            value.textContent = item.value;


            card.appendChild(title);
            card.appendChild(value);


            cardStatsContainer.appendChild(card);

        });

    }


    // -------------------------------
    // Fetch LeetCode User Details
    // -------------------------------
    async function fetchUserDetails(userName) {

        try {

            SearchButton.textContent = "Searching...";
            SearchButton.disabled = true;


            // NEW WORKING API
            const url =
                `https://leetcode-stats.tashif.codes/${encodeURIComponent(userName)}/stats`;


            console.log("Fetching:", url);


            const response = await fetch(url);


            if (!response.ok) {

                throw new Error(
                    `Unable to fetch user details. Status: ${response.status}`
                );

            }


            const result = await response.json();


            console.log("API Response:", result);


            // Check API status
            if (result.status !== "success") {

                throw new Error(
                    result.message || "User not found."
                );

            }


            // API data is inside result.data
            displayUserData(result.data);


        } catch (error) {

            console.error("Error:", error);


            statsContainer.innerHTML =
                `<p>Error: ${error.message}</p>`;

        } finally {

            SearchButton.textContent = "Search";
            SearchButton.disabled = false;

        }

    }


    // -------------------------------
    // Search Button
    // -------------------------------
    SearchButton.addEventListener("click", function () {

        const userName = usernameInput.value.trim();


        console.log("Searching username:", userName);


        if (validateUserName(userName)) {

            fetchUserDetails(userName);

        }

    });


    // -------------------------------
    // Enter Key Search
    // -------------------------------
    usernameInput.addEventListener("keypress", function (event) {

        if (event.key === "Enter") {

            SearchButton.click();

        }

    });

});


// document.addEventListener("DOMContentLoaded", function(){


//     const SearchButton = document.getElementById("search-btn");
//     const usernameInput = document.getElementById("user-input");
//     const statsContainer = document.querySelector(".stats-container");
//     const easyprogressCircle = document.querySelector(".easy-progress");
//     const mediumprogressCircle = document.querySelector(".medium-progress");
//     const hardprogressCircle = document.querySelector(".hard-progress");
//     const easylabel = document.getElementById("easy-label");
//     const mediumlabel = document.getElementById("medium-label");
//     const hardlabel = document.getElementById("hard-label");
//     const  cardStatsContainer = document.querySelector(".stats-cards");

//     // return true or false based fon a regex
//     function validateUsername(username) {
//         if(username.trim() === "") {
//             alert("Username should not be empty");
//             return false;
//         }
//         const regex = /^[a-zA-Z0-9_-]{1,15}$/;
//         const isMatching = regex.test(username);
//         if(!isMatching) {
//             alert("Invalid Username");
//         }
//         return isMatching;
//     }

//     async function fetchUserDetails(username){
 
//         try{
//             SearchButton.textContent = "Searching...";
//             SearchButton.disabled = true;
//             // statsContainer.style.display = "hidden";

//             // const response = await fetch(url);
//             const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
//             const targetUrl = 'https://leetcode.com/graphql/';
//             // concatenated url: `https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql`
//             const myHeaders = new Headers();
//             myHeaders.append("content-type", "application/json");

//             const graphql = JSON.stringify({
//                 query: "\n query userSessionProgress($username: String!) {\n allQuestionsCount {\n   difficulty\n   count\n  }\n  matchedUser(username: $username) {\n submitStats {\n acSubmissionNum {\n      difficulty\n     count\n     submissions\n     }\n     totalSubmissionNum {\n      difficulty\n   count\n      submissions\n   }\n    }\n    }\n}\n      ", variables:  { "username": `${username}` }
//             })
//             const requestOptions = {
//                 method: "POST",
//                 headers: myHeaders,
//                 body: graphql,
//                 redirect: "follow"
//             };

//             const response = await fetch(proxyUrl + targetUrl, requestOptions);
//             if(!response.ok) {
//                 throw new Error("Unable to fetch the user details");
//             }
//             const paresdData = await response.json();
//             console.log("Logging data: ", paresdData);

//             displayUserData(paresdData);
//         }
//         catch(error){
//             statsContainer.innerHTML = `<p>${error.message}</p>`
//         }
//         finally {
//             SearchButton.textContent = "Search";
//             SearchButton.disabled = false;
//         }
//     } 

//     function updateProgress(solved, total, label, circle) {
//         const progressDegree = (solved/total)*100;
//         circle.style.setProperty("--progress-degree", `${progressDegree}%`);
//         label.textContent = `${solved}/${total}`;
//     }

//     function displayUserData(paresdData){
//         const totalQues = paresdData.data.allQuestionsCount[0].count;
//         const totalEasyQues = paresdData.data.allQuestionsCount[1].count;
//         const totalMediumQues = paresdData.data.allQuestionsCount[2].count;
//         const totalHardQues = paresdData.data.allQuestionsCount[3].count;

//         const solvedTotalOues = paresdData.data.matchedUser.submitStats.acSubmissionNum[0].count;
//         const solvedTotalEsayOues = paresdData.data.matchedUser.submitStats.acSubmissionNum[1].count;
//         const solvedTotalMediumOues = paresdData.data.matchedUser.submitStats.acSubmissionNum[2].count;
//         const solvedTotalHardOues = paresdData.data.matchedUser.submitStats.acSubmissionNum[3].count;

//         updateProgress(solvedTotalEsayOues, totalEasyQues, easylabel, easyprogressCircle);
//         updateProgress(solvedTotalMediumOues, totalMediumQues, mediumlabel, mediumprogressCircle);
//         updateProgress(solvedTotalHardOues, totalHardQues, hardlabel, hardprogressCircle);

//         const cardsData = [
//             {label: "Overall Submissions", value : paresdData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
//             {label: "Overall Easy Submissions", value:paresdData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
//             {label: "Overall Medium Submissions", value:paresdData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
//             {label: "Overall Hard Submissions", value:paresdData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
//         ];
 
//         console.log("card ka data: " , cardsData);

//         cardStatsContainer.innerHTML = cardsData.map(
//             data => 
//                 `<div class="card">
//                 <h4>${data.label}</h3>
//                 <p>${data.value}</p>
//                 </div>`
//         ).join("");

//     }

//     // username get input then serach 
//     SearchButton.addEventListener('click', function() {
//         const username = usernameInput.value;
//         console.log("loggin username: ", username);
//         if(validateUsername(username)) {
//             fetchUserDetails(username);
//         }
//     })

// }) 
