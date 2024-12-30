"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { database, onValue, ref } from "../config";  // Add your Firebase config imports

export function Overview() {
  const theme = useTheme();
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));

        // Initialize an empty array to track the total orders per day of the week
        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const ordersCount = daysOfWeek.map(day => ({
          name: day,
          total: 0,
        }));

        // Group orders by day of the week and count
        ordersArray.forEach(order => {
          const orderDate = new Date(order.date);
          const dayName = daysOfWeek[orderDate.getDay()];  // Get day name from date
          const dayIndex = daysOfWeek.indexOf(dayName);
          ordersCount[dayIndex].total += 1;  // Increment total for the corresponding day
        });

        setOrdersData(ordersCount);  // Set the state with the processed data
      }
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={ordersData}>
        <XAxis
          dataKey="name"
          stroke={theme.palette.text.secondary}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={theme.palette.text.secondary}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <Bar dataKey="total" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
