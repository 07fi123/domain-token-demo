# heroku login
# git config remote.origin.url https://{USERNAME}:{PASSWORD}@github.com/{USERNAME}/{REPONAME}.git
git add .
git commit -m $1
git push origin master
docker build -t xapi .
heroku container:push web --app domaintoken
