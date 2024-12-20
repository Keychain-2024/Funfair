'use client'

import { useState, useEffect } from 'react';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { database } from './firebase';

interface Order {
  id: string;
  itemName: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  profit: number;
  arihantShare: number;
  vanshShare: number;
  yashShare: number;
}

const itemPrices = {
  "Sigma face": 16,
  "Sigma glasses": 8,
  "Air Jorden shoe": 14
};

export default function KeychainOrderTracker() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.entries(data).map(([id, order]) => ({
          id,
          ...(order as Omit<Order, 'id'>)
        }));
        setOrders(orderList);
      } else {
        setOrders([]);
      }
    });
  }, []);

  useEffect(() => {
    if (itemName) {
      setCostPrice(itemPrices[itemName] || 0);
    }
  }, [itemName]);

  const addOrder = (event: React.FormEvent) => {
    event.preventDefault();
    const profit = (sellingPrice - costPrice) * Number(quantity);
    const arihantShare = profit * 0.3;
    const vanshShare = profit * 0.3;
    const yashShare = profit * 0.4;

    const newOrder = {
      itemName,
      quantity: Number(quantity),
      costPrice,
      sellingPrice,
      profit,
      arihantShare,
      vanshShare,
      yashShare
    };

    push(ref(database, 'orders'), newOrder);
    setItemName('');
    setQuantity('');
    setSellingPrice(0);
  };

  const editOrder = (order: Order) => {
    setItemName(order.itemName);
    setQuantity(order.quantity.toString());
    setCostPrice(order.costPrice);
    setSellingPrice(order.sellingPrice);
    deleteOrder(order.id);
  };

  const deleteOrder = (id: string) => {
    remove(ref(database, `orders/${id}`));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Keychain Order Tracker</h1>
      <form onSubmit={addOrder} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemName">
            Item Name
          </label>
          <select
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Item</option>
            <option value="Sigma face">Sigma face</option>
            <option value="Sigma glasses">Sigma glasses</option>
            <option value="Air Jorden shoe">Air Jorden shoe</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
            Quantity
          </label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Quantity</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
              <option key={num} value={num.toString()}>{num}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="costPrice">
            Cost Price
          </label>
          <input
            type="number"
            id="costPrice"
            value={costPrice}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            readOnly
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sellingPrice">
            Selling Price
          </label>
          <input
            type="number"
            id="sellingPrice"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            step="0.01"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Order
          </button>
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded mb-4">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Item Name</th>
              <th className="py-3 px-6 text-left">Quantity</th>
              <th className="py-3 px-6 text-left">Cost Price</th>
              <th className="py-3 px-6 text-left">Selling Price</th>
              <th className="py-3 px-6 text-left">Profit</th>
              <th className="py-3 px-6 text-left">Arihant Share (30%)</th>
              <th className="py-3 px-6 text-left">Vansh Share (30%)</th>
              <th className="py-3 px-6 text-left">Yash Share (40%)</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{order.itemName}</td>
                <td className="py-3 px-6 text-left">{order.quantity}</td>
                <td className="py-3 px-6 text-left">{order.costPrice.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">{order.sellingPrice.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">{order.profit.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">{order.arihantShare.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">{order.vanshShare.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">{order.yashShare.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => editOrder(order)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

