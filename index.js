const axios = require ("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const fetchPrice = async(url, targetPrice) =>{
    const response = await axios.get(url);
    const html = response.data;
    const pre = cheerio.load(html);
    const priceText = pre('.a-price-whole').text();
    let price = priceText.replace('₹','');
    price = parseInt(priceText.replace(',', ''));
    if(targetPrice>=price){
        sendEmail(url, price);
    }else{
        console.log("too expensive");
    }
}

const sendEmail = async(url, price) =>{
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
        host : 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth:{
            user: testAccount.user,
            pass: testAccount.pass,
        }
    });
    const info = await transport.sendMail({
        from: '"Amisha@test.com"',
        to: 'amisha803301@gmail.com',
        subject: 'amazon watcher',
        text: `${price}- ${url}`,
        html: `<p>${price}</p><p>${url}</p>`,
    });
    console.log(nodemailer.getTestMessageUrl(info));
}

const watchPrice = (priceTarget, url, schedule = '*/5 * * * * *') =>{
    cron.schedule(schedule, () => fetchPrice(url, priceTarget));
}


watchPrice(
    36990,
    "https://www.amazon.in/Daikin-Inverter-Display-Technology-MTKL50U/dp/B0BK1KS6ZD/ref=sr_1_1?_encoding=UTF8&content-id=amzn1.sym.58c90a12-100b-4a2f-8e15-7c06f1abe2be&dib=eyJ2IjoiMSJ9.LpujZ4uISPUK8sa_6yNGVRpIsC1NZyG20gIuO5aq54q1xrB0Mlh-XdidOH1t4b7iE--HWQvaE28MN97jWWDR3YHPZa7640OxV-xQ9bhInrEZbjoVlBmJRr_kn3H6iI7DKigFGxHoatAxniWeljsUBfVDgi_jZPKjaa6UzWo1K_5ag930dHo7xntnq3vEXQBbAYPeog55pqfqPPZFsSOpNJefgb2MGlapKzgPrLOA8HB8Eefv-cif9Vm5SO8K9WL-qSvBqXkSPatnNcK-enEcNNHmB3OrXkVsR7sloJae47A.DVKD9_Z0-ulsNNR_q12HYMgm4be5hifK0GdauZBkac8&dib_tag=se&pd_rd_r=ef888797-a269-48a2-95e4-d00982f1a33c&pd_rd_w=3gFuw&pd_rd_wg=kOrlB&pf_rd_p=58c90a12-100b-4a2f-8e15-7c06f1abe2be&pf_rd_r=478YTFF7YX3AYF3NG7MH&qid=1716544122&refinements=p_85%3A10440599031&rps=1&s=kitchen&sr=1-1&th=1"
    
)
