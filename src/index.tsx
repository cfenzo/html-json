import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import { serialize, toReact, toHTML } from "./transforms";

type stateType = {
  html: string;
  json: string;
  react: React.ReactNode;
};
type actionType = {
  type: string;
  payload: any;
};

const appReducer = (state: stateType, action: actionType) => {
  switch (action.type) {
    case "save:html":
      let json = serialize(action.payload);
      return {
        html: action.payload,
        json: JSON.stringify(json),
        react: toReact(json)
      };
    case "save:json":
      let parsed = JSON.parse(action.payload);
      return {
        html: toHTML(parsed),
        json: action.payload,
        react: toReact(parsed)
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(appReducer, null, state => {
    let html = `<h1>Heading</h1>`;
    let json = serialize(html);
    return {
      html: html,
      json: JSON.stringify(json),
      react: toReact(json)
    };
  });
  return (
    <div>
      <h1>simple json representation of html</h1>
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
                  dispatch({ type: "save:html", payload: e.target.value })
                }
              />
            </td>
            <td className="content">
              <textarea
                value={state.json}
                onChange={e =>
                  dispatch({ type: "save:json", payload: e.target.value })
                }
              />
            </td>
            <td className="content">{state.react}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
