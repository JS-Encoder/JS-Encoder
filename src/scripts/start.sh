if ! ./src/scripts/lint.sh
then
echo -e "\e[1;;31m❌ Lint check failed \e[0m"
exit 1
else
echo -e "\e[1;;32m✔ Lint check completed \e[0m"
fi

echo ""

# start
echo -e "\e[1;;32m🚀 start vite \e[0m"
vite