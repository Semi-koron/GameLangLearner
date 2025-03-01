import { useEffect, useState } from "react";
import { tokenCheck } from "../../../lib/auth";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "reactro-ui-lib";
import { User } from "@supabase/supabase-js";
import Header from "../../feature/header";
import { fetchUser } from "../../../lib/supabase";

import "./style.css";

function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
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
      fetchUserData();
    });
    const fetchUserData = async () => {
      const data = await fetchUser(token);
      if (data.error) {
        console.error(data.error);
        return;
      }
      setUserName(data.data?.user_name);
      setImgUrl(data.data?.avatar_url);
    };
  }, []);

  return (
    <>
      <ThemeProvider theme="cinnamon">
        <Header user={user} userName={userName} avatarUrl={imgUrl} />
        <main>
          <h1>Dashboard</h1>
          <p>{user?.id}</p>
        </main>
      </ThemeProvider>
    </>
  );
}

export default DashboardPage;
