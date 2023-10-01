import { Octokit } from "https://esm.sh/octokit";
import { env } from "./env.js";

const octokit = new Octokit({auth: env.auth});
let repositories = new Map();
async function getRepositories(languages) {
    repositories = new Map();
    try {
        if (languages.length == 0) {
            const response = octokit.request('GET /repositories');
            if ((await response).status == 200) {
                var repos = (await response).data;
                for (var repo of repos) {
                    appendRepository(repo);
                }
                return repositories;
            } else {
                throw new Error("Fail to fetch Repos");
            }
        } else {
            for (var language of languages) {
                const response = await octokit.request('GET /search/repositories', {
                  q: `language:${language}`, 
                });
                if ((await response).status == 200) {
                    var repos = (await response).data.items;
                    for (var repo of repos) {
                        appendRepository(repo);
                    }
                } else {
                    throw new Error("Fail to fetch Repos");
                }
            }
            return repositories;
        }
        
    } catch (error) {
        console.log(error);
    }
    return new Map();
}

async function getIssues(owner, repository) {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repository}/issues', {
            owner,
            repository,
            state: 'open'
        });
        if(response.status === 200) {
             return await(response).data;
        } else {
            throw new Error("Fail to fetch Issues");
        }
    }catch (error) {
        console.log(error);
    }
}

async function getLanguages(owner, repository) {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repository}/languages', {
            owner,
            repository
        });
        if(response.status === 200) {
             return Object.keys(response.data);
        } else {
            throw new Error("Fail to fetch Languages");
        }
    }catch (error) {
        console.log(error);
    }
}

function appendRepository(data) {
    var repo = {
        id: data.id,
        name: data.name,
        owner: data.owner.login,
        full_name: data.full_name,
        description: data.description,
        url: data.html_url,
        issues_url: data.issues_url,
        language_url: data.languages_url
    }
    repositories.set(data.name, repo);
}

export {getIssues, getRepositories, getLanguages}
