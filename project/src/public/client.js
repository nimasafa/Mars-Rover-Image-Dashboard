let store = {
    user: { name: "Nima" },
    selectedRover: '',
    roverData: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, roverData, selectedRover } = state

    return `
        <header><h1>Mars Rover Dashboard<h1></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                ${ChooseRover()}
            </section>
            <section>
                ${RoverData(state)}
            </section>
        </main>
        <footer></footer>
    `
}

// Listening for load event because page should load before any JS is called
// Listening for dropdown list selection
window.addEventListener('load', () => {
    render(root, store);
    
    let rover = document.getElementById('rovers');
    rover.addEventListener('change', () => {
        store.selectedRover = rover.options[rover.selectedIndex].value;
        getRoverData(store.selectedRover);
    });
});


// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h2>Welcome, ${name}!</h2>
        `
    }

    return `
        <h2>Hello!</h2>
    `
}
// Pure function that renders rover selection dropdown
const ChooseRover = () => {
    return `
        <div style="margin-top: 10px">
            <label for="rover">Choose a Mars Rover from the list:</label>
            <select id="rovers">
                <option>Select</option>
                <option value="Curiosity">Curiosity</option>
                <option value="Opportunity">Opportunity</option>
                <option value="Spirit">Spirit</option>
            </select>
            <button type="button" onClick="window.location.reload();">Refresh</button>
        </div>
    `
}

// Once rover has been selected, process data from array, and display on webpage
const RoverData = (state) => {
    
    // Only perform function if a rover has been selected
    if (state.selectedRover) {
        let output = state.roverData;

        // retrieve mission data from array
        const { name, launch_date, landing_date, status } = output[0].rover;
        const photoEarthDate = output[0].earth_date;

        return `
            <div>
                <ul>
                    <li>Rover Name: ${name}</li>
                    <li>Mission Launch Date: ${launch_date}</li>
                    <li>Mars Landing Date: ${landing_date}</li>
                    <li>Mission Status: ${status}</li>
                    <li>Latest Photo Date: ${photoEarthDate}</li>
                </ul>
            </div>
        `
    }
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)

    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%">
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getRoverData = (rover) => {

    return fetch(`http://localhost:3000/latest/${rover}`)
        .then(res => res.json())
        .then(roverData => {
            return updateStore(store, roverData)
        })
}
