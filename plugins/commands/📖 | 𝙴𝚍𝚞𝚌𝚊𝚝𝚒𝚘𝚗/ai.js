import axios from 'axios';

const config = {
    name: "ai",
    aliases: ["ai"],
    description: "Interact with the GPT-4 API or analyze images",
    usage: "[query]",
    cooldown: 5,
    permissions: [0],
    credits: "Coffee",
};

async function onCall({ message, args }) {
    const query = args.join(" ") || "hi";
    const userId = message.senderID; // Get user ID from message

    const header = "(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠) | 𝚗𝚘𝚟𝚊 𝚊𝚒 \n・──────────────・";
    const footer = "・───── >ᴗ< ──────・";

    // Check for image attachments in the original message
    if (message.messageReply && message.messageReply.attachments && message.messageReply.attachments[0]?.type === "photo") {
        const attachment = message.messageReply.attachments[0];
        const imageURL = attachment.url;

        const geminiUrl = `https://nash-rest-api-production.up.railway.app/gemini?prompt=${encodeURIComponent(query)}&imgurl=${encodeURIComponent(imageURL)}`;
        try {
            const response = await axios.get(geminiUrl);
            const { vision } = response.data;

            if (vision) {
                return await message.reply(`${header}\n${vision}\n${footer}`);
            } else {
                return await message.reply(`${header}\nFailed to recognize the image.\n${footer}`);
            }
        } catch (error) {
            console.error("Error fetching image recognition:", error);
            return await message.reply(`${header}\nAn error occurred while processing the image.\n${footer}`);
        }
    }

    // Handle text queries using the GPT-4 API
    try {
        const { data } = await axios.get(`https://ccprojectsjonellapis-production.up.railway.app/api/gpt4o?ask=${encodeURIComponent(query)}&uid=${userId}`);

        if (data && data.response) {
            await message.reply(`${header}\n${data.response}\n${footer}`);
        } else {
            await message.reply(`${header}\nSorry, I couldn't get a response from the API.\n${footer}`);
        }
    } catch (error) {
        console.error("Error fetching from GPT-4 API:", error);
        await message.reply(`${header}\nAn error occurred while trying to reach the API.\n${footer}`);
    }
}

export default {
    config,
    onCall,
};
