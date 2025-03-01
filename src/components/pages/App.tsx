import { useEffect, useState } from "react";
import { Button, Dialog, ThemeProvider, Input } from "reactro-ui-lib";
import { useNavigate } from "react-router-dom";
import { tokenCheck } from "../../lib/auth";
import { signUp } from "../../lib/supabase";
import type { User } from "@supabase/supabase-js";
import "./App.css";
import Header from "../feature/header";

function SignUpForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  return (
    <div className="modal-content">
      <p>email</p>
      <Input type="email" onChange={(e) => setEmail(e.target.value)} />
      <p>password</p>
      <Input type="password" onChange={(e) => setPassword(e.target.value)} />
      <p>userName</p>
      <Input type="text" onChange={(e) => setUserName(e.target.value)} />
      <br />
      <br />
      <Button
        type="button"
        onClick={() => {
          signUp(email, password, userName).then((res) => {
            if (res.error) {
              alert("登録に失敗しました");
              return;
            }
            const token = res.token;
            sessionStorage.setItem("token", token);
            navigate("/dashboard");
          });
        }}
      >
        登録
      </Button>
    </div>
  );
}

function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return;
    }
    tokenCheck(token).then((res) => {
      if (res.error) {
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
          <h2>初めに</h2>
          <p>
            こちらのサイトは、ゲームを英語字幕で楽しみつつ、英語力を鍛えようという浅はかな考えのもと
            <br />
            Semikoron(@semikoron110)によって作成されました。
            ほぼ個人で使うようなので、自分が使えたらいいやと思って作成しています。
            需要が高そうなら、もうちょっとマシなものにしようかなと思っています。
          </p>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            新規登録
          </Button>
          {isDialogOpen && (
            <>
              <div className="modal-overlay" />
              <div className="modal-wrapper">
                <Dialog
                  title="signUp"
                  dialogContent={<SignUpForm />}
                  onClose={() => {
                    setIsDialogOpen(false);
                  }}
                />
              </div>
            </>
          )}
        </main>
      </ThemeProvider>
    </>
  );
}

export default Home;
