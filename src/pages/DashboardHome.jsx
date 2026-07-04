import {
  FileText,
  FileCheck,
  FileSignature,
  Users,
} from "lucide-react";
import QuickActions from "../components/dashboard/QuickActions";
import RecentDocuments from "../components/dashboard/RecentDocuments";

const cards = [
  {
    title: "Invoices",
    value: "120",
    icon: <FileText size={26} />,
    color: "bg-blue-500",
  },
  {
    title: "Quotations",
    value: "45",
    icon: <FileCheck size={26} />,
    color: "bg-green-500",
  },
  {
    title: "Agreements",
    value: "18",
    icon: <FileSignature size={26} />,
    color: "bg-purple-500",
  },
  {
    title: "Clients",
    value: "65",
    icon: <Users size={26} />,
    color: "bg-orange-500",
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8 ">

      {/* Welcome */}

      <div className="bg-white rounded-2xl shadow-sm border p-8 ">
        <h1 className="text-3xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your business documents from one place.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {cards.map((card, index) => (

          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-lg duration-300"
          >

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>

              </div>

              <div
                className={`${card.color} w-14 h-14 rounded-xl text-white flex items-center justify-center`}
              >
                {card.icon}
              </div>

            </div>

          </div>

        ))}

      </div>

      <div>
            <QuickActions/>
      </div>
      <div>
            <RecentDocuments/>
      </div>

    </div>
  );
}