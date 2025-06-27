# User Directory Application

A modern, responsive React + TypeScript application for displaying and managing users from an external API. Features a professional UI inspired by Material Design, with table layout, modal dialogs, search, sorting, and pagination.

## Features

- **User Table**: Displays users in a clean, sortable, paginated table.
- **Search**: Filter users by name, email, or company in real time.
- **Sorting**: Clickable column headers for sorting by name, email, or company (ascending/descending).
- **Pagination**: Navigate through users with page numbers and Previous/Next buttons.
- **User Details Modal**: Click a row to view all user details in a modal dialog, including a map link.
- **Delete User**: Remove users from the list (client-side only) with confirmation modal.
- **Responsive & Accessible**: Works great on all screen sizes, keyboard accessible, and ARIA-friendly.
- **Modern UI**: Styled with TailwindCSS and react-icons for a Material-inspired look.

## Technologies Used

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [react-router-dom](https://reactrouter.com/)
- [react-icons](https://react-icons.github.io/react-icons/)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open in your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Project Structure

- `src/UserDirectoryPage.tsx` — Main user directory page with all features
- `src/App.tsx` — App routing and page structure
- `src/` — Other components and assets

## Further Development

- Add unit and integration tests (e.g., with Jest, React Testing Library, or Vitest)
- Add more filters (by city, company, etc.)
- Add user creation/editing (with forms and validation)
- Connect to a real backend for persistent data
- Improve accessibility and add more keyboard shortcuts

## License

This project is for educational/demo purposes. Feel free to use and modify!
