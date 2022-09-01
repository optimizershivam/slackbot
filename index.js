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
                        say(n+"\n"+a+<img src="https://avatars.slack-edge.com/2022-09-01/4024855487332_3f1442500bfe51a9131c_512.png"/>)
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

(async () => {
  const port = 3000
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();