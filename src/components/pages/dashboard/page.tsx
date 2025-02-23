import { useEffect, useState } from "react";
import { tokenCheck } from "../../../lib/auth";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "reactro-ui-lib";
import Header from "../../feature/header";

function DashboardPage() {
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    const data = tokenCheck(token);
    console.log(data);
  }, []);
  return (
    <>
      <ThemeProvider theme="cinnamon">
        <Header />
        <main>
          <h1>Dashboard</h1>
        </main>
      </ThemeProvider>
    </>
  );
}

export default DashboardPage;
