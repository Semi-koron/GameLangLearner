import { useEffect, useState } from "react";
import { tokenCheck } from "../../../lib/auth";
import { useNavigate } from "react-router-dom";
import { Box, ThemeProvider } from "reactro-ui-lib";
import { User } from "@supabase/supabase-js";
import { fetchUser } from "../../../lib/supabase";
import Header from "../../feature/Header";

import "./style.css";
import PhraseChecker from "../../feature/PhraseChecker";
import { PhraseData } from "../../../models/phrase";
import PasteBox from "../../feature/PasteBox";

function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const navigate = useNavigate();

  const test: PhraseData[] = [
    {
      phrase: "Hello World",
      japanese: "ハローワールド",
      review: new Date(),
      mastered: false,
    },
  ];

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
          <div className="main-wrapper">
            <Box width="100%">
              <div className="box-wrapper">
                <h1>Remember Me?</h1>
                <p>
                  {(() => {
                    const hours = new Date().getHours();
                    if (hours < 12 && hours > 5)
                      return `おはようございます、${userName}`;
                    if (hours < 18 && hours >= 12)
                      return `こんにちは、${userName}`;
                    return `こんばんは、${userName}`;
                  })()}
                  さん
                </p>
                <p>本日も振り返り頑張りましょう</p>
                {test.map((data) => (
                  <PhraseChecker
                    phrase={data.phrase}
                    review={data.review}
                    japanese={data.japanese}
                    mastered={false}
                  />
                ))}
              </div>
            </Box>
            <Box width="100%">
              <div className="box-wrapper">
                <h1>Dashboard</h1>
                <p>ようこそ、{userName}さん</p>
                <PasteBox />
              </div>
            </Box>
          </div>
        </main>
      </ThemeProvider>
    </>
  );
}

export default DashboardPage;
