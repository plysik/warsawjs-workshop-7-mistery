const LIMIT_OF_REPOSITORY_LIST = 9;
const MOCKED_DATA = true;

class GithubProfileCard extends HTMLElement{
    constructor(){
        super();
        this.shadow  = this.attachShadow({mode:'open'});
    }
    connectedCallback(){
        this._attachTemplate();

        let login = this.attributes.login.value;


        Promise.resolve(login)
        .then((login)=>this._fetchData(login))
        .then((profile)=>this._fetchRepos(profile));
        
    }
    _fetchData(login){
        let url = MOCKED_DATA?  '../2-github-profile-card/mocks/profile.json' : ('https://api.github.com/users/' + login);

        let options = {method:"GET"};

        return fetch(url, options)
                .then((response)=>{
                    return response.json();
                })
                .then((profile)=>{
                    this._displayProfile(profile);
                    return profile;
                })                
                .catch((error) => {
                    console.error(error);
                });
    }
    _displayProfile(profile){
        let color = '#'+Math.floor(Math.random()*16777215).toString(16);
        let $body  = this.shadow.querySelector('.body');
        $body.style.backgroundColor = color;
        let $img = this.shadow.querySelector('img');
        $img.src = profile.avatar_url;
        let $h1 = this.shadow.querySelector('h1');
        $h1.innerHTML = profile.name;
        let $h3 = this.shadow.querySelector('h3');
        $h3.innerHTML = profile.location;
        let $p = this.shadow.querySelector('p');
        $p.innerHTML = profile.bio;
    }
    _fetchRepos(profile){
        // let url = profile.repos_url;
        let url = MOCKED_DATA?  '../2-github-profile-card/mocks/repos.json' : (profile.repos_url);
        let options = { method: 'GET' };
        return fetch(url, options)
            .then((response)=>{
                return response.json();
            })
            .then((repositories) => {
                repositories.length = LIMIT_OF_REPOSITORY_LIST;
                return repositories;
            })
            .then((repositories) => {
                return repositories.sort(this._sortByLastUpdated);
            })
            .then((repositories)=>{
                this._displayRepositories(repositories);
            })         
            .catch((error) => {
                console.error(error);
            });

    }

    _displayRepositories(repositories) {
        let $list = document.createDocumentFragment();
        repositories.forEach((repository) => {
            let $li = document.createElement('li');
            $li.innerHTML = `
                <span>${repository.stargazers_count} &#x2B50;</span> 
                <a href="${repository.html_url}" target="_blank">
                    ${repository.name}
                </a>
            `;
            $list.appendChild($li);
        });
        this.shadow.querySelector('ul').appendChild($list);
    }

    _sortByLastUpdated(repository1, repository2) {
        let starCount1 = repository1.stargazers_count;
        let starCount2 = repository2.stargazers_count;

        if (starCount1 < starCount2) {
            return 1;
        } else if (starCount1 > starCount2) {
            return -1;
        } else {
            return 0;
        }
    }
    
    _attachTemplate()
    {
        let template = document.currentScript.ownerDocument.querySelector("template").content.cloneNode(true);
        this.shadow.appendChild(template);
    }

}

window.customElements.define('github-profile-card', GithubProfileCard);

