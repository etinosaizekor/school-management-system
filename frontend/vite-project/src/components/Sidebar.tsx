import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="h-screen primary-color w-40">
      <div className="mt-20">
        <ul className="flex flex-col gap-5 p-10 items-center text-slate-100">
          <li>
            <Link to="/classes">
              <p>Classes</p>
            </Link>
          </li>
          <li>
            <Link to="/courses">
              <p>Courses</p>
            </Link>
          </li>
          <li>
            <Link to="#">
              <p>Students</p>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
