import React, { useReducer } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { toJSON } from "./html2json";
import { toReact } from "./json2react";
import { toHTML } from "./json2html";

const appReducer = (state, action) => {
  switch (action.type) {
    case "save:html":
      let json = toJSON(action.html);
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
  const [state, dispatch] = useReducer(
    appReducer,
    {
      html: `<h1>Heading</h1>`,
      json: "",
      react: null
    },
    state => {
      let json = toJSON(state.html);
      return {
        html: state.html,
        json: JSON.stringify(json),
        react: toReact(json)
      };
    }
  );
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
