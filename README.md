# Project 3: Interactive Web Elements

A high-performance showcase of client-side architecture built with **Vanilla JavaScript (ES6+)** and **Tailwind CSS**. This project demonstrates clean DOM manipulation and interface state management structured around the **IPO (Input-Process-Output) design pattern**.

---

# Core Architecture: The IPO Loop

Every component is engineered as a miniature state machine following a single-directional data flow:
* **Input:** Event listeners abstract and capture explicit user signals (`click`, `keydown`).
* **Process:** Synchronous logic blocks evaluate state conditions and calculate interface states.
* **Output:** Safe DOM mutations execute updates across node attributes, layout elements, and CSS variables.

---

# Feature Modules & Engineering Principles

* **Persistent Theme Switcher:** Manages light/dark mode by syncing application state with `localStorage` and toggling root attributes (`data-theme`) to re-cascade CSS variables.
* **Clamped Counter:** Tracks numerical state bound strictly between minimum (0) and maximum (10) limits, dynamically updating relative progress bars and interface layout bounds.
* **Decoupled Tab Switcher:** Isolates styling from behavioral logic. Uses `data-target` flags and switches structural layout visibility using clean `classList` toggles.
* **Secure Todo Engine:** Implements defensive programming against Cross-Site Scripting (XSS) vectors by utilizing explicit element synthesis (`document.createElement`) and strict text parsing (`textContent`).
* **Quiz State Machine:** Operates a linear workflow mapping active indices, scoring thresholds, and feedback logic, resetting the global state runtime smoothly upon completion.
* **Optimized FAQ & Gallery:** Leverages **Event Delegation** by binding single event listeners to parent containers. Uses `.closest()` to intercept bubbling events, reducing memory overhead and eliminating redundant listeners.

---

# Technical Standards

* **Behavioral Layer:** Clean, modern Vanilla JS without external framework dependencies.
* **Decoupled Architecture:** `js-` class prefixes are reserved exclusively as JavaScript DOM hooks, while `is-` prefixes denote active visual state.
* **Immutability First:** Enforces strict code quality rules by prioritizing `const` variable bindings over `let`, and completely omitting `var`.