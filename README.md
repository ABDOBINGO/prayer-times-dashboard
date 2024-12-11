# Prayer Times Dashboard

A modern dashboard for managing Jummah prayer time notifications. This dashboard allows you to send customized email notifications to subscribers in their preferred language (English or Arabic).

## Features

- Secure dashboard access with password protection
- View all subscribers and their preferences
- Send individual or bulk email notifications
- Bilingual support (English/Arabic)
- Modern UI with loading states and alerts
- Enhanced email templates with Islamic content

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_key
REACT_APP_SMTP_USER=your_smtp_email
REACT_APP_SMTP_PASS=your_smtp_password
REACT_APP_SMTP_PORT=465
REACT_APP_DASHBOARD_PASSWORD=your_dashboard_password
```

4. Start the development server:
```bash
npm start
```

## Usage

1. Access the dashboard and enter the password
2. View all subscribers in the table
3. Send individual emails by clicking the "Send Email" button next to each user
4. Send bulk emails to all users using the "Send Emails to All Users" button
5. Emails will be sent in the user's preferred language (English/Arabic)

## Security

- Dashboard access is protected by password
- Environment variables are used for sensitive information
- SMTP credentials are securely stored
- Supabase security rules are in place

## Technologies Used

- React
- Chakra UI
- Supabase
- Nodemailer
- React Toastify 