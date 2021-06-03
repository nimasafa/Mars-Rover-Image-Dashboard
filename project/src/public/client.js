let store = Immutable.Map({
    user: Immutable.Map({ name: "Nima" }),
    selectedRover: '',
    roverData: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
});

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
    store = state.merge(newState);
    render(root, store);
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
            ${Greeting(store.get('user').get('name'))}
            <section>
                ${RoverData(state)}
            </section>
        </main>
        <footer></footer>
    `
}

// Listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store);
});


// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information
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

// Higher-order function with conditionality that processes rover data from array, and renders on webpage
const RoverData = (state) => {

    // Only perform function if a rover has been selected
    if (state.get('selectedRover') != '') {
        
        // Retrieve roverData from API as soon as rover is selected
        if (state.get('roverData') === '') {
            getRoverData(store.get('selectedRover'));
        }

        let dataOutput = state.get('roverData');

        // retrieve mission data from array
        const roverDetails = dataOutput.get(0).get('rover');
        const { name, launch_date, landing_date, status } = roverDetails.toJS();
        const photoEarthDate = dataOutput.get(0).get('earth_date');

        // retrieve photo URLs from array
        const photoURL = dataOutput.map(photo => photo.get('img_src'));

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
            <button type="button" onClick="window.location.reload();">Back</button>
            <div id="grid">
                <div class="grid-container">
                    ${photoURL.reduce(photoGallery, '')}
                </div>
            </div>
        `
    } else {

        return `
            <div> Please select a rover from the options below: </div>
            ${wrapRoverCards(state, roverCardMapper, state.get('rovers'), roverCard)}
        `
    }
}

// callback function to feed into reduce method that displays gallery of rover photos
const photoGallery = (photoString, singlePhoto) => {
    return photoString += `<div><img src="${singlePhoto}" class="img-element"></div>`
}

// Higher order function that wraps set of roverCards in a HTML content division element
const wrapRoverCards = (state, roverCardMapper, mapArray, roverCard) => {
    return (`
    <div class="rover-card-container">
        ${roverCardMapper(state, mapArray, roverCard)}
    </div >
    `)
}

// Higher order function that maps through array of rovers and joins roverCards
const roverCardMapper = (state, mapArray, roverCard) => {
    return (`
        ${mapArray.map(rover => roverCard(state, rover)).join('')}
    `)
}

// Pure function that generates HTML card for rover, and updates store for rover selection upon click
const roverCard = (state, rover) => {
    return (`
    <button class="rover-card"
    onclick="updateStore(store, {selectedRover: '${rover}'})">
    <h2 class="card-title">${rover}</h2>
    </button>
    `)
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
