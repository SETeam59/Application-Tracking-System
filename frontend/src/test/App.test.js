import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "../redux/store";

test("renders app component", () => {
  render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
  const pElement = screen.getByText(/Test test/i);
  expect(pElement).toBeInTheDocument();
});
