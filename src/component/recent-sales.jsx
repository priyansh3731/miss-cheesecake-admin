import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { useEffect, useState } from "react";
import { database, onValue, ref } from "../config";  // Add your Firebase config imports

export function RecentSales() {
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));

        // Sort orders by date in descending order
        const sortedOrders = ordersArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get the top 5 most recent orders
        const recentOrdersData = sortedOrders.slice(0, 5).map(order => ({
          name: `${order.firstname} ${order.lastname}`,
          email: order.phonenumber || 'N/A', // Assuming email is available, otherwise default to 'N/A'
          amount: `₹${order.price}`,
          avatar: "/avatars/default-avatar.png"  // Add logic for avatar if needed
        }));

        setRecentOrders(recentOrdersData);
      }
    });
  }, []);

  return (
    <List>
      {recentOrders.map((item, index) => (
        <ListItem key={index} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar src={item.avatar} alt={item.name} />
          </ListItemAvatar>
          <ListItemText
            primary={item.name}
            secondary={
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {item.email}
              </Typography>
            }
          />
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {item.amount}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
}
