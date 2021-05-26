


const init = () => {
    const mainDiv = document.querySelector(".row"); 
    for(let i=0; i<projects.length; i++){
        const project = projects[i]; 
        mainDiv.innerHTML += `
        <div class="col-4 col-sm-4 col-md-4 col-lg-3 col-xl-2">
            <div class="card" onclick = "location.href = './${project.name}/index.html';">
              <img src="./${project.name}/capture.png" class="card-img-top">
              <div class="card-body">
                <strong class="card-title">${project.title}</strong>
                <p class="card-text">${project.description}</p>
              </div>
            </div>
          </div>
        `
    }
}
window.onload = init; 
