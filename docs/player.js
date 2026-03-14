const BASE =
"https://raw.githubusercontent.com/pellimelam/pellimelam-music-infrastructure/main/radios/generated/"

const audio=document.getElementById("audio")

let playlistCache={}
let playlist=[]
let queue=[]
let index=0

let shuffle=false
let repeat=false

let nextAudio=new Audio()

async function loadCategories(){

const res=await fetch(BASE+"categories.json")
const data=await res.json()

const select=document.getElementById("categorySelect")

for(const cat of data.categories){

const option=document.createElement("option")
option.value=cat.id
option.textContent=cat.name
select.appendChild(option)

}

await preloadPlaylists(data.categories)

}

async function preloadPlaylists(categories){

for(const cat of categories){

const r=await fetch(BASE+cat.id+".json")
playlistCache[cat.id]=await r.json()

}

}

function loadCategory(){

const select=document.getElementById("categorySelect")
const id=select.value

document.getElementById("title").innerText=
select.options[select.selectedIndex].text

playlist=playlistCache[id]

createQueue()

index=0

playTrack()

}

function createQueue(){

queue=[...playlist]

if(shuffle){

queue.sort(()=>Math.random()-0.5)

}

}

function preloadNext(){

if(index+1<queue.length){

nextAudio.src=queue[index+1].url
nextAudio.preload="auto"

}

}

function playTrack(){

if(!queue.length) return

audio.src=queue[index].url

audio.play()

document.getElementById("play").innerText="⏸"

preloadNext()

}

function togglePlay(){

const btn=document.getElementById("play")

if(audio.paused){

audio.play()
btn.innerText="⏸"

}else{

audio.pause()
btn.innerText="▶"

}

}

function next(){

index++

if(index>=queue.length){

if(repeat){

index=0

}else{

index=queue.length-1
return

}

}

playTrack()

}

function prev(){

if(audio.currentTime>3){

audio.currentTime=0
return

}

index--

if(index<0) index=0

playTrack()

}

audio.addEventListener("ended",next)

document.getElementById("play").onclick=togglePlay
document.getElementById("next").onclick=next
document.getElementById("prev").onclick=prev

document.getElementById("shuffle").onclick=()=>{

shuffle=!shuffle

document.getElementById("shuffle").classList.toggle("active")

createQueue()

}

document.getElementById("loop").onclick = () => {

repeat = !repeat

audio.loop = repeat

document.getElementById("loop").classList.toggle("active")

}

const seek=document.getElementById("seek")

audio.addEventListener("timeupdate",()=>{

seek.value=(audio.currentTime/audio.duration)*100||0

document.getElementById("currentTime").innerText=format(audio.currentTime)
document.getElementById("duration").innerText=format(audio.duration)

})

seek.oninput=()=>{

audio.currentTime=(seek.value/100)*audio.duration

}

const volume=document.getElementById("volume")

volume.value=0.8
audio.volume=0.8

volume.oninput=()=>{

audio.volume=volume.value

}

function format(t){

if(!t) return "0:00"

const m=Math.floor(t/60)
const s=Math.floor(t%60)

return m+":"+(s<10?"0":"")+s

}

document.getElementById("categorySelect").onchange=()=>{

audio.pause()

playlist=[]
queue=[]

loadCategory()

}

async function init(){

await loadCategories()

loadCategory()

}

init()
