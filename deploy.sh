# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git add -A
git commit -m 'deploy'
git push -f https://github.com/gyurt32413/food_ordering_system.git main:gh-pages
cd-