const Discord = require("discord.js");
const axios = require("axios");

const client = new Discord.Client({
    intents: 3276799
});

async function fetchDataAndSendMessage() {
    try {
        const response = await axios.get("https://www.coordinadorausa.com/api/frontend/v1/casillero/despachos/rastreo/692048");

        const generalChannel = client.channels.cache.find(channel => channel.name === "envio-maky");

        if (generalChannel) {
            // Eliminar mensajes antiguos en el canal
            await generalChannel.messages.fetch({ limit: 10 }) // Adjust the limit as needed
                .then(messages => {
                    generalChannel.bulkDelete(messages);
                });

            // Obtener la última descripción
            const lastStatus = response.data.estados[response.data.estados.length - 1];
            const formattedMessage = lastStatus
                ?`╔═══════════════════════╗\n` +
                 `𝐄𝐧𝐯𝐢𝐨\n` +
                 `**Descripcion:**        ${lastStatus.descripcion}:two_hearts:\n` +
                 `**Fecha:**                            ${lastStatus.fecha}\n` +
                 `**Hora:**                              ${lastStatus.hora}\n` +
                 `╚═══════════════════════╝`
                : "No hay datos disponibles";

            // Enviar el nuevo mensaje con la última descripción formateada
            generalChannel.send(formattedMessage);

        } else {
            console.error("No se encontró el canal 'envio-maky'");
        }
    } catch (error) {
        console.error("Error al obtener la respuesta de la API:", error.message);
    }
}



client.on("ready", async () => {
    console.log("Estoy viva CTM");

    fetchDataAndSendMessage();

    setInterval(fetchDataAndSendMessage, 5 * 60 * 1000);
});

client.login("MTE5MDY5NTQ5NDE1NDk3NzI4MA.GZcEe4.utb2Ylg-2-Rer9z_q6n4YDKMNlRgnkri2bjEDY");


