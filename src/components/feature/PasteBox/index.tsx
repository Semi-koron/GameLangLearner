"use client";
import { useState } from "react";
import { Box } from "reactro-ui-lib";
import "./style.css";
import { Button } from "pixel-retroui";

export default function PasteBox() {
  const [imgUrl, setImgUrl] = useState<string>("");

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) {
      return;
    }
    // 画像がペーストされているか確認
    const imageData = items[0];
    if (imageData.kind !== "file") {
      return;
    }
    // 画像であるかどうかの確認
    if (imageData.type.startsWith("image/")) {
      const file = imageData.getAsFile();
      if (!file) {
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setImgUrl(imageUrl);
    }
  };

  return (
    <>
      <div>
        {imgUrl === "" ? (
          <Box>
            <div className="paste-box" onPaste={handlePaste}>
              <h2>翻訳したいスクショをペースト</h2>
            </div>
          </Box>
        ) : (
          <Box>
            <div className="paste-box">
              <img
                alt="ペーストされた画像"
                src={imgUrl}
                className="paste-box-image"
              />
              <Button onClick={() => setImgUrl("")}>取り消し</Button>
            </div>
          </Box>
        )}
      </div>
    </>
  );
}
