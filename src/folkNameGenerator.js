const fs = require("fs").promises;
const fileFolk = "txt/vanasonad.txt";

async function getRandomFolkWisdom(){
    const data = await fs.readFile(fileFolk, "utf8");
    let folkWisdom = data.split(";");

    return folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))];
}

module.exports = {folk: getRandomFolkWisdom};