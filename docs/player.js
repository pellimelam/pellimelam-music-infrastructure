let playlist = []
let current = null

const audio = document.getElementById("audio")

// GitHub RAW base path
const BASE =
"https://raw.githubusercontent.com/pellimelam/pellimelam-music-infrastructure/main/radios/generated/"

async function loadCategories(){

const res = await fetch(BASE + "categories.json")

const data = await res.json()

const container = document.getElementById("categories")

container.innerHTML = ""

data.categories.forEach(cat => {

const btn = document.createElement("button")

btn.className = "category"

btn.innerText = cat.name

btn.onclick = () => loadCategory(cat.id)

container.appendChild(btn)

})

}

async function loadCategory(id){

const res = await fetch(BASE + id + ".json")

playlist = await res.json()

next()

}

function randomTrack(){

return playlist[Math.floor(Math.random() * playlist.length)]

}

function playTrack(track){

current = track

audio.src = track.url

document.getElementById("title").innerText = track.title

audio.play()

}

function play(){

if(current) audio.play()

}

function stop(){

audio.pause()

}

function next(){

if(!playlist.length) return

playTrack(randomTrack())

}

audio.addEventListener("ended", () => {

next()

})

loadCategories()
