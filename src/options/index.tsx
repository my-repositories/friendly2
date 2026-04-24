import { createRoot } from "react-dom/client";
const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  const options = [
    "Reposts",
    "Likes",
    "Subscribers",
    "Members",
    "Comments",
    "Votings"
  ];

  root.render(
    <div className="p-6">
      <h1 className="text-2xl">friendly2</h1>

      <h2 className="text-2xl">Likes.FM</h2>
      <ul>
        {options.map(option => (
          <li className="flex items-center gap-2"> 
            <label>
              <input type="checkbox" />
              &nbsp;
              {option}
            </label>
          </li>
        ))}
      </ul>
      
    </div>
  );
}
