const url = 'https://api.github.com/users/';

async function getuser(username) {
    // let response = await axios.get(url + username);
    // console.log(response.data);

    try {
        // array destructuring 
        let {data} = await axios.get(url + username);
        // console.log(data);
        createcard(data);
        getrepositories(username);
    }
    catch(error) {
        // console.error(error);
        if(error.response.status == 404) {
            errorcard(`No profile named ${username} found.`);    
        }        
    }
}
// getuser('rohanchhabria');

function addrepositories(repositories) {
    const addrepositories = document.querySelector('.repositories');
    repositories.slice(0, 10).forEach(repository => {
        let repositorylink = document.createElement('a');
        repositorylink.classList.add('repository');
        repositorylink.href = repository.html_url;
        repositorylink.target = '_blank';
        repositorylink.innerText = repository.name;

        addrepositories.appendChild(repositorylink);
    });
}

async function getrepositories(username) {
    try {
        // array destructuring 
        // '/repos?sort=created'
        let {data} = await axios.get(url + username + '/repos?sort=created');
        // console.log(data);
        addrepositories(data);
    }
    catch(error) {
        // console.error(error);
        errorcard('Problem fetching repositories.');    
    }
}

const form = document.querySelector('.form');
const searchfield = document.querySelector('.search-field');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let username = searchfield.value;
    
    if(username) {
        getuser(username);
        searchfield.value = '';
    }
});

const maincontainer = document.querySelector('.main-container');

function createcard(username) {
    const cardhtml = `        
    <div class="card">
            <div>
                <!-- https://randomuser.me/api/portraits/men/1.jpg -->
                <img src="${username.avatar_url}" alt="${username.name}" srcset="" class="profile-picture">
            </div>
            <div class="user-info">
                <h2>${username.name}</h2>
                <p>${username.bio}</p>

                <ul>
                    <li>${username.followers}<strong>Followers</strong></li>&nbsp;
                    <li>${username.following}<strong>Following</strong></li>&nbsp;
                    <li>${username.public_repos}<strong>Repositories</strong></li>&nbsp;
                </ul>

                <div class="repositories"></div>
            </div>      
        </div>`;

        maincontainer.innerHTML = cardhtml;
}

function errorcard(message) {
    const cardhtml = `
    <div class="card">
            <h2 style="color: rgb(29, 161, 242);">${message}</h2>
    </div>`;

    maincontainer.innerHTML = cardhtml;
}