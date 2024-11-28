const langData = {
    "en_US": {
        "prefix.get": "Prefix is {prefix}"
    }
}

function onCall({ message, getLang, data }) {
    const validTriggers = ["prefix", "Prefix"];

    if (validTriggers.includes(message.body) && message.senderID !== global.botID) {
        message.reply(getLang("prefix.get", {
            prefix: data?.thread?.data?.prefix || global.config.PREFIX
        }));
    }

    return;
}

export default {
    langData,
    onCall
}
