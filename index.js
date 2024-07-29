const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const axios = require('axios');
const fs = require('fs');

// Load configuration and localization
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const localization = JSON.parse(fs.readFileSync('localization.json', 'utf8'));
const countries = JSON.parse(fs.readFileSync('countries.json', 'utf8'));


// Constants
const DISCORD_WEBHOOK_URL = config.discordWebhookUrl;
const BOT_NAME = config.botName || "RevenueCat Bot";
const BOT_AVATAR_URL = config.botAvatarUrl || "";
const LANGUAGE = config.language || "en";
const TIME_ZONE = config.timeZone || "America/New_York";

const selectedLocalization = localization[LANGUAGE] || localization['en'];

function getCountryInfo(countryCode) {
    return countries[countryCode] || { name: 'Unknown', flag: '🏳️' };
}

function createDiscordMessage(event) {
    const {
        type,
        product_id,
        price,
        currency,
        app_user_id,
        country_code,
        event_timestamp_ms,
        period_type,
        purchased_at_ms,
        expiration_at_ms,
        environment,
        entitlement_ids,
        store,
        subscriber_attributes
    } = event;

    const title = selectedLocalization[type] || selectedLocalization["UNHANDLED_EVENT"];
    const color = getColorForEventType(type);

    const formatDate = (timestamp) => new Date(timestamp).toLocaleString(LANGUAGE, { timeZone: TIME_ZONE });
    const countryInfo = getCountryInfo(country_code);

    const fields = [
        { name: selectedLocalization["USER_ID"], value: app_user_id || "N/A", inline: false },
        { name: selectedLocalization["PRODUCT_ID"], value: product_id || "N/A", inline: false },
        { name: selectedLocalization["PRICE"], value: price ? `${price} ${currency}` : "N/A", inline: false },
        { name: selectedLocalization["STORE"], value: store || "N/A", inline: false },
        { name: selectedLocalization["ENVIRONMENT"], value: environment || "N/A", inline: false },
        { name: selectedLocalization["PERIOD_TYPE"], value: period_type || "N/A", inline: true },
        { name: selectedLocalization["ENTITLEMENTS"], value: entitlement_ids ? entitlement_ids.join(", ") : "N/A", inline: false },
        { name: selectedLocalization["COUNTRY"], value: `${countryInfo.flag} ${countryInfo.name}`, inline: true },
        { name: selectedLocalization["PURCHASE_DATE"], value: formatDate(purchased_at_ms), inline: true },
        { name: selectedLocalization["EXPIRATION_DATE"], value: formatDate(expiration_at_ms), inline: true },
    ];

    if (subscriber_attributes && subscriber_attributes.$email) {
        fields.push({ name: selectedLocalization["EMAIL"], value: subscriber_attributes.$email.value || "N/A", inline: false });
    }

    return {
        content: title,  // Title is now outside the embed
        embeds: [{
            color: color,
            fields: fields,
            footer: {
                text: "revenuecat-webhook-notification",
                icon_url: BOT_AVATAR_URL,
            },
            timestamp: new Date(event_timestamp_ms).toISOString()
        }],
        username: BOT_NAME,
        avatar_url: BOT_AVATAR_URL
    };
}

function getColorForEventType(type) {
    const colors = {
        INITIAL_PURCHASE: 0x00ff00,  // Green
        RENEWAL: 0x0000ff,           // Blue
        CANCELLATION: 0xff0000,      // Red
        UNCANCELLATION: 0x00ffff,    // Cyan
        BILLING_ISSUE: 0xffff00,     // Yellow
        UNHANDLED_EVENT: 0x808080    // Gray
    };
    return colors[type] || 0x808080;
}

exports.revenueCatWebhook = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(400).send('Invalid request method');
        }

        try {
            const event = req.body.event;
            if (!event) {
                return res.status(400).send('No event data received');
            }

            const discordMessage = createDiscordMessage(event);

            if (DISCORD_WEBHOOK_URL) {
                await axios.post(DISCORD_WEBHOOK_URL, discordMessage);
            }

            res.status(200).send('Event received and message sent to Discord');
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});