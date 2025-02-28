"use client";

import '../styles/globals.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TaskProvider } from './context/TaskContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <TaskProvider>
      <html>
        <body>
          {children}
          <ToastContainer />
        </body>
      </html>
    </TaskProvider>
  );
}
