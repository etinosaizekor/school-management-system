import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="h-screen bg-sky-950 w-40 mt">
      <div className="mt-40">
        <ul className="flex flex-col gap-5">
          <li>
            <Link to="#">Classes</Link>
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
