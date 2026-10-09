# BazarDor — Online Shopping Platform

BazarDor is a responsive online shopping web application built with Next.js. It provides a user-friendly interface for browsing products and includes authentication and database integration.

## Live Website

🔗 (https://assignment-07-green.vercel.app/)

## Features

- **Responsive Design:** Works across mobile, tablet, and desktop devices.
- **Product Listing:** Fetches product information from an external API.
- **User Authentication:** Sign up and sign in using Better Auth.
- **Social Login Integration:** Supports Google and GitHub sign-in when the required OAuth credentials are configured.
- **Database Integration:** Uses Neon PostgreSQL for persistent data storage.
- **Modern UI:** Built with reusable React components and Next.js.
- **Deployment:** Deployed on Vercel.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS / CSS
- Better Auth
- Neon PostgreSQL
- REST API
- Vercel
- Git and GitHub

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone [Repository link](https://github.com/diptadevroy091-gif/Assignment-07)
   ```

2. Navigate to the project directory:

   ```bash
   cd assignment-07
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root and configure the required environment variables.

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.abcz.workers.dev/api/bazardor
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=your_new_secret
   DATABASE_URL=your_neon_database_connection_string
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   ```

   Replace the placeholder values with your own valid credentials. Configure OAuth credentials if you want to enable Google or GitHub login.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API

The application uses the following external API:

- **Base URL:** `https://api.abcz.workers.dev/api/bazardor`
- **Products endpoint:** `/products`

Product availability depends on the external API service. If the service reaches its request limit or becomes unavailable, product data may not load until the issue is resolved.

## Deployment

The project is deployed using Vercel.

For production deployment, configure all required environment variables in the Vercel project settings. Set `BETTER_AUTH_URL` to the actual production website URL and use valid production database credentials and a secure authentication secret.

## Environment Variables

Keep credentials and secrets private. Never commit `.env.local` or expose database passwords and authentication secrets in public repositories.

## Author

Developed as part of Programming Hero Assignment-07.

## License

This project was created for educational purposes.
