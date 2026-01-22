import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* NAVBAR */}
      <header className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
        <h2 className="text-xl font-semibold text-yellow-400">ShopCraft Admin</h2>

        <div className="flex items-center gap-4">
          <select className="bg-slate-800 text-sm px-3 py-1 rounded-md">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <span>🔔</span>
          <span>Admin</span>
        </div>
      </header>

      <div className="flex">

        {/* SIDEBAR */}
        <aside className="w-56 bg-slate-950 border-r border-slate-800 p-4">
          <ul className="space-y-2 text-sm">
            <li className="px-3 py-2 rounded-md bg-slate-800 text-yellow-400">
              Dashboard
            </li>
            <li className="px-3 py-2 rounded-md hover:bg-slate-800">Products</li>
            <li className="px-3 py-2 rounded-md hover:bg-slate-800">Orders</li>
            <li className="px-3 py-2 rounded-md hover:bg-slate-800">Customers</li>
            <li className="px-3 py-2 rounded-md hover:bg-slate-800">Payments</li>
            <li className="px-3 py-2 rounded-md hover:bg-slate-800">Analytics</li>
            <li className="px-3 py-2 rounded-md hover:bg-slate-800">Settings</li>
          </ul>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 space-y-6">

          {/* KPI CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat title="Total Revenue" value="₹3,45,000" color="text-yellow-400" />
            <Stat title="Total Orders" value="1,240" />
            <Stat title="Customers" value="820 (+12%)" />
            <Stat title="Net Profit" value="₹1,05,000" color="text-green-400" />
          </section>

          {/* ORDER STATUS */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MiniStat label="Pending" value="120" color="bg-yellow-500" />
            <MiniStat label="Shipped" value="860" color="bg-blue-500" />
            <MiniStat label="Delivered" value="210" color="bg-green-500" />
            <MiniStat label="Cancelled" value="50" color="bg-red-500" />
          </section>

          {/* GRAPHS */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Graph title="Sales Over Time" />
            <Graph title="Revenue vs Profit" />
            <Graph title="Customer Growth" />
          </section>

          {/* TABLES */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* RECENT ORDERS */}
            <div className="lg:col-span-2 bg-slate-950 p-5 rounded-xl">
              <h4 className="font-semibold mb-4">Recent Orders</h4>
              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 text-left">Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <OrderRow id="#1021" user="Rahul" amt="₹2,500" status="Paid" color="text-green-400" />
                  <OrderRow id="#1022" user="Anu" amt="₹1,200" status="Pending" color="text-yellow-400" />
                  <OrderRow id="#1023" user="Vishnu" amt="₹4,300" status="Cancelled" color="text-red-400" />
                </tbody>
              </table>
            </div>

            {/* TOP PRODUCTS */}
            <div className="bg-slate-950 p-5 rounded-xl">
              <h4 className="font-semibold mb-4">Top Products</h4>
              <ul className="space-y-3 text-sm">
                <li>iPhone 14 – 120 sales</li>
                <li>Samsung S23 – 95 sales</li>
                <li>AirPods Pro – 88 sales</li>
                <li>MacBook Air – 60 sales</li>
              </ul>
            </div>
          </section>

          {/* INVENTORY + PAYMENTS */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* LOW STOCK */}
            <div className="bg-slate-950 p-5 rounded-xl">
              <h4 className="font-semibold mb-4">Low Stock Alerts</h4>
              <ul className="text-sm space-y-2 text-red-400">
                <li>Apple Watch (5 left)</li>
                <li>Gaming Mouse (8 left)</li>
                <li>Power Bank (10 left)</li>
              </ul>
            </div>

            {/* PAYMENT METHODS */}
            <div className="bg-slate-950 p-5 rounded-xl">
              <h4 className="font-semibold mb-4">Payment Methods</h4>
              <ul className="text-sm space-y-2">
                <li>UPI – 45%</li>
                <li>Credit Card – 30%</li>
                <li>Debit Card – 15%</li>
                <li>Cash on Delivery – 10%</li>
              </ul>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

/* SMALL HELPERS (still SAME FILE) */
const Stat = ({ title, value, color }) => (
  <div className="bg-slate-950 p-5 rounded-xl">
    <p className="text-slate-400 text-sm">{title}</p>
    <h3 className={`text-2xl font-bold mt-2 ${color || ""}`}>{value}</h3>
  </div>
);

const MiniStat = ({ label, value, color }) => (
  <div className="bg-slate-950 p-4 rounded-xl flex items-center justify-between">
    <span className="text-sm">{label}</span>
    <span className={`px-3 py-1 text-xs rounded-full text-white ${color}`}>
      {value}
    </span>
  </div>
);

const Graph = ({ title }) => (
  <div className="bg-slate-950 p-5 rounded-xl">
    <p className="text-slate-400 text-sm mb-3">{title}</p>
    <div className="h-48 bg-slate-800 rounded-lg flex items-center justify-center">
      📊 Graph
    </div>
  </div>
);

const OrderRow = ({ id, user, amt, status, color }) => (
  <tr className="border-b border-slate-800">
    <td className="py-2">{id}</td>
    <td>{user}</td>
    <td>{amt}</td>
    <td className={color}>{status}</td>
  </tr>
);

export default Dashboard;
