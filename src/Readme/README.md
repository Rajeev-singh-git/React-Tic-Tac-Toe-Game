# # 1. Tic Tac App

---

## Table of Content

1. [Not all content must go into components](#21-creating-backend-rest-apis-for-easybank)
2. [Components - Creating a Reusable Player Component](#22-understanding-Default-Security-Configuration)
3. [useState – Managing Edit Mode](#23-Customizing-Spring-Security-Rules)
4. [Toggle, Pre-populate & Button Caption](#24-Disabling-formLogin()-and-httpBasic())

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
