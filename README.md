# Where to Meet — Social Platform for Chatting, Matching, and Event Planning

## Introduction

**Tech Stack**  
- **Frontend:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [Pusher](https://pusher.com/), [UploadThing](https://docs.uploadthing.com/), [react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api), Material UI Carousel, Day.js, Shadcn, MUI, TailwindCSS, Radix UI  
- **Backend:** NextAuth (v5, beta), Google OAuth, Drizzle ORM  
- **Database:** PostgreSQL (Neon Database)  

This project is a fully functional social platform I built for my Web Programming final project. It combines real-time chat, user matching, and event management on an interactive map.  

### Key Features
- **User Authentication:** Sign up/login via GitHub or Google accounts using OAuth.
- **User Profiles:**  
  - Edit personal details (display name, gender, age, height, weight, bio) and upload profile pictures.  
  - View other users’ profiles and start private chats.  
- **Recommendation System:**  
  - Browse suggested users with like/dislike functionality.  
  - Filter and search by name or gender.  
  - Access paired, liked, and disliked user lists.  
- **Events on Google Maps:**  
  - Create and view public or private events with map-based location markers.  
  - Switch between standard and satellite map views, search events, and navigate to event locations.  
  - Event details include title, description, labels, and start/end times.  
  - Join, leave, or invite paired users to events.  
- **Chatrooms:** Real-time messaging using Pusher.  
- **Responsive UI:** Navigation bar, dropdown menus, and well-structured pages for smooth interaction.  

---

## Setup Instructions

### 1. Install Dependencies
```bash
yarn
```

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in the credentials from the following setups:

#### Pusher Setup
1. Install Pusher:
   ```bash
   yarn add pusher pusher-js
   ```
2. Create an account at [Pusher](https://pusher.com/) and set up a new Channels app.
3. Copy `app_id`, `key`, `secret`, and `cluster` into `.env.local`:
   ```text
   PUSHER_ID=<app_id>
   NEXT_PUBLIC_PUSHER_KEY=<key>
   PUSHER_SECRET=<secret>
   NEXT_PUBLIC_PUSHER_CLUSTER=<cluster>
   ```
4. Enable authorized connections in App Settings.

#### NextAuth Setup
1. Install NextAuth v5:
   ```bash
   yarn add next-auth@beta
   ```
2. Get GitHub OAuth credentials from [GitHub Developer Settings](https://github.com/settings/developers).
3. Add to `.env.local`:
   ```text
   AUTH_GITHUB_ID=<Client ID>
   AUTH_GITHUB_SECRET=<Client Secret>
   AUTH_SECRET=<random-string>
   ```

#### Google OAuth Setup
1. Create credentials in [Google Cloud Console](https://console.cloud.google.com/).
2. Add to `.env.local`:
   ```text
   GOOGLE_CLIENT_ID=<Client ID>
   GOOGLE_CLIENT_SECRET=<Client Secret>
   ```

#### UploadThing Setup
1. Create an app at [UploadThing Dashboard](https://uploadthing.com/dashboard).
2. Add to `.env.local`:
   ```text
   UPLOADTHING_SECRET=<Secret>
   UPLOADTHING_APP_ID=<App ID>
   ```

#### Google Maps API Setup
1. Enable “Maps JavaScript API”, “Geocoding API”, and “Places API” in [Google Cloud Console](https://console.cloud.google.com/).
2. Create and restrict an API key to those APIs.
3. Add to `.env.local`:
   ```text
   GOOGLE_MAPS_API_KEY=<API Key>
   ```

#### Database Connection
1. Create a PostgreSQL database on [Neon](https://neon.tech/).
2. Add the connection string to `.env.local`:
   ```text
   POSTGRES_URL=<Connection String>
   ```

### 3. Database Migration
```bash
yarn migrate
```

### 4. Run Development Server
```bash
yarn dev
```

### 5. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.
