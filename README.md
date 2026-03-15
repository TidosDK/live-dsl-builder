# Live DSL Builder

Live DSL Builder is a web-based DSL builder with real-time feedback powered by technologies including [Antlr](https://github.com/antlr), [Chevrotain](https://github.com/Chevrotain/chevrotain), [D3.js](https://github.com/d3/d3), and others. The builder allows the user to define custom grammars (Meta DSL) and write application code (Application DSL) with instant visualized feedback.

The Meta DSL uses a modified version of the Antlr [`bnf.g4`](https://github.com/antlr/grammars-v4/blob/cc8a65228690de9ac00c8cd1c4f9a9962d0aef13/ebnf/bnf.g4) file. The custom `.g4` file for this project is located under [`src/antlr/bnf.g4`](/src/antlr/bnf.g4).

## Features

- **Real-Time Parsing:** Instantly compiles Meta DSL into a grammar where the user can write an Application DSL.
- **Visualizations:** Generates a Abstract Syntax Tree (AST) to visualize the Application DSL and a Railroad syntax diagram to visualize the Meta DSL.
- **DSL Highlighting:** Hovering over nodes in the AST or Railroad diagram highlights the exact source code in the Meta/Application Editor.
- **Instant Feedback:** Provides instant feedback on both the Meta DSL and Application DSL either saying the code is valid or provides errors.

## How to Run it Locally

To run the application in development mode:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development servers (Express and Vite):**

   ```bash
   npm run dev
   ```

3. **Open a browser:**
   Navigate to `http://localhost:3000`

## How to Run it Inside Docker

Use the existing `Dockerfile` to build and run the application with Docker.

1. **Build the Docker image:**

   ```bash
   docker build -t live-dsl-builder .
   ```

2. **Run the container:**

   ```bash
   docker run -p 3000:3000 live-dsl-builder
   ```

3. **Open a browser:**
   Navigate to `http://localhost:3000`

## License

This project is licensed under the [MIT License](LICENSE).
