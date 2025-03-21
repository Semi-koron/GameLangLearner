import { Checkbox, Dropdown } from "reactro-ui-lib";
import type { PhraseData } from "../../../models/phrase";
import "./style.css";

export default function PhraseChecker({ phrase, japanese }: PhraseData) {
  const check = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      console.log("reviewed");
    }
  };

  return (
    <>
      <div className="phrase-wrapper">
        <Dropdown text={phrase} isList={false}>
          <Checkbox label={japanese} onChange={check} />
        </Dropdown>
      </div>
    </>
  );
}
