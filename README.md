# **Prospecting Outreach App**

This application is a prospecting outreach tool that scrapes **Stack Overflow** for recent posts based on a user's business description. The app leverages OpenAI's GPT models to generate relevant outreach messages by analyzing scraped posts for potential business solutions.

## **Table of Contents**
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Routes](#api-routes)
- [File Structure](#file-structure)
- [License](#license)

## **Features**
- **Business Description Input**: Users can input their business description, and the app will generate relevant keywords.
- **Keyword-based Scraping**: Automatically scrape Stack Overflow posts from the last 24 hours based on keywords generated from the business description.
- **Outreach Message Generation**: Use OpenAI’s GPT-4 model to generate tailored outreach messages to potential prospects based on their posts.
- **Keyword Management**: Users can add, remove, or update generated keywords.
- **Horizontal and Vertical Scrollable Table**: Sleek, modern table to display the scraped posts with pagination and scrollable content.
- **Download CSV**: Option to download contact lists as CSV.

## **Technology Stack**
- **Frontend**: React with Next.js, TypeScript, Tailwind CSS for styling.
- **Backend**: Next.js API routes, OpenAI's GPT-4 API for message generation.
- **Styling**: Tailwind CSS and Material-UI for sleek, modern UI components.

## **Setup and Installation**

### Clone the repository
git clone https://github.com/penelopejordyn/prospecting-outreach-app.git
cd prospecting-outreach-app
### npm run dev
