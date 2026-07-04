import {
  FilePlus2,
  FileText,
  FileSignature,
  UserPlus,
} from "lucide-react";

const actions = [
  {
    title: "New Invoice",
    icon: <FileText size={22} />,
  },
  {
    title: "New Quotation",
    icon: <FilePlus2 size={22} />,
  },
  {
    title: "New Agreement",
    icon: <FileSignature size={22} />,
  },
  {
    title: "Add Client",
    icon: <UserPlus size={22} />,
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <h2 className="text-xl font-bold mb-5">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {actions.map((item, index) => (
          <button
            key={index}
            className="border rounded-xl p-6 hover:bg-blue-50 hover:border-blue-500 transition"
          >
            <div className="flex flex-col items-center gap-3">
              {item.icon}

              <span className="font-semibold">
                {item.title}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}