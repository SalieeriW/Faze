const blog_container = document.querySelector(".blog_container");
const blog_input = document.getElementById("blog_input");
const drop_area = document.querySelector(".drop-area");
const hidden_input = document.getElementById("hidden_input");
const text_area = document.querySelector(".text_description");
const preview = document.querySelector(".preview");
const input_url = document.querySelector(".input_url");

var update_id = "";
var post_queue = false;
var put_queue = false;
var files;

async function recover(id) {
    const res = await fetch(`http://localhost:3000/posts/${id}`);
    const recovery = await res.json();
    document.querySelector(".input_title").value = recovery[0].title;
    document.querySelector(".input_url").value = recovery[0].image_url;
    document.querySelector(".text_description").value = recovery[0].description;
}
function convertTimestamp(timestamp) {
    var myDate = new Date(timestamp);
    return myDate.toLocaleString();
}
async function blogInit() {
    try {
        let obj;
        const res = await fetch("http://localhost:3000/posts");
        obj = await res.json();
        console.log(obj);
        for (let i = 0; i < obj.length; ++i) {
            let blog = `
            <div id="${obj[i].id}"class="blog">
            <div class="content">
            <img class="content-image" src="${obj[i].image_url}" />
            <div class="content-text">
            <div class="content-title">${obj[i].title}</div>
            <div class="content-description">${obj[i].description}</div>
            <div class="content-time">${convertTimestamp(obj[i].created_at)}</div>
            </div>
            </div>
                <div class="util-container">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
                </div>
                </div>
                `;
            blog_container.innerHTML += blog;
        }
    } catch {
        (res) => console.log("Couldn't GET the blogs");
    }
}
async function btnInit() {
    await blogInit();
    let delete_btn = document.querySelectorAll(".delete");
    delete_btn.forEach((elem) => {
        elem.addEventListener("click", (e) => {
            let id = e.target.parentNode.parentNode.getAttribute("id");
            fetch(`http://localhost:3000/posts/${id}`, {
                method: "delete",
            })
                .then((res) => res.json())
                .then((res) => console.log(res))
                .catch((res) => console.log("Couldn't DELETE the blog"));
            window.location.reload();
        });
    });
    let edit = document.querySelectorAll(".edit");
    edit.forEach((elem) => {
        elem.addEventListener("click", (e) => {
            update_id = e.target.parentNode.parentNode.getAttribute("id");
            blog_container.classList.add("hide");
            blog_input.classList.remove("hide");
            put_queue = true;
            add.style.color = "red";
            recover(update_id);
        });
    });
    let resize = document.querySelectorAll(".content-image");
    resize.forEach((elem) => {
        elem.onerror = () => {
            elem.style.display = "none";
            elem.nextElementSibling.style.width = "100%";
        };
    });
}
function showFiles(files) {
    if (files.length == 1) {
        processFile(files);
    } else {
        alert("Please upload 1 image");
    }
}
async function wait(fileReader) {
    console.log();
    return new Promise((resolve) => (fileReader.onload = () => resolve()));
}
async function bla() {
    return new Promise((resolve) => (okey.onclick = () => resolve()));
}
async function processFile(file) {
    const fileReader = new FileReader();
    console.log(fileReader);

    const doctype = file[0].type;
    console.log(doctype);
    const valid = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (valid.includes(doctype)) {
        console.log("fuap");
        fileReader.readAsDataURL(file[0]);
        await wait(fileReader);
        console.log("adivinen");
        console.log("asdas");
        let fileurl = fileReader.result;
        blog_input.classList.add("hide");
        preview.classList.remove("hide");
        const img = `
            <div class="preview-title">Confirm your image</div>
            <img src="${fileurl}" class="uploaded_img" alt="${file.name}"/>
            <div class="preview-parameters">
                <button id="okey">Ok</button>
                <button id="cancelation">Cancel</button>
            </div>
            `;
        document.querySelector(".preview").innerHTML = img;

        const okey = document.getElementById("okey");
        const cancelation = document.getElementById("cancelation");

        cancelation.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("cancel");
            hidden_input.value = null;
            preview.classList.add("hide");
            blog_input.classList.remove("hide");
        });
        await bla();
        preview.classList.add("hide");
        blog_input.classList.remove("hide");
        const formData = new FormData();
        formData.append("file", file[0]);
        const res = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        input_url.value = data.body;
    } else {
        alert(`Please use "image/jpeg", "image/jpg", "image/png", "image/gif"`);
    }
}
btnInit();
add.addEventListener("click", (e) => {
    if (!post_queue) {
        blog_container.classList.add("hide");
        blog_input.classList.remove("hide");
        post_queue = true;
        add.style.color = "red";
    } else {
        blog_container.classList.remove("hide");
        blog_input.classList.add("hide");
        post_queue = false;
        add.style.color = "white";
    }
    preview.classList.add("hide");
});

submit.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("hey");
    if (post_queue) {
        let post = {
            title: document.querySelector(".input_title").value,
            image_url: document.querySelector(".input_url").value,
            description: document.querySelector(".text_description").value,
        };
        console.log(post);

        fetch("http://localhost:3000/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
        })
            .then((res) => res.json())
            .then((res) => console.log(res))
            .catch((res) => console.log("Couldn't POST the blog"));
        window.location.reload();
    }
    if (put_queue) {
        let post = {
            title: document.querySelector(".input_title").value,
            image_url: document.querySelector(".input_url").value,
            description: document.querySelector(".text_description").value,
        };
        console.log(post);

        fetch(`http://localhost:3000/posts/${update_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
        })
            .then((res) => res.json())
            .then((res) => console.log(res))
            .catch((res) => console.log("Couldn't PUT the blog"));
        window.location.reload();
    }
});

drop_area.addEventListener("dragover", (e) => {
    e.preventDefault();
    text_area.classList.add("active");
});
drop_area.addEventListener("dragleave", (e) => {
    e.preventDefault();
    text_area.classList.remove("active");
});
drop_area.addEventListener("drop", (e) => {
    e.preventDefault();
    files = e.dataTransfer.files;
    showFiles(files);
    text_area.classList.remove("active");
});
