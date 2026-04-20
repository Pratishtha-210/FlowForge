# FlowForge HRM 🚀

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%23443E38.svg?style=for-the-badge&logo=react&logoColor=white)

FlowForge is a high-fidelity, production-grade SaaS **Visual Workflow Designer**. It empowers HR, finance, and internal operations teams to build out multi-step automation logic through an elegant, notion-style visual drag-and-drop node graph.

Designed to mirror elite developer tools like *Linear* and *Vercel*, FlowForge separates the core UI layer from a strict, dynamically typed validation engine.

## ✨ Elite Features
- **Visual Node System (React Flow)**: A completely decoupled drag-and-drop canvas supporting custom node definitions.
- **Strict Schema Ecosystem (Zod)**: Forget hardcoded forms. All components declare their configuration structures in a unified `NodeRegistry`. `react-hook-form` resolves exactly against these definitions guaranteeing bullet-proof configurations.
- **Offline Persistence**: Handled flawlessly by Zustand's `persist` middleware; graph interactions instantly save to `localStorage`.
- **Topological Simulation Engine**: Includes a detached mock simulator that traverses your graph sequentially, analyzing cyclical dependencies, isolated nodes, and execution errors. 
- **Glassmorphism UI**: Beautiful, lightweight translucent layers coupled with deep-blur filters to enforce hierarchy and clean SaaS aesthetics natively via Tailwind CSS v4.

---

## 🛠️ Architecture

The repository enforces a strict separation of concerns allowing for rapid scalability and node injection without altering core graphing parameters.

```bash
src/
├── components/       # Pure UI layer (Canvas, ConfigPanel, Sidebar)
├── engine/           # Detached graph algorithms (simulator.ts, validator.ts)
├── registry/         # Single source of truth for Node behaviors & Zod Schemas
├── store/            # Central Zustand store (useWorkflowStore.ts)
└── nodes/            # React Flow node definitions
```

## 🚀 Getting Started

FlowForge utilizes the latest **Vite** bundler configuration. Make sure you have Node > `v18.x` installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pratishtha-210/FlowForge.git
   cd FlowForge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:5173/](http://localhost:5173/) to explore the workflow builder.

---

## 🧠 Extensibility Guide (Adding new Node Types)

To add a completely new structural component to the application, you never have to touch the base mapping array. Simply:
1. Define the node bounds using Zod inside `src/registry/schemas.ts`.
2. Register the component's aesthetic colors, label, and schema mapped directly into `src/registry/index.ts`.
3. Done! The right-hand dynamic ConfigPanel will instantly read your newly injected component, execute bound assertions, and pass standard values straight into the system store.

---
*Built with speed, precision, and elite engineering principles.*
