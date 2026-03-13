let playlist=[]
let history=[]
let currentIndex=0

let shuffle=false
let loop=false

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

const res=await fetch(BASE+id+".json")

playlist=await res.json()

currentIndex=randomIndex()

play()

}

function randomIndex(){

return Math.floor(Math.random()*playlist.length)

}

function play(){

if(!playlist.length){

loadCategory()

return

}

audio.src=playlist[currentIndex].url

audio.play()

}

function next(){

if(shuffle){

currentIndex=randomIndex()

}else{

currentIndex++

if(currentIndex>=playlist.length){

currentIndex=0

}

}

play()

}

function prev(){

currentIndex--

if(currentIndex<0){

currentIndex=playlist.length-1

}

play()

}

audio.addEventListener("ended",()=>{

if(loop){

play()

}else{

next()

}

})

document.getElementById("play").onclick=()=>{

if(audio.paused){

play()

}else{

audio.pause()

}

}

document.getElementById("next").onclick=()=>{

next()

}

document.getElementById("prev").onclick=()=>{

prev()

}

document.getElementById("shuffle").onclick=()=>{

shuffle=!shuffle

}

document.getElementById("loop").onclick=()=>{

loop=!loop

}

const seek=document.getElementById("seek")

audio.addEventListener("timeupdate",()=>{

seek.value=(audio.currentTime/audio.duration)*100 || 0

document.getElementById("currentTime").textContent=format(audio.currentTime)

document.getElementById("duration").textContent=format(audio.duration)

})

seek.oninput=()=>{

audio.currentTime=(seek.value/100)*audio.duration

}

function format(t){

if(!t) return "0:00"

const m=Math.floor(t/60)

const s=Math.floor(t%60)

return m+":"+(s<10?"0":"")+s

}

loadCategories()
