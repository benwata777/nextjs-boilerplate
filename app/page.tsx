'use client';

import { useState } from 'react';

interface TodoItem {
  type: 'Fruit' | 'Vegetable';
  name: string;
}

export default function Home() {
  const [todoList] = useState<TodoItem[]>([
    { type: 'Fruit', name: 'Apple' },
    { type: 'Vegetable', name: 'Broccoli' },
    { type: 'Vegetable', name: 'Mushroom' },
    { type: 'Fruit', name: 'Banana' },
    { type: 'Vegetable', name: 'Tomato' },
    { type: 'Fruit', name: 'Orange' },
    { type: 'Fruit', name: 'Mango' },
    { type: 'Fruit', name: 'Pineapple' },
    { type: 'Vegetable', name: 'Cucumber' },
    { type: 'Fruit', name: 'Watermelon' },
    { type: 'Vegetable', name: 'Carrot' },
  ]);

  const [mainItems, setMainItems] = useState<string[]>(
    todoList.map((item) => item.name)
  );
  const [fruitItems, setFruitItems] = useState<string[]>([]);
  const [vegetableItems, setVegetableItems] = useState<string[]>([]);
  const [timeouts, setTimeouts] = useState<{
    [key: string]: NodeJS.Timeout | null;
  }>({});
  const [itemColumns, setItemColumns] = useState<{
    [key: string]: 'fruit' | 'vegetable' | null;
  }>(todoList.reduce((acc, item) => ({ ...acc, [item.name]: null }), {}));

  const moveToColumn = (itemName: string) => {
    const item = todoList.find((item) => item.name === itemName);
    if (!item) return;

    setMainItems((prev) => prev.filter((name) => name !== itemName));

    if (item.type === 'Fruit') {
      setFruitItems((prev) => [...prev, itemName]);
      setItemColumns((prev) => ({ ...prev, [itemName]: 'fruit' }));
    } else {
      setVegetableItems((prev) => [...prev, itemName]);
      setItemColumns((prev) => ({ ...prev, [itemName]: 'vegetable' }));
    }

    const timeoutId = setTimeout(() => {
      setItemColumns((prev) => {
        const currentColumn = prev[itemName];
        if (currentColumn === 'fruit') {
          setFruitItems((prevFruit) =>
            prevFruit.filter((name) => name !== itemName)
          );
        } else if (currentColumn === 'vegetable') {
          setVegetableItems((prevVeg) =>
            prevVeg.filter((name) => name !== itemName)
          );
        }
        return { ...prev, [itemName]: null };
      });

      setMainItems((prev) => [...prev, itemName]);
      setTimeouts((prev) => ({ ...prev, [itemName]: null }));
    }, 5000);

    setTimeouts((prev) => ({ ...prev, [itemName]: timeoutId }));
  };

  const returnToMainList = (
    itemName: string,
    fromColumn: 'fruit' | 'vegetable'
  ) => {
    const timeoutId = timeouts[itemName];
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeouts((prev) => ({ ...prev, [itemName]: null }));
    }

    if (fromColumn === 'fruit') {
      setFruitItems((prev) => prev.filter((name) => name !== itemName));
    } else {
      setVegetableItems((prev) => prev.filter((name) => name !== itemName));
    }

    setItemColumns((prev) => ({ ...prev, [itemName]: null }));

    setMainItems((prev) => [...prev, itemName]);
  };

  console.log('Item Columns:', itemColumns);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <div className="w-1/3 p-4">
          <h2 className="text-xl font-bold mb-4">Main List</h2>
          {mainItems.map((item, index) => (
            <button
              key={index}
              onClick={() => moveToColumn(item)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded mb-2"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="w-2/3 flex justify-between">
          <div className="w-1/2 p-4">
            <h2 className="text-xl font-bold mb-4">Fruit</h2>
            {fruitItems.map((item, index) => (
              <button
                key={index}
                onClick={() => returnToMainList(item, 'fruit')}
                className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded mb-2"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="w-1/2 p-4">
            <h2 className="text-xl font-bold mb-4">Vegetable</h2>
            {vegetableItems.map((item, index) => (
              <button
                key={index}
                onClick={() => returnToMainList(item, 'vegetable')}
                className="w-full bg-green-200 hover:bg-green-300 text-black font-bold py-2 px-4 rounded mb-2"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
