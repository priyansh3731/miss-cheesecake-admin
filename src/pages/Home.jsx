import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, database, onValue, ref } from "../config";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Overview } from "../component/overview"
import { RecentSales } from "../component/recent-sales"


const Home =()=>{

    const navigate = useNavigate();
    const [total,setTotalOrders] = useState(0);
    const [Unfulfilled,setUnfulfilled] = useState(0);
    const [fulfilled,setFulfilled] = useState(0);


    useEffect(() => {
        // Set up an auth state observer and get user data
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(database, `users/${user.uid}`);
                onValue(userRef, (snapshot) => {
                const userData = snapshot.val();
                if(userData){
                if (userData.role ==="user") {
                    navigate('/login')
                }
            }
            else{
                navigate('/login')
            }
                });
            
            } else {
                navigate("/login")
            }
        });
    }, []);


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
                setTotalOrders(sortedOrders.length)

                const res = sortedOrders.filter(({trackingtrackingid})=>trackingtrackingid!="");

                console.log(res)

                const res2 = sortedOrders.filter(({trackingtrackingid})=>trackingtrackingid=="");

                setFulfilled(res2.length);
                setUnfulfilled(res.length);
            }
        });
    }, []);


    return <>
        <Navbar />
        <div className="flex-col md:flex">
  <div className="flex-1 space-y-4 p-8 pt-6">
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
    </div>
    <div className="flex flex-wrap gap-4">
      <Card className="flex-1 min-w-[250px] max-w-[300px]">
        <CardHeader 
          title={
            <Typography 
              variant="h6" 
              component="div" 
              className="flex items-center justify-between"
            >
              Total Orders
            </Typography>
          } 
        />
        <CardContent className="flex flex-col items-start">
          <Typography variant="h4" component="span">
            {total}
          </Typography>
        </CardContent>
      </Card>
      <Card className="flex-1 min-w-[250px] max-w-[300px]">
        <CardHeader 
          title={
            <Typography 
              variant="h6" 
              component="div" 
              className="flex items-center justify-between"
            >
              Fulfilled Orders
            </Typography>
          } 
        />
        <CardContent className="flex flex-col items-start">
          <Typography variant="h4" component="span">
            {fulfilled}
          </Typography>
        </CardContent>
      </Card>
      <Card className="flex-1 min-w-[250px] max-w-[300px]">
        <CardHeader 
          title={
            <Typography 
              variant="h6" 
              component="div" 
              className="flex items-center justify-between"
            >
              Unfulfilled Orders
            </Typography>
          } 
        />
        <CardContent className="flex flex-col items-start">
          <Typography variant="h4" component="span">
            {Unfulfilled}
          </Typography>
        </CardContent>
      </Card>
    </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader title="Overview" titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader title="Recent Sales" titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
}



export default Home;