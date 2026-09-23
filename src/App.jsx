import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";

import AppLayout from "./components/layout/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Language from "./pages/Language";

import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import GroupDetails from "./pages/GroupDetails";

import AddExpense from "./pages/AddExpense";
import ExpenseDetails from "./pages/ExpenseDetails";

import Settlement from "./pages/Settlement";
import Payment from "./pages/Payment";

import Insights from "./pages/Insights";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import { useAuth } from "./hooks/useAuth";

import GroupExpenses from "./pages/GroupExpenses";
import GroupMembers from "./pages/GroupMembers";
import { useQueryClient } from "@tanstack/react-query";
import EditGroup from "./pages/EditGroup";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function Protected({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" replace />;
}

function HomeRoute() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Landing />;
}

export default function App() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    let backListener = null;
    let disposed = false;

    const setupBackButton = async () => {
      const listener = await CapacitorApp.addListener("backButton", ({ canGoBack }) => {
        console.log("ANDROID BACK:", canGoBack);

        if (canGoBack) {
          navigate(-1);
          return;
        }

        CapacitorApp.exitApp();
      });

      if (disposed) {
        listener.remove();
      } else {
        backListener = listener;
      }
    };

    setupBackButton();

    return () => {
      disposed = true;

      if (backListener) {
        backListener.remove();
        backListener = null;
      }
    };
  }, [navigate]);

  // update groups

  useEffect(() => {
    let appStateListener = null;

    const setupAppStateListener = async () => {
      appStateListener = await CapacitorApp.addListener("appStateChange", ({ isActive }) => {
        if (!isActive) return;

        console.log("APP ACTIVE → REFRESHING DATA");

        queryClient.invalidateQueries({
          queryKey: ["group"],
        });

        queryClient.invalidateQueries({
          queryKey: ["groups"],
        });
      });
    };

    setupAppStateListener();

    return () => {
      appStateListener?.remove();
      appStateListener = null;
    };
  }, [queryClient]);

  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/language" element={<Language />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      {/* =========================
          PROTECTED APP
      ========================= */}

      <Route
        path="/app"
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        {/* /app */}

        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />

        <Route path="groups" element={<Groups />} />

        <Route path="groups/create" element={<CreateGroup />} />

        <Route path="groups/:groupId" element={<GroupDetails />} />

        <Route path="/app/groups/:groupId/edit" element={<EditGroup />} />

        <Route path="groups/:groupId/expenses" element={<GroupExpenses />} />

        <Route path="groups/:groupId/members" element={<GroupMembers />} />

        <Route path="groups/:groupId/expense/add" element={<AddExpense />} />

        <Route path="groups/:groupId/expense/:expenseId" element={<ExpenseDetails />} />

        <Route path="groups/:groupId/settlement" element={<Settlement />} />

        <Route path="groups/:groupId/payment/:paymentId" element={<Payment />} />

        <Route path="groups/:groupId/insights" element={<Insights />} />

        <Route path="activity" element={<Activity />} />

        <Route path="profile" element={<Profile />} />

        <Route path="settings" element={<Settings />} />
      </Route>

      {/* =========================
          FALLBACK
      ========================= */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
