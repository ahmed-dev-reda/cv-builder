import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import NewField from "./NewField";

export default function MoreSections() {
  const moreSections = useSelector(
    (state: RootState) => state.resume.moreSections,
  );
  return (
    moreSections.length > 0 && (
      <div>
        <h2 className="text-center text-2xl mt-4">Additional Sections</h2>
        {moreSections.map((sec) => (
          <NewField info={sec} key={sec.id} />
        ))}
      </div>
    )
  );
}
