import { useAppContext } from "@//context/useAppContext";

// Input para selecionar o mês
export function InputDate() {
  const { setMonth, setYear, month, year } = useAppContext();

  // Get the current date to set the max attribute for the input.
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed, so we add 1.

  // Format the current date as 'YYYY-MM' to match the input's expected format.
  const maxDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-2 ml-auto text-end ">
      <label
        htmlFor="month"
        className="text-sm font-medium text-gray-700 dark:text-gray-50"
      >
        Selecione o mês e o ano
      </label>
      <input
        type="month"
        id="month"
        name="month"
        value={`${year}-${String(month).padStart(2, "0")}`}
        // Set the max attribute to the current month and year.
        max={maxDate}
        className="flex justify-end border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-800 bg-white dark:bg-[#151526] dark:text-gray-50"
        onChange={(e) => {
          const [year, month] = e.target.value.split("-").map(Number);
          setMonth(month);
          setYear(year);
        }}
      />
    </div>
  );
}
