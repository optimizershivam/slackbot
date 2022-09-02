const { App } = require("@slack/bolt");
const { default: axios } = require("axios");
require("dotenv").config();

const app = new App({
 token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, 
  appToken: process.env.APP_TOKEN
});

 
            app.command("/data", async ({ command, ack, say }) => {
                
                try {
                    await ack();
                    let txt = command.text 
                    if(!txt) {
                        say(txt + "please enter student id")
                    } else {
                        const getdata=async ()=>{
                        let r=await axios.get("http://localhost:8080/student")
                        let d=r.data
                        
                        const result = d.filter(item => item.id == txt);
                        if(result.length){
                             let f=result[0]

                             let n=f.name
                             let a=f.age
                             let e=f.email
                             let b=f.batch
                             let c=f.course
                             let at=f.attendance
                        say("name: "+n+"\n"+"age: "+a+"\n"+"email: "+e+"\n"+"batch: "+b+"\n"+"course: "+c+"\n"+"attendance: "+at)
                        }
                        else{
                            say("please enter valid student id")
                        }
                        }
                        getdata()
      }

    } catch (error) {
      console.log("err")
      console.error(error);
    }
});

app.message(':wave:', async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});

app.message(/^(hi|hello|hey).*/, async ({ context,message, say }) => {
  console.log('message:', message)
  const greeting = context.matches[0];

  await say(`${greeting},<@${message.user}> how are you?`);
});


let currentDate = new Date();

let time = Math.floor((currentDate.setHours(13,18,30))/1000)

const whenSeptemberEnds = time;

app.message('wake me up', async ({ message, client, logger }) => {
  
  try {
    
    const result = await client.chat.scheduleMessage({
      channel: message.channel,
      post_at: whenSeptemberEnds,
      text: 'uth ja bhai'
    });
  }
  catch (error) {
    logger.error(error);
  }
});


(async () => {
  const port = 3000
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();