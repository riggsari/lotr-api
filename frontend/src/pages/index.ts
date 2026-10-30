import Home from "./Home";
import Documentation from "./Documentation";
import About from "./About";
import Account from "./Account";
import SignUp from "./SignUp";
import Login from "./Login";
import NotFoundPage from "./NotFoundPage";
import WhoSaidIt from "./WhoSaidIt";

export const Pages: Record<string, React.FC> = {
  Home: Home,
  Documentation: Documentation,
  About: About,
  Account: Account,
  SignUp: SignUp,
  Login: Login,
  WhoSaidIt: WhoSaidIt,
  NotFoundPage: NotFoundPage,
};
