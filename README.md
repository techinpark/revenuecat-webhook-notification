# 🚀 RevenueCat Webhook Notification

![stars](https://img.shields.io/github/stars/techinpark/revenuecat-webhook-notification?color=yellow&style=social)
![forks](https://img.shields.io/github/forks/techinpark/revenuecat-webhook-notification?style=social)

[한국어로 보기](./README_KO.md)

This project provides a webhook handler for RevenueCat events, sending notifications to Discord. It's built using Firebase Functions and can be easily deployed to your Firebase project.

## ✨ Features
![](.github/images/screenshot.png)

- 🚀 hook Handles RevenueCat webhook events
- 💬 Sends formatted notifications to Discord / Slack
- 🌐 Supports multiple languages
- 🏳️ Includes country flags and names in notifications
- 🤖 Customizable bot name and avatar

## 📋 Prerequisites

- 📦 Node.js and npm installed
- 🔥 Firebase CLI installed (`npm install -g firebase-tools`)
- 🏗️ A Firebase project set up
- 🔗 A Discord webhook URL

## 🛠️ Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/revenuecat-webhook-notification.git
   cd revenuecat-webhook-notification
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy `config.example.json` to `config.json` and fill in your details:
   ```
   cp config.example.json config.json
   ```

4. Edit `config.json` with your Discord webhook URL, preferred language, and other settings.

## ⚙️ Configuration

The `config.json` file should contain the following:

```json
{
  "discordWebhookUrl": "YOUR_DISCORD_WEBHOOK_URL",
  "slackWebhookUrl": "YOUR_SLACK_WEBHOOK_URL",
  "botName": "RevenueCat Bot",
  "botAvatarUrl": "",
  "language": "en",
  "timeZone": "America/New_York"
}
```

## 🚀 Deployment

1. Login to Firebase:
   ```
   firebase login
   ```

2. Initialize your Firebase project:
   ```
   firebase init functions
   ```

3. Deploy the function:
   ```
   firebase deploy --only functions
   ```

## 📖 Usage

Once deployed, set up a webhook in your RevenueCat dashboard pointing to your Firebase function URL. The function will receive RevenueCat events and send formatted notifications to your specified Discord channel.

## 🎨 Customization

- 🌐 Modify `localization.json` to add or change language translations.
- 🏳️ Edit `countries.json` to update country information.
- 💬 Adjust the `createDiscordMessage` function in `index.js` to change the format of Discord messages.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [RevenueCat](https://www.revenuecat.com/) for their subscription and in-app purchase infrastructure.
- [Firebase](https://firebase.google.com/) for the serverless functions platform.
- [Discord](https://discord.com/) for the webhook integration capabilities.
- [Slack](https://slack.com) for the webhook integration capabilities.

