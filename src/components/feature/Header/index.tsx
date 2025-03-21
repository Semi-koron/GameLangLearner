import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../lib/auth";
import {
  Navbar,
  Button,
  Input,
  Dialog,
  Dropdown,
  Circle,
} from "reactro-ui-lib";
import type { User } from "@supabase/supabase-js";
import "./style.css";

interface HeaderProps {
  user: User | null;
  avatarUrl?: string;
  userName?: string;
}

function LogInForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogIn = async () => {
    const { data, error } = await login(email, password);
    console.error(error);
    if (!data.session?.access_token) {
      alert("ログインに失敗しました");
      return;
    }
    // ログイン成功時の処理
    //セッションストレージにトークンを保存
    sessionStorage.setItem("token", data.session?.access_token);
    // ページ遷移
    navigate("/dashboard");
  };

  return (
    <form className="modal-content">
      <p>email</p>
      <Input type="email" onChange={(e) => setEmail(e.target.value)} />
      <p>password</p>
      <Input type="password" onChange={(e) => setPassword(e.target.value)} />
      <br />
      <br />
      <Button type="button" onClick={handleLogIn}>
        ログイン
      </Button>
    </form>
  );
}

export default function Header({ user, userName, avatarUrl }: HeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <Navbar
        brand={<h1>GameLangLearner</h1>}
        items={
          <>
            {user ? (
              <>
                <div className="header-wrapper">
                  <Dropdown text={userName}>
                    <Button
                      onClick={() => {
                        sessionStorage.removeItem("token");
                        window.location.reload();
                      }}
                    >
                      Logout
                    </Button>
                  </Dropdown>
                  <Circle
                    width="40px"
                    children={
                      <img
                        src={avatarUrl}
                        style={{
                          width: "100%",
                        }}
                      />
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setIsDialogOpen(true);
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </>
        }
      />
      {isDialogOpen && (
        <>
          <div className="modal-overlay" />
          <div className="modal-wrapper">
            <Dialog
              title="LogIn"
              dialogContent={<LogInForm />}
              onClose={() => {
                setIsDialogOpen(false);
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
