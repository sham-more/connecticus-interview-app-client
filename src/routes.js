// routes.js
import Icon from "@mui/material/Icon";
import QuizScreen from "layouts/quiz-screen";
import SignIn from "layouts/sign-in";
import UserProfile from "./pages/Dashboard/UserProfile";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import SignUp from "pages/SignUp";

const routes = [
  {
    name: "Quiz",
    icon: <Icon>dashboard</Icon>,
    route: "/quiz-screen",
    component: QuizScreen,
    roles: "USER"


  },
  {
    name: "Sign In",
    icon: <Icon>account_box</Icon>,
    route: "/sign-in",
    component: SignIn,
  },
  {
    name: "Sign Up",
    icon: <Icon>account_box</Icon>,
    route: "/sign-up",
    component: SignUp,
  },
  {
    name: "User Profile",
    route: "/user/profile",
    component: UserProfile,
    roles: "USER"


  },
  {
    name: "Admin Dashboard",
    route: "/admin/dashboard",
    component: AdminDashboard,
    roles: "ADMIN"

  },
  {
    name: "Unauthorized",
    route: "/unauthorized",
    component: Unauthorized,
  },
];

export default routes;
