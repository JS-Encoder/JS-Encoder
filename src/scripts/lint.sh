# eslint
set -e
echo -e "\e[1;;34mExecute eslint \e[0m"
eslint --ext .ts,.vue src/ --fix || (echo  -e "\e[1;;31m❌ Eslint verification failed, please check the corresponding file \e[0m"; exit 1)
echo ""

# stylelint
echo -e "\e[1;;34mExecute stylelint \e[0m"
stylelint "./src/**/*.{css,scss,vue}" --fix || (echo  -e "\e[1;;31m❌ Stylelint verification failed, please check the corresponding file \e[0m"; exit 1)
echo ""