import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./components/Authorization/Auth";

const Home = lazy(() => import("./components/Home/Home"));
const SignUp = lazy(() => import("./components/Authentication/Signup"));
const Signin = lazy(() => import("./components/Authentication/Signin"));
const Verifyotp = lazy(() => import("./components/Authentication/Verifyotp"));
const ForgetPassword = lazy(() => import("./components/Authentication/ForgetPassword"));
const ResetPassword = lazy(() => import("./components/Authentication/ResetPassword"));
const QuizGetStarted = lazy(() => import("./components/Quiz/QuizGetStarted"));
const Quiz = lazy(() => import("./components/Quiz/Quiz"));
const Feed = lazy(() => import("./components/Feed/Feed"));
const Personality = lazy(() => import("./components/Quiz/personality"));
const ProfileSetting = lazy(() => import("./components/Feed/profile/ProfileSetting"));
const Notification = lazy(() => import("./components/Feed/notification/Notification"));
const Admin = lazy(() => import("./components/Admin/Admin"));
const AdminLogin = lazy(() => import("./components/Admin/AdminLogin"));

const App = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen text-purple-600 text-xl">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/admin-login" element={<AdminLogin/>}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<Verifyotp />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/quiz-start" element={<Auth><QuizGetStarted /></Auth>} />
        <Route path="/quiz" element={<Auth><Quiz /></Auth>} />
        <Route path="/feed" element={<Auth><Feed /></Auth>} />
        <Route path="/settings" element={<Auth><ProfileSetting /></Auth>} />
        <Route path="/notifications" element={<Auth><Notification /></Auth>} />
        <Route path="/personality" element={<Auth><Personality/></Auth>}/>
      </Routes>
    </Suspense>
  );
};
export default App; 
