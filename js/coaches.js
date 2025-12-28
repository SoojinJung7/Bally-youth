function toggleCareer(card){
  card.classList.toggle("open");
}

function openContact(){
  const section=document.getElementById("contact");
  if(section){
    section.classList.add("open");
    section.scrollIntoView({behavior:"smooth"});
  }
}

function showSuccess(){
  const msg=document.getElementById("success-msg");
  if(msg) msg.style.display="block";
}

function openImage(src){
  const viewer=document.getElementById("imageViewer");
  const img=document.getElementById("viewerImg");
  img.src=src;
  viewer.style.display="flex";
}

function closeImage(){
  document.getElementById("imageViewer").style.display="none";
}
