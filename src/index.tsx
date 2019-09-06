import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import { fromHTML, toReact, toHTML } from "./transforms";

type stateType = {
  html: string;
  json: string;
  react: React.ReactNode;
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "save:html":
      let json = fromHTML(action.html);
      return {
        html: action.html,
        json: JSON.stringify(json),
        react: toReact(json)
      };
    case "save:json":
      let parsed = JSON.parse(action.json);
      return {
        html: toHTML(parsed),
        json: action.json,
        react: toReact(parsed)
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(appReducer, null, state => {
    let html = `<h1>Heading</h1>`;
    let json = fromHTML(html);
    return {
      html: html,
      json: JSON.stringify(json),
      react: toReact(json)
    };
  });
  return (
    <table className="editor">
      <thead>
        <tr>
          <th>HTML</th>
          <th>JSON</th>
          <th>React</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="content">
            <textarea
              value={state.html}
              onChange={e =>
                dispatch({ type: "save:html", html: e.target.value })
              }
            />
          </td>
          <td className="content">
            <textarea
              value={state.json}
              onChange={e =>
                dispatch({ type: "save:json", json: e.target.value })
              }
            />
          </td>
          <td className="content">{state.react}</td>
        </tr>
      </tbody>
    </table>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
