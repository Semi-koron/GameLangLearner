import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../lib/auth";
import { Navbar, Button, Input, Dialog } from "reactro-ui-lib";

function LogInForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogIn = async () => {
    const { data, error } = await login(email, password);
    if (error) {
      alert(error);
      return;
    }
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
      <Button onClick={handleLogIn}>ログイン</Button>
    </form>
  );
}

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <Navbar
        brand={<h1>GameLangLearner</h1>}
        items={
          <>
            <Button
              size="sm"
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              Login
            </Button>
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
