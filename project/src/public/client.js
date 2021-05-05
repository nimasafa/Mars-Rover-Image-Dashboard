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
    RoverData(state);

    return `
        <header><h1>Mars Rover Dashboard<h1></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store);
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}
const RoverData = (state) => {
    if (!state.selectedRover) {
        /* Placeholder for one rover to test flow for the time being (NS) */
        state.selectedRover = "Spirit";
    }

    // If roverData has not yet been uploaded to store object, run API fetch request
    if (!state.roverData) {
        getRoverData(state.selectedRover);
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
