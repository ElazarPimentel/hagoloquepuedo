# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vanilla JavaScript web application called "Cumpleaños de Amigos" (Friends Birthdays) - a bilingual (Spanish/English) birthday tracking app. The application is a single-page application that runs entirely in the browser with no build process or dependencies.

## File Structure

- `index.html` - Main HTML file with bilingual UI structure
- `script.js` - Main application logic in a single `FriendsBirthdayApp` class
- `styles.css` - Complete styling with CSS variables for light/dark themes

## Architecture

The application follows a class-based vanilla JavaScript architecture:

### Core Components

- **FriendsBirthdayApp Class** (`script.js:1-431`) - Main application controller
  - Manages friends data, themes, language switching, and UI interactions
  - Uses localStorage for data persistence with base64 encoding
  - Implements bilingual support with embedded translation objects

### Key Features

- **Data Management**: Friends stored in localStorage as base64-encoded JSON with `friendsApp_` prefix
- **Internationalization**: Built-in Spanish/English translation system with `data-i18n` attributes
- **Theme System**: CSS variables-based light/dark theme switching
- **Age Calculations**: Precise age calculation with years, months, and days
- **Search & Sort**: Real-time friend filtering and sorting by name, age, or next birthday

### Data Storage

- Settings: `friendsApp_lang`, `friendsApp_theme` 
- Friends data: `friendsApp_friends`
- All data is base64 encoded before localStorage storage

## Development

This is a static web application with no build process. Simply open `index.html` in a browser to run the application.

**IMPORTANT**: Never run a web server - the user always has one running already.

### Testing

No formal test framework is configured. Test manually by opening `index.html` in different browsers.

### Key Development Patterns

- Event listeners are set up in `setupEventListeners()` method
- All UI updates go through `renderFriends()` method
- Form submission handled by `handleFormSubmit()` with validation
- State changes automatically save to localStorage via `saveToStorage()`