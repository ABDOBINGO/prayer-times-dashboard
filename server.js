const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Configure CORS for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://prayertimesassistantdashboard.netlify.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: process.env.REACT_APP_SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.REACT_APP_SMTP_USER,
    pass: process.env.REACT_APP_SMTP_PASS,
  },
});

const emailTemplates = {
  en: {
    subject: 'Jummah Prayer Reminder',
    html: (city) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
        <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">Jummah Prayer Reminder</h1>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
            Assalamu Alaikum Wa Rahmatullah,
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
            This is a friendly reminder about the upcoming Jummah prayer in ${city}. The Prophet ﷺ said:
          </p>
          
          <blockquote style="border-left: 4px solid #3498db; margin: 20px 0; padding: 10px 20px; background-color: #f7f9fc;">
            "Whoever performs Ghusl on Friday, goes early to the mosque, walks and does not ride, sits close to the Imam, listens attentively, and does not engage in idle talk, will get the reward of one year of fasting and praying for every step they take."
            <br/>
            <small style="color: #7f8c8d;">- Sunan Ibn Majah</small>
          </blockquote>
          
          <h2 style="color: #2c3e50; margin-top: 20px;">Preparation Checklist:</h2>
          <ul style="color: #34495e; line-height: 1.6;">
            <li>Perform Ghusl (ritual bath)</li>
            <li>Wear clean and presentable clothes</li>
            <li>Apply pleasant perfume</li>
            <li>Go early to the mosque</li>
            <li>Listen attentively to the Khutbah</li>
          </ul>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 8px;">
            <p style="font-size: 18px; color: #2980b9; margin: 0;">
              May Allah accept our prayers and good deeds.
            </p>
          </div>
        </div>
        
        <footer style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
          This is an automated reminder. Please do not reply to this email.
        </footer>
      </div>
    `
  },
  ar: {
    subject: 'تذكير بصلاة الجمعة',
    html: (city) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px; direction: rtl; text-align: right;">
        <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">تذكير بصلاة الجمعة</h1>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
            السلام عليكم ورحمة الله وبركاته،
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
            هذا تذكير ودي بصلاة الجمعة القادمة في ${city}. قال النبي ﷺ:
          </p>
          
          <blockquote style="border-right: 4px solid #3498db; margin: 20px 0; padding: 10px 20px; background-color: #f7f9fc;">
            "من اغتسل يوم الجمعة، وبكّر وابتكر، ومشى ولم يركب، ودنا من الإمام فاستمع ولم يلغُ، كان له بكل خطوة عمل سنة أجر صيامها وقيامها"
            <br/>
            <small style="color: #7f8c8d;">- سنن ابن ماجه</small>
          </blockquote>
          
          <h2 style="color: #2c3e50; margin-top: 20px;">قائمة التحضير:</h2>
          <ul style="color: #34495e; line-height: 1.6;">
            <li>الاغتسال (غسل الجمعة)</li>
            <li>لبس ملابس نظيفة ولائقة</li>
            <li>التطيب</li>
            <li>التبكير إلى المسجد</li>
            <li>الاستماع للخطبة بإنصات</li>
          </ul>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 8px;">
            <p style="font-size: 18px; color: #2980b9; margin: 0;">
              تقبل الله منا ومنكم صالح الأعمال
            </p>
          </div>
        </div>
        
        <footer style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
          هذا تذكير آلي. يرجى عدم الرد على هذا البريد الإلكتروني.
        </footer>
      </div>
    `
  }
};

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.post('/api/send-email', async (req, res) => {
  const { email, language, city } = req.body;
  const template = emailTemplates[language] || emailTemplates.en;

  try {
    await transporter.sendMail({
      from: process.env.REACT_APP_SMTP_USER,
      to: email,
      subject: template.subject,
      html: template.html(city),
    });

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 