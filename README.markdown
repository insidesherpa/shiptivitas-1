## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

We have loaded some clients data in Board.js.
Each client is an object of
interface Client {
  id: number,
  name: string,
  description: string,
  status: 'backlog' | 'in-progress' | 'complete,
}

Dragula library has been installed, you can use it by importing it on top of each file that you need

### `import Dragula from 'dragula';`

then use it by calling `Dragula` directly.

Visit Dragula repository on github for more information
[https://github.com/bevacqua/dragula](https://github.com/bevacqua/dragula)