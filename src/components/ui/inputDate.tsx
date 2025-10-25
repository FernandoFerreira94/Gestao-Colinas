import { useAppContext } from "@//context/useAppContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function InputDate() {
  const { setMonth, setYear, month, year } = useAppContext();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const maxDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
  const pathName = usePathname();

  // Carrega valor salvo quando monta
  useEffect(() => {
    async function loadSaved() {
      const savedMonth = localStorage.getItem("month");
      const savedYear = localStorage.getItem("year");
      if (savedMonth && savedYear) {
        setMonth(Number(savedMonth));
        setYear(Number(savedYear));
      }
    }
    loadSaved();
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const [y, m] = e.target.value.split("-").map(Number);
    setMonth(m);
    setYear(y);
    localStorage.setItem("month", m.toString());
    localStorage.setItem("year", y.toString());
  };

  return (
    <div className={`flex flex-col gap-2 ml-auto text-end ${
            pathName !== "/medicao" && "hidden"
          }`} >
      <label
        htmlFor="month" 
        className="text-sm font-medium text-gray-700 dark:text-gray-50 max-sm:hidden"
      >
        Selecione o mês e o ano
      </label>
      <input
        type="month"
        id="month"
        name="month"
        value={`${year}-${String(month).padStart(2, "0")}`}
        max={maxDate}
        className="max-sm:h-10 flex justify-end border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-800 bg-white dark:bg-[#151526] dark:text-gray-50"
        onChange={handleChange}
      />
    </div>
  );
}
