import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { store } from "@/store/store";
import { router } from "@/routes";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  );
}

export default App;
