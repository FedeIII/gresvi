import 'core-js/stable';
import 'regenerator-runtime/runtime';
import GitHub from 'github-api';

let gh;
let repository;

async function getCommits() {
  // const me = gh.getUser();
  // const { data: reposData } = await me.listRepos({ type: 'owner' });
  // const repo = reposData.find(rep => rep.name === 'hidden-agenda');
  const { data } = await repository.listCommits();
  return data;
}

async function getFiles(commits) {
  const filesRequests = commits.map(commit =>
    repository.getSingleCommit(commit.sha),
  );
  const files = (await Promise.all(filesRequests)).map(
    ({ data }) => data.files,
  );

  return files;
}

(async function() {
  gh = new GitHub({
    token: 'GITHUB_TOKEN',
  });

  repository = gh.getRepo('FedeIII', 'hidden-agenda');

  const commits = await getCommits();
  const files = await getFiles(commits);

  console.log(files);
})();
