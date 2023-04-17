const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#input-file");

const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");
const maxsize=100*1024*1024;
const host="http://localhost:3000";
const uploadURL=`${host}/api/files`;
const emailURL = `${host}/api/files/send`;
const fileURL = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copyBtn");
const emailForm = document.querySelector("#email-form");
const toast = document.querySelector(".toast");
const fileUploadURL="";
dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();
    if(!dropZone.classList.add("dragged"))
    {
        dropZone.classList.add("dragged");
        //console.log("dragged");
    }
})

dropZone.addEventListener("dragleave",()=>{
    dropZone.classList.remove("dragged");
})

dropZone.addEventListener("drop",(e)=>{
    e.preventDefault();
    const files=e.dataTransfer.files;
    console.log("dropped",files[0].name);
    if(files.length){
        uploadFile();
        fileInput.files = files;
    }
    dropZone.classList.remove("dragged");
});

fileInput.addEventListener("change",()=>{
    uploadFile();
})

browseBtn.addEventListener("click",()=>{
    fileInput.click();
})

const uploadFile =()=>{
    if(fileInput.files.length > 1)
    {
        fileInput.value="";
        showToast("Upload only 1 file");
        return;
    }
    files=fileInput.files;
    if(files.size > maxsize)
    {
        fileInput.value="";
        showToast("max allowed size 100mb");
        return;
    }
    const formData = new FormData();
    formData.append("myfile",files[0]);
    progressContainer.style.display="block";
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = ()=>{
        fileInput.value="";
        showToast(`Erorr in Upload: ${xhr.statusText}`);
    }
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState===XMLHttpRequest.DONE){
            console.log(xhr.responseText);
            showLink(xhr.responseText);
        }
    }
    xhr.open("POST",uploadURL);
    xhr.send(formData);
};
const updateProgress = (e)=>{
    const percent = Math.round((e.loaded/e.total) * 100);
    console.log(percent);
    bgProgress.style.width=`${percent}%`;
    progressBar.style.transform=`scaleX(${percent/100})`;
    percentDiv.innerText = percent;
};
const showLink=(res)=>{
    console.log(files);
    emailForm[2].removeAttribute("disabled","true");
    progressContainer.style.display="none";
    const {file:url} = JSON.parse(res);
    // console.log(url);
    sharingContainer.style.display = "block";
    fileURL.value = url;
    fileInput.value="";
};

copyBtn.addEventListener("click", ()=>{
    fileURL.select();
    document.execCommand("copy");
    showToast("copied to clipboard.");
});

emailForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const url = fileURL.value;
    const formData = {
        uuid: url.split("/").splice(-1,1)[0],
        emailTo:emailForm.elements["emailTo"].value,
        emailFrom:emailForm.elements["emailFrom"].value
    }
    emailForm[2].setAttribute("disabled","true");
    // console.log(formData);

    fetch(emailURL,{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
    }).then((res) => res.json()).then((success)=>{
        if(success){
            sharingContainer.style.display="none";
            showToast("Email Sent Successfully.");
        }
    });

});

let toastTimer;
const showToast = (msg) => {
    toast.style.transform="translate(-50%,0)";
    toast.innerText = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.transform="translate(-50%,60px)";
  },2000);
};