import { useState } from "react";
import { Button, Dialog, ThemeProvider, Input } from "reactro-ui-lib";
import { signUpNewUser } from "../../lib/auth";

import "./App.css";
import Header from "../feature/header";

function SignUpForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="modal-content">
      <p>email</p>
      <Input type="email" onChange={(e) => setEmail(e.target.value)} />
      <p>password</p>
      <Input type="password" onChange={(e) => setPassword(e.target.value)} />
      <br />
      <br />
      <Button
        onClick={() => {
          signUpNewUser(email, password);
        }}
      >
        登録
      </Button>
    </div>
  );
}

function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <>
      <ThemeProvider theme="cinnamon">
        <Header />
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
