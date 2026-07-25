# HIS Future Talents 2026 (HFT 2026)

Official website for the **HIS Future Talents 2026** event — 3rd Edition, organized by HIS University, Algiers.

## 🚀 Features

- **Next.js App Router (i18n)**: Multi-language support (French `fr` & Arabic `ar` with RTL layout support).
- **Google Sheets API v4 Integration**: Direct server-side authentication (RS256 JWT) sending company registrations and contact submissions directly to Google Sheets in real time.
- **Rich Responsive UI**: Modern Tailwind CSS design, custom typography (Montserrat & Bahij), interactive video modal, real-time countdown timer, and media coverage showcases.
- **Admin Dashboard**: Live management of registrations and sponsor listings.
- **Security**: Rate limiting, honeypot fields, server-side credential isolation, and strict input validation.

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript / React
- **Styling**: Tailwind CSS, Framer Motion, Lucide Icons
- **Backend API**: Next.js Server Routes & Google APIs (Google Sheets v4)

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
GOOGLE_SHEETS_SPREADSHEET_ID=1fTF5m5vH6NzHH3ZUFHIoF5Ooi9luGUEI2Sf9ntlwp4A
GOOGLE_SERVICE_ACCOUNT_JSON_PATH=/path/to/credentials.json
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 License

All rights reserved © 2026 HIS University, Algiers.
