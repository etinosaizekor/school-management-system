import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="h-screen primary-color w-40 mt">
      <div className="mt-40">
        <ul className="flex flex-col gap-5 p-10 items-center text-slate-100">
          <li>
            <Link to="/classes">Classes</Link>
          </li>
          <li>
            <Link to="#">Courses</Link>
          </li>
          <li>
            <Link to="#">Students</Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
