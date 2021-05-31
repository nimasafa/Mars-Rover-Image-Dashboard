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
            ${Greeting(store.get('user').get('name'))}
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
        const newStore = store.set('selectedRover', rover.options[rover.selectedIndex].value);
        updateStore(store, newStore);
        getRoverData(store.get('selectedRover'));
    });
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
// Pure function that renders rover selection dropdown
const ChooseRover = () => {
    return `
        <div style="margin-top: 10px">
            <label for="rover">Choose a Mars Rover from the List:</label>
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

// Higher-order function with conditionality that processes rover data from array, and renders on webpage
const RoverData = (state) => {

    // Only perform function if a rover has been selected
    if (state.get('selectedRover') != '') {
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
            <div id="grid">
                <div class="grid-container">
                    ${photoURL.reduce(photoGallery, '')}
                </div>
            </div>
        `
    } else {

        return ""
    }
}

// callback function to feed into reduce method that displays gallery of rover photos
const photoGallery = (photoString, singlePhoto) => {
    return photoString += `<div><img src="${singlePhoto}" class="img-element"></div>`
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
