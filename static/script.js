
let fullData;


d3.json("/data").then((data) => {
    //console.log(data);
    fullData = data;
    const teamNames = [...new Set(data.map(player => player.team))];
    console.log(teamNames);
    populateTeamDropdown(teamNames);
    const topByTeam = getTopTenByTeam(fullData, teamNames[0]);
    teamBarChart(topByTeam);
});

function populateTeamDropdown(teamNames) {
    
    const dropdown = d3.select("#selTeam").node();
    for (let i = 0; i < teamNames.length; i++) {
        const opt = teamNames[i];
        const elmnt = document.createElement("option");
        elmnt.textContent = opt;
        elmnt.value = opt;
        dropdown.appendChild(elmnt);
    }
}

function getTopTenByTeam(data, team) {

    const playersByTeam = data.filter(player => player.team === team);
    const sortedByOverall = playersByTeam.sort((playerA, playerB) => {
        playerB.overall - playerA.overall;
    })

    //console.log(sortedByOverall.slice(0, 10));
    return sortedByOverall.slice(0, 10);

}

function teamBarChart(data) {

    console.log(data);

    const names = data.map(player => player.fullNameForSearch);
    const overallRatings = data.map(player => player.overall);
    /*team_color is stored as array of 3 values
    plotly takes a array of strings in the format
    "rgb(r,g,b)". the array must be the same length as x and y*/
    const teamColorArray = data[0].team_color;
    const teamColorString = `rgb(${teamColorArray.join(',')})`;
    const colorsArray = Array(data.length).fill(teamColorString);    

    const trace = {
        type: "bar",
        x: names,
        y: overallRatings,
        marker: {
            color: colorsArray,
        }
    }

    const plotData = [trace];
    const layout = {
        title: `<b>${data[0].team} Top 10 Overall Players</b>`,
        displayModeBar: false,
        displaylogo: false
    };
    const config = {
            displayModeBar: false,
        };

    Plotly.newPlot("teamBarChart", plotData, layout, config);

}

function animateTeamBarChart(data) {
    //animate transition to new data
    const names = data.map(player => player.fullNameForSearch);
    const overallRatings = data.map(player => player.overall);
    /*team_color is stored as array of 3 values
    plotly takes a array of strings in the format
    "rgb(r,g,b)". the array must be the same length as x and y*/
    const teamColorArray = data[0].team_color;
    const teamColorString = `rgb(${teamColorArray.join(',')})`;
    const colorsArray = Array(data.length).fill(teamColorString);    

    const updatedTrace = {
        type: "bar",
        x: names,
        y: overallRatings,
        marker: {
            color: colorsArray,
        }
    }

    const animation = {
        layout: {
            title: `<b>${data[0].team} Top 10 Overall Players</b>`,
        },
        config:{
            displayModeBar: false, // this is the line that hides the bar.
        },
        data: [updatedTrace],
        traces: [0],
    };

    Plotly.animate("teamBarChart", animation, { 
        transition: { 
            duration: 1000 
        }, frame: { 
            duration: 1000, 
            redraw: true 
        } 
    });
}


function teamChanged(val) {
    const topByTeam = getTopTenByTeam(fullData, val);
    animateTeamBarChart(topByTeam);

}

