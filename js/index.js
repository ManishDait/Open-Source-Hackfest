import { getIssues, getLanguages, getRepositories } from "./api-fetcher.js";
let repositories = new Map()
let languages = [];
window.onload = async function() {
    await start()
}

async function start() {
    repositories = await getRepositories(languages);
    renderRepoList();
}

async function renderRepoList() {
    var list = document.getElementById('repo-container');
    var c = 0;
    for (var [key, value] of repositories.entries()) {
        var header = document.createElement('div');
        header.className = 'header';

        var div  = document.createElement('div');
        var card = document.createElement('div');
        card.className = 'card';

        var title = document.createElement('h4');
        var description = document.createElement('p');
        description.className = 'description';
        var language = document.createElement('p');
        var url = document.createElement('a');

        var bttn = document.createElement('button');
        bttn.setAttribute('id', `${c}`)
        bttn.setAttribute('owner', value.owner);
        bttn.setAttribute('repo', value.name);
        bttn.innerHTML = 'Issue';
        bttn.addEventListener('click', function() {
            toggleIssue(this.id);
        })

        var ul = document.createElement('ul');
        ul.className = 'issue';
        ul.setAttribute('id', `issue${c}`)

        title.innerHTML = value.full_name;
        description.innerHTML = value.description;
        url.className = "fa fa-github";
        url.href = value.url;

        var lan = await getLanguages(value.owner, value.name);
        for (var l of lan) {
            var p = language.innerHTML;
            var str = p != ""? `${p}, ${l}`: `${p} ${l}`;
            language.innerHTML = str;
        }
        var p = language.innerHTML;
        language.innerHTML = `Lang: ${p}`;
        language.className = 'lang';

        c = c+1;
        div.appendChild(title);
        div.appendChild(bttn);
        header.appendChild(div);
        header.appendChild(url);
        card.appendChild(header);
        card.appendChild(description);
        card.appendChild(language);
        card.appendChild(ul);
        list.appendChild(card);        
        list.appendChild(document.createElement('br'))
        list.appendChild(document.createElement('br'))
    }
}

async function toggleIssue(bttnId) {
    var id = `issue${bttnId}`;
    var bttn = document.getElementById(bttnId);
    var issues = await getIssues(bttn.getAttribute('owner'), bttn.getAttribute('repo'));
    var list = document.getElementById(id);
    list.innerHTML = ''
    if (issues.length == 0) {
        var list_item = document.createElement('li');
        list.innerHTML = `<a href="#">No Issues available.</a>`;
        list.appendChild(list_item);
    } else {
        for (var issue of issues) {
            var list_item = document.createElement('li');
            list_item.innerHTML = `<a href="${issue.html_url}">#${issue.number} ${issue.title}</a>`;
            list.appendChild(list_item);
        }
    }
    
    document.getElementById(id).style.display == "flex" ?
    document.getElementById(id).style.display = "none" :
    document.getElementById(id).style.display = "flex";
}

document.getElementById('javaf').addEventListener('click', function() {
    filter('Java');
})
document.getElementById('gof').addEventListener('click', function() {
    filter('Go');
})
document.getElementById('pyf').addEventListener('click', function() {
    filter('Python');
})
document.getElementById('tsf').addEventListener('click', function() {
    filter('Typescript');
})
document.getElementById('jsf').addEventListener('click', function() {
    filter('Javascript');
})
document.getElementById('cf').addEventListener('click', function() {
    filter('C')
})
document.getElementById('cpf').addEventListener('click', function() {
    filter('C++')
})
document.getElementById('cancle').addEventListener('click', function() {
    filter('C')
})


async function filter(val) {
    document.getElementById('main').innerHTML = ''
    languages.push(val);
    await start();
}
