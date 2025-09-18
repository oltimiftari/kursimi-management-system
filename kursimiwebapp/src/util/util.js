import moment from "moment";

export const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";
    return "€" + Number(num).toLocaleString("de-DE", { minimumFractionDigits: 2 });};



export const prepareIncomeLineChartData = (data = []) => {
    // Group data by date
    const groupedByDate = data.reduce((acc, item) => {
        const dateKey = item.date; // Assuming 'date' is in 'YYYY-MM-DD' format

        if (!acc[dateKey]) {
            acc[dateKey] = {
                date: dateKey, // Keep the raw date for sorting if needed
                totalAmount: 0,
                items: [], // Array to store original items for this date
            };
        }

        acc[dateKey].totalAmount += item.amount;
        acc[dateKey].items.push(item); // Add the original item to the array
        return acc;
    }, {});

    // Convert the grouped object back to an array
    let chartData = Object.values(groupedByDate);

    // Sort the data by date in ascending order for the line chart
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Format the date for the X-axis label
    chartData = chartData.map((dataPoint) => ({
        ...dataPoint,
        month: moment(dataPoint.date).format('Do MMM'), // Formatted date for XAxis
        totalAmountFormatted: addThousandsSeparator(dataPoint.totalAmount)
    }));

    return chartData;
};