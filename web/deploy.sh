git add .
git commit -m 'deploy.sh'
git push origin master
docker build -t xapi .
heroku container:push web --app domaintoken
