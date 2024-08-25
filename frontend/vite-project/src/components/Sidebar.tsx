import { NavLink } from "react-router-dom";
import { FaBook, FaUser, FaGraduationCap } from "react-icons/fa";
import logo from "../assets/logo.png";

function SidebarItem({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: JSX.Element;
}) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `flex items-center p-2 rounded-md transition-colors duration-200 ${
          isActive ? "bg-gray-500" : "hover:bg-gray-500"
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <p>{label}</p>
    </NavLink>
  );
}
const sidebarItems = [
  { label: "Classes", link: "/classes", icon: <FaBook /> },
  { label: "Courses", link: "/courses", icon: <FaGraduationCap /> },
  { label: "Students", link: "/students", icon: <FaUser /> },
];
export default function Sidebar() {
  return (
    <aside className="h-screen primary-color w-48 fixed  left-0 shadow-lg text-white">
      <div className="flex flex-col items-center mt-2">
        <img src={logo} alt="EduSphere Logo" className="w-24 h-24 mb-8" />
      </div>
      <div className="mt-5">
        <ul className="flex flex-col gap-6 p-4">
          {sidebarItems.map(({ label, link, icon }) => (
            <li key={link}>
              <SidebarItem label={label} href={link} icon={icon} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
