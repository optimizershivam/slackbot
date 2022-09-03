const { App } = require("@slack/bolt");
const { default: axios } = require("axios");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

app.command("/data", async ({ command, ack, say }) => {
  try {
    await ack();
    let txt = command.text;
    if (!txt) {
      say(txt + "please enter student id");
    } else {
      const getdata = async () => {
        let r = await axios.get("https://agile-ridge-08957.herokuapp.com/");
        let d = r.data;

        const result = d.filter((item) => item.id == txt);
        if (result.length) {
          let f = result[0];

          let n = f.name;
          let e = f.email;
          let b = f.batch;
          let c = f.course;
          let at = f.attendance;
          let img = f.image;
          let csbt = f.marks[0].csbt;
          let nem = f.marks[1].nem;
          let dsa = f.marks[2].dsa;
          say({
            blocks: [
              {
                type: "header",
                text: {
                  type: "plain_text",
                  text: `Name: ${n}`,
                  emoji: true,
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*Email:* ${e} \n*Batch:* ${b} \n*Course:* ${c} \n*Attendance:* ${at} \n*CSBT Score:* ${csbt} \n*NEM Score:* ${nem} \n*DSA Score:* ${dsa} `,
                },
                accessory: {
                  type: "image",
                  image_url: img,
                  alt_text: "student image",
                },
              },
            ],
          });
        } else {
          say({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*Please enter valid student Id*",
                },
              },
            ],
          });
        }
      };
      getdata();
    }
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.message(":wave:", async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});

app.message(/^(hi|hello|hey).*/, async ({ context, message, say }) => {
  console.log("message:", message);
  const greeting = context.matches[0];

  await say(`${greeting},<@${message.user}> how are you?`);
});

let currentDate = new Date();
let time = Math.floor(currentDate.setHours(09, 00, 00) / 1000);
const whenSeptemberEnds = time;

app.message("scrum alert", async ({ message, client, logger }) => {
  try {
    const result = await client.chat.scheduleMessage({
      channel: message.channel,
      post_at: whenSeptemberEnds,
      text: "It's time for morning scrum",
    });
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  const port = 3000;
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
