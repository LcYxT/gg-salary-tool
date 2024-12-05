import SalaryCalculator from "./components/SalaryCalculator";
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  return (
    <div>
      <SalaryCalculator />
      <Analytics/>
    </div>
  );
};

export default App;