# Note Taking App

A simple REST API for a personal note-taking application.

## Setup

1. Clone the repository:

```bash 
git clone https://github.com/elevenelevensoftware/reach-notes-taking-application

cd reach-notes-taking-application

npm install
```

1. Run the app:

```bash 
npm start
```
After running this you should see:
```bash
_______   ____ _____    ____ |  |__     ____   _____/  |_  ____   ______ _____  ______ ______
\_  __ \_/ __ \\__  \ _/ ___\|  |  \   /    \ /  _ \   __\/ __ \ /  ___/ \__  \ \____ \\____ \
 |  | \/\  ___/ / __ \\  \___|   Y  \ |   |  (  <_> )  | \  ___/ \___ \   / __ \|  |_> >  |_> >
 |__|    \___  >____  /\___  >___|  / |___|  /\____/|__|  \___  >____  > (____  /   __/|   __/
             \/     \/     \/     \/       \/                 \/     \/       \/|__|   |__|

Happy days, the server is running on port 3000 
```

1. Run the tests:

```bash 
npm test
```
After running, you should see something similar to:
```bash
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

## API Endpoints


## Create a Note

1. URL: POST /notes
> Headers: Authorization: <auth_token>
> 
> Body: { "title": "<title>", "content": "<content>" }

## Retrieve Notes 
2. URL: GET /notes
>Headers: Authorization: <auth_token>

## Retrieve Single Note
3. URL: GET /notes/:id
> Headers: Authorization: <auth_token>
> 
> Params: id - Note ID

