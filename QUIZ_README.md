# LOTR Character Height Quiz

An interactive quiz game that tests your knowledge of Lord of the Rings character heights!

## Features

- **Multiple Question Types**:
  - Compare two characters' heights
  - Guess a character's exact height
  - Identify the tallest among a group
  - Identify the shortest among a group

- **Dynamic Content**: Questions are generated from the LOTR API's character database
- **Score Tracking**: Keep track of your score and winning streak
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Themed UI**: Middle-earth inspired design with gold accents and rich brown tones
- **Accessibility**: Keyboard navigation, ARIA labels, and proper contrast ratios

## How to Play

1. Start the backend server (see main README for instructions)
2. Navigate to `/quiz` in your browser (e.g., `http://localhost:3001/quiz`)
3. Answer 10 questions about character heights
4. See your final score and try to beat it!

## Question Types

### Compare
"Who is taller?" - Choose between two characters

### Guess
"How tall is [character]?" - Select the correct height from multiple options

### Tallest/Shortest
"Which of these characters is the tallest/shortest?" - Identify the extreme among 4 characters

## Scoring

- Each correct answer adds 1 point to your score
- Maintain a streak by answering consecutively correct
- Final score is shown as a percentage with a personalized message

## Technical Details

- Built with vanilla JavaScript (no framework dependencies)
- Fetches character data from the `/v2/character` API endpoint
- Filters characters with valid height data
- Parses various height formats (cm, m, feet/inches)
- Responsive CSS with support for light/dark mode preferences
- Accessible with keyboard navigation and screen reader support

## Character Height Data

The quiz uses characters from the LOTR API that have height information, including:
- Hobbits (Frodo, Bilbo, Sam, Merry, Pippin)
- Men (Aragorn, Boromir, Éomer)
- Elves (Thingol, Galadriel)
- Dwarves (Dáin, Bifur)
- Ents (Treebeard)
- And many more!

Enjoy testing your knowledge of Middle-earth! 🏔️⚔️
