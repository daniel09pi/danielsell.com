<?php

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo "Invalid request.";
    exit;
}

$message = htmlspecialchars($data["message"]);
$contact = htmlspecialchars($data["contact"]);

$botToken = "8778303494:AAGC3x8j1wt2cPVeHd9V_SCoqxGKgpV37Ps";
$chatId = "8711776647";

$text = "🚀 Neue Website Nachricht\n\n";
$text .= "Message:\n$message\n\n";
$text .= "Contact:\n$contact";

$url = "https://api.telegram.org/bot$botToken/sendMessage";

$params = [
    "chat_id" => $chatId,
    "text" => $text
];

file_get_contents($url . "?" . http_build_query($params));

echo "OK";
?>


<!-- Done! Congratulations on your new bot. You will find it at t.me/danielsellcom_bot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you've finished creating your cool bot, ping our Bot Support if you want a better username for it. Just make sure the bot is fully operational before you do this.

Use this token to access the HTTP API:
8778303494:AAGC3x8j1wt2cPVeHd9V_SCoqxGKgpV37Ps
Keep your token secure and store it safely, it can be used by anyone to control your bot.

For a description of the Bot API, see this page: https://core.telegram.org/bots/api

chatid: 8711776647

-->


