# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Homepage.jsx


If your Redux slice looks like this:
state.auth = {
  loading: false,
  user: true, // or user object
  isAuthenticated: true
};
Then:

useSelector((state) => state.auth) returns:

js
Copy
Edit
{
  loading: false,
  user: true,
  isAuthenticated: true
}

You are accessing the user property from whatever is returned by state.auth in authslice




Why we use write async function inside useEffect ?

React ka component kaam karta hai 2 steps mein:

1.Render hota hai (UI banata hai)
2.Side effects karta hai — jaise API call, timer, etc. — ye hum useEffect() ke andar likhte hain
3.Agar tum direct fetch() likh doge component ke andar:

const data = await fetch("https://api.com"); // ❌ error dega
React bolega: "Main render kar raha hoon, tu beech mein ruk gaya async kaam lekar? Aisa nahi chalega!"



