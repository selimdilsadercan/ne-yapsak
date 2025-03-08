# Ne Yapsak?

## Overview

Ne Yapsak? is a social event planning app designed for friends and friend groups to collaboratively decide on activities. Users can create event ideas, vote on plans, and confirm attendance. Additionally, a queue feature allows groups to swipe through suggested plans when they struggle to decide.

## Features

- **User Authentication**: Secure user sign-up and login.
- **Friend Management**: Add friends and connect them with other users.
- **Plan Ideas (To-Dos)**: Create and manage a list of potential activities.
- **Group Voting & Confirmation**: Share plan ideas with friend groups where members can vote or confirm participation.
- **Event Queue System**: When a group is undecided, they can swipe left or right on suggested plans to find an activity.

## Tech Stack

- **Frontend**: Next.js (React framework for server-side rendering and static site generation)
- **Backend**: Convex (serverless database and backend logic)
- **Authentication**: Clerk
- **Database**: Convex (real-time and structured data storage)
- **UI Framework**: Tailwind CSS for styling
- **State Management**: React Context API or Zustand for state handling
- **Hosting**: Vercel (for seamless Next.js deployment)

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/ne-yapsak.git
   cd ne-yapsak
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file
   - Add necessary API keys and configuration
4. Run the development server:
   ```sh
   npm run dev
   ```
5. Open `http://localhost:3000` to view the app.

## Folder Structure

```
/ne-yapsak
├── public/            # Static assets
├── app/               # Next.js pages
├── components/        # Reusable React components
├── lib/               # API calls, Convex queries
├── styles/            # Global styles (Tailwind CSS)
├── convex/            # Convex backend logic
└── .env.local         # Environment variables (ignored in Git)
```

## Future Enhancements

- **Notifications**: Push notifications for event updates.
- **Group Chat**: Real-time messaging within event groups.
- **Calendar Integration**: Sync planned events with Google Calendar.

