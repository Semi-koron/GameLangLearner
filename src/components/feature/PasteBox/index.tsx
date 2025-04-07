import { Box, Button } from "reactro-ui-lib";
import "./style.css";

type PasteBoxProps = {
  setImgUrl: (url: string) => void;
  setUploadFile: (file: File | null) => void;
  imgUrl: string;
};

export default function PasteBox({
  setImgUrl,
  setUploadFile,
  imgUrl,
}: PasteBoxProps) {
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
      setUploadFile(file);
      setImgUrl(imageUrl);
    }
  };

  return (
    <>
      <div className="paste-box-wrapper">
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
              <Button
                variant="primary"
                onClick={() => {
                  setImgUrl("");
                  setUploadFile(null);
                }}
              >
                取り消し
              </Button>
            </div>
          </Box>
        )}
      </div>
    </>
  );
}
