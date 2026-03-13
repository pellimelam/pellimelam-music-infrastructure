let playlist=[]
let current=null
let nextTrack=null
let categoryName=""

const audio=document.getElementById("audio")

const BASE =
"https://raw.githubusercontent.com/pellimelam/pellimelam-music-infrastructure/main/radios/generated/"

async function loadCategories(){

const res=await fetch(BASE+"categories.json")

const data=await res.json()

const select=document.getElementById("categorySelect")

data.categories.forEach(cat=>{

const option=document.createElement("option")

option.value=cat.id
option.textContent=cat.name

select.appendChild(option)

})

}

async function loadCategory(){

const id=document.getElementById("categorySelect").value

categoryName=document.getElementById("categorySelect").selectedOptions[0].text

const res=await fetch(BASE+id+".json")

playlist=await res.json()

document.getElementById("title").innerText=categoryName

prepareNext()

playNext()

}

function randomTrack(){

return playlist[Math.floor(Math.random()*playlist.length)]

}

function prepareNext(){

nextTrack=randomTrack()

}

function playNext(){

if(!nextTrack) return

current=nextTrack

audio.src=current.url

document.getElementById("title").innerText=categoryName

audio.play()

prepareNext()

}

document.getElementById("playBtn").onclick=()=>{

if(!playlist.length){

loadCategory()

}else{

audio.play()

}

}

document.getElementById("stopBtn").onclick=()=>{

audio.pause()

}

document.getElementById("nextBtn").onclick=()=>{

playNext()

}

audio.addEventListener("ended",()=>{

playNext()

})

loadCategories()
