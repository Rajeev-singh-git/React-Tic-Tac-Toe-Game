# # 1. Tic Tac App

---

## Table of Content

1. [Not all content must go into components](#21-creating-backend-rest-apis-for-easybank)
2. [Components - Creating a Reusable Player Component](#22-understanding-Default-Security-Configuration)
3. [useState – Managing Edit Mode](#23-Customizing-Spring-Security-Rules)
4. [Toggle, Pre-populate & Button Caption](#24-Disabling-formLogin()-and-httpBasic())
5. [State Updates: Functional Updater Form of `setState`]()
6. [Two-Way Binding]()
7. [map()` – Dynamically Rendering]()

---

# Static Markup in index.html

### Concepts Learned

- `index.html` can contain static markup that doesn't depend on React.
- The `public/` folder exposes files directly to the browser — no path prefix needed.
- Use components only when UI depends on **state, props, or interactivity**.

##### Practice Code

```html
index.html

<header>
  <img src="game-logo.png" alt="hand drawn tic tac toe game board" />
  <h1>Tic-Tac-Toe</h1>
</header>
<div id="root"></div>
```

---

# Components – Creating a Reusable Player Component

## Concepts Learned

- **Repeated markup** signals a need for a reusable component.
- Components can accept **props** to make them configurable and reusable.
- Created a `Player` component with `name` and `symbol` props to represent each player.
- Wrapped content in a parent `<span className="player">` for styling and added an “Edit” button placeholder.
- Used **self-closing syntax** since no child elements are passed (`<Player />` instead of `<Player></Player>`).

##### Practice Code

```jsx
// Player.jsx
export default function Player({ name, symbol }) {
  return (
    <span className="player">
      <span className="player-name">{name}</span>
      <span className="player-symbol">{symbol}</span>
      <button>Edit</button>
    </span>
  );
}

// App.jsx
<Player name="Player 1" symbol="X" />
<Player name="Player 2" symbol="O" />
```

---

# useState – Managing Edit Mode in a Component

## Concepts Learned

- Used the `useState` hook to track whether a player is in **edit mode**.
- Created a boolean state `isEditing` with an updater `setIsEditing`.
- Added a `handleEditClick()` event handler to toggle state.
- Conditionally rendered either:
  - `<span>` showing player name (when `isEditing` is false)
  - `<input>` field (when `isEditing` is true)
- React re-renders the component when state changes, updating only affected parts of the DOM.

## Practice Code

```jsx
import { useState } from "react";

export default function Player({ name, symbol }) {
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick() {
    setIsEditing(true);
  }

  let playerName = <span className="player-name">{name}</span>;
  if (isEditing) {
    playerName = <input type="text" required />;
  }

  return (
    <span className="player">
      {playerName}
      <span className="player-symbol">{symbol}</span>
      <button onClick={handleEditClick}>Edit</button>
    </span>
  );
}
```

💡 Insight: When identical blocks of JSX appear multiple times, extract a component and drive differences through props — this drastically reduces maintenance cost.  
⚠️ Gotcha: Ensure prop names are consistent across usages; otherwise you'll get `undefined` values in the child component.

---

# Component Instance Isolation

## Concept

When you reuse the same component multiple times (e.g., `<Player />` for Player 1 and Player 2), **React creates separate, isolated instances** of that component — each with its own state, props, and event handlers.

## Key Points

- Each `<Player>` instance has **its own state**.
- Updating state in one instance **does not affect** another.
- The **component definition** (function body) is shared, but **component instances** are independent.
- This is fundamental to React’s architecture and makes complex UI composition safe and predictable.

## Example

```jsx
<Player name="Player 1" symbol="X" />
<Player name="Player 2" symbol="O" />
```

Both use the same `Player` component definition, but React keeps their internal states isolated.

###### Insight

Component isolation is what allows large React apps to scale — you can reuse components freely without worrying about unintended shared state or interference.

###### Gotcha

If you ever see one component’s state change affecting another, it’s usually because state was **lifted up** to a parent (intentionally) or **improperly shared** (e.g., via global variables or context misuse).

---

# Player Edit Mode: Toggle, Pre-populate & Button Caption

## Concepts Learned

- Added local component state with `useState` to track edit mode: `isEditing`.
- Conditionally render either the name `<span>` or an `<input>` when editing.
- Pre-populate the input via the `value` prop using the `name` prop so each instance shows its current name.
- Button caption is dynamic: show `"Save"` when editing, otherwise `"Edit"`.
- Prefer the functional state updater pattern (`setIsEditing(prev => !prev)`) to reliably toggle booleans and avoid stale-state pitfalls.

## Practice Code

```jsx
import { useState } from "react";

export default function Player({ name, symbol }) {
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick() {
    // recommended: functional updater to flip the boolean safely
    setIsEditing(prev => !prev);
  }

  const btnCaption = isEditing ? "Save" : "Edit";

  let playerName = <span className="player-name">{name}</span>;
  if (isEditing) {
    // pre-populates the input with the current player's name
    playerName = <input type="text" required value={name} />;
  }

  return (
    <span className="player">
      {playerName}
      <span className="player-symbol">{symbol}</span>
      <button onClick={handleEditClick}>{btnCaption}</button>
    </span>
  );
}
```

---

# State Updates: Functional Updater Form of `setState`

## Problem with Old Approach

When updating state using direct inversion like `setIsEditing(!isEditing)`, both updates in the same render cycle rely on the **old** state value because React **schedules updates asynchronously**.  
Thus, multiple updates can end up using stale data, leading to unexpected behavior.

Example:

```jsx
setIsEditing(!isEditing);
setIsEditing(!isEditing);
```

Both read the same old `isEditing` value — resulting in no toggle effect.

### Why This Approach

React recommends using the **functional updater form** (`setState(prev => newValue)`) whenever the new state depends on the previous one.  
This ensures React passes the **latest state value** at the time the update is applied, even if multiple updates are batched.

```jsx
 setIsEditing(prevEditing => !prevEditing);
```

## Concepts Learned

- React state updates are **not immediate**; they’re **scheduled** and can be batched.

- Use the **functional updater** when the new value depends on the previous one.

- Avoid referencing the current state variable directly when chaining updates.

- The updater function receives the **most recent** state from React.

```jsx
import { useState } from "react";

export default function Player({ name, symbol }) {
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick() {
    // ✅ Best practice: functional updater for state based on previous value
    setIsEditing(prevEditing => !prevEditing);
  }

  const btnCaption = isEditing ? "Save" : "Edit";

  let playerName = <span className="player-name">{name}</span>;
  if (isEditing) {
    playerName = <input type="text" required value={name}
```

---

# React `useState` – Two-Way Binding (Editable Player Name)

## 🎯 Problem

Currently, the player name displayed in the input field **cannot be edited**.  
This happens because the `value` prop of the `<input>` element **controls** its content.  
When you set a fixed value via the `value` prop, React treats that input as **controlled**,  
and any manual edits by the user get **overwritten** by that value.

#### 🧩 Attempt #1 – Using `defaultValue`

One way to make the input editable is to use the `defaultValue` prop:

```jsx
<input type="text" defaultValue={name} />
```

- `defaultValue` only sets the **initial** value.

- The user can now type into the input.

- ❌ However, clicking **Save** won’t persist the updated name — because we’re not managing the new value in state.

---

#### 💡 Correct Approach – Managing Editable State

To properly manage the editable name, we must:

1. **Create a second piece of state** for the player name.

2. Initialize it with the `initialName` prop.

3. Use an `onChange` handler to capture user input.

4. Update state as the user types.

5. Bind that state back to the input field (two-way binding).

---

#### ⚙️ Implementation

```jsx
import { useState } from "react";

export default function Player({ initialName, symbol }) {
  const [isEditing, setIsEditing] = useState(false);
  const [playerName, setPlayerName] = useState(initialName);

  function handleEditClick() {
    setIsEditing((editing) => !editing);
  }

  function handleChange(event) {
    // event.target.value gives the latest user input
    setPlayerName(event.target.value);
  }

  let editablePlayerName = isEditing ? (
    <input
      type="text"
      required
      value={playerName}
      onChange={handleChange} // 👈 listen to input changes
    />
  ) : (
    <span className="player-name">{playerName}</span>
  );

  return (
    <span className="player">
      {editablePlayerName}
      <span className="player-symbol">{symbol}</span>
      <button onClick={handleEditClick}>
        {isEditing ? "Save" : "Edit"}
      </button>
    </span>
  );
}
```

#### 🧠 How It Works

- `onChange` fires every time the user types or pastes something.

- React passes an **event object** with a `target` (the input element).

- `event.target.value` gives the **latest typed value**.

- We call `setPlayerName()` to store it in state.

- Since `value={playerName}` binds the state back to the input,  
  React re-renders and displays the updated value immediately.

---

#### 🔁 Two-Way Binding

This mechanism — where:

- The UI **reflects state** (`value={playerName}`)

- The state **updates based on user input** (`onChange={handleChange}`)

is known as **two-way binding**.

It ensures that your component and the input field stay perfectly in sync.

---

# `map()` – Dynamically Rendering a Tic-Tac-Toe Board

## 🎯 Goal

Render a **3×3 Tic-Tac-Toe grid** dynamically instead of hardcoding buttons.  
Each cell should be represented by a button, which will later be updated with the player’s symbol (`X` or `O`).

---

### ⚠️ Problem with Hardcoding

Hardcoding the grid (9 buttons manually) is not scalable or reactive.

```jsx
<ol id="game-board">
  <li><button></button><button></button><button></button></li>
  <li><button></button><button></button><button></button></li>
  <li><button></button><button></button><button></button></li>
</ol>
```

❌ Drawbacks:

- Tedious to manage.

- Doesn’t support dynamic updates when the board changes.

- Duplicates layout logic instead of generating it programmatically.

---

### 💡 Dynamic Rendering with `map()`

Use **nested arrays** to represent the grid state and `Array.map()` to render it.

##### Step 1 – Define Initial Board State

```jsx
const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];
```

- The outer array = rows

- The inner arrays = columns

- Each cell can hold `null`, `"X"`, or `"O"`

---

### Step 2 – Build the `GameBoard` Component

```jsx
import React from "react";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export default function GameBoard() {
  return (
    <ol id="game-board">
      {initialGameBoard.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((playerSymbol, colIndex) => (
              <li key={colIndex}>
                <button>{playerSymbol}</button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}

```

---

**Step 3 – Use It in `App.jsx`**

```jsx
import GameBoard from "./components/GameBoard";

export default function App() {
  return (
    <main>
      <GameBoard />
    </main>
  );
}

```

## 🧠 Key React Concepts

### 🪄 1. Nested `map()` for Multidimensional Data

Each row is an array of cells, so you need **two `map()` calls**:

- Outer `map()` → rows

- Inner `map()` → columns (buttons)

### 🔑 2. Keys for List Items

Each dynamically rendered element needs a unique `key`.

- Prefer unique identifiers from data when available.

- Using array **index** (`rowIndex`, `colIndex`) is acceptable here  
  because the grid rows never reorder.

### 💭 3. Dynamic Rendering

The grid now depends entirely on the data structure, not hardcoded HTML.  
When the board updates later (after a click), React can re-render it automatically.

---
