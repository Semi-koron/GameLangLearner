import { useEffect, useState } from "react";
import { tokenCheck } from "../../../lib/auth";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "reactro-ui-lib";
import { User } from "@supabase/supabase-js";
import Header from "../../feature/header";

function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    tokenCheck(token).then((res) => {
      if (res.error) {
        navigate("/");
        return;
      }
      setUser(res.data.user);
    });
  }, []);

  return (
    <>
      <ThemeProvider theme="cinnamon">
        <Header user={user} />
        <main>
          <h1>Dashboard</h1>
        </main>
      </ThemeProvider>
    </>
  );
}

export default DashboardPage;
